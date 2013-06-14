/*globals ko*/

function ChannelViewModel() {

	
	// --- properties
	
	var that = this;
	var  dataService = new EvernymChannelService();
	var  dataServiceM = new EvernymMessageService();
	
	
	this.template = "channelView";
	this.title = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
	
	
	
	$("#" + this.template).live("pagebeforeshow", function(e, data){
								
                                
                                $('#more_messages_button').hide();
								
								if ($.mobile.pageData && $.mobile.pageData.id){
								
									that.activate({id:$.mobile.pageData.id});
								}
								
								else {
									var currentChannel = localStorage.getItem("currentChannel");
									var lchannel = JSON.parse(currentChannel);
                                
                                
                                
                                    if (!(that.channel()[0] && lchannel.id == that.channel()[0].id)){
                                
                                        that.messages([]);
                                    }
                                
                                    that.channel([lchannel]);
                                    that.title(lchannel.name );
                                    that.channelid(lchannel.id);
                                    $.mobile.showPageLoadingMsg("a", "Loading Messages");
									that.getMessagesCommand(that.channelid()).then(gotMessages);
                                    
								
								}
								
		   });
	
	

	
	this.activate = function (channel) {
		
		that.channelid(channel.id);
		//if(that.channel()){
		//    that.channel.removeAll();
		//}
		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		
		that.getChannelCommand(that.channelid()).then(gotChannel);
		
		
		return true;
		
	};
	
	function gotChannel(data){
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem("currentChannel", JSON.stringify(data));
		that.channel([data]);
		that.title(data.name );
        that.channelid(data.id);
        $.mobile.showPageLoadingMsg("a", "Loading Messages");
		
		
        if ($.mobile.pageData && $.mobile.pageData.id){
            that.followChannelCommand().then(postFollow);
	    }
        else {
            that.getMessagesCommand(that.channelid()).then(gotMessages);
        }
        
	}
    
    function postFollow(data){
        that.getMessagesCommand(that.channelid()).then(gotMessages);
        
    }
	
	function gotMessages(data){
		
		
		$.mobile.hidePageLoadingMsg();
		if (data.message && data.message.constructor == Object){
			
			data.message = [data.message];
		}
        
        if (data.more){
            
             $('#more_messages_button').show();
        }
		
		that.messages(data.message);
		
	}
	
    function gotMoreMessages(data){
		
		
		$.mobile.hidePageLoadingMsg();
		
        if (data.more){
            
            $('#more_messages_button').show();
        }
        else {
            $('#more_messages_button').hide();
        }
		
        
        var tmp_messages = that.messages().concat(data.message);
        
        
        that.messages(tmp_messages);
        
		
		
	}
    
    
	function successfulGetChannel(data){
		//logger.log('success Getting Channel ' , null, 'channel', true);
		$.mobile.hidePageLoadingMsg();
		
	}
	
	function successfulDelete(data){
		//router.navigateTo('#/channellist');
		$.mobile.changePage("#" + channelListViewModel.template);
	}
	
	function successfulModify(data){
		//router.navigateTo('#/channellist');
		//logger.log("SUCCESS MODIFY", undefined, "channel", true);
	}
	
	function successfulMessage(data){
		$.mobile.hidePageLoadingMsg();
		//router.navigateTo('#/channellist');
		//logger.log("SUCCESS MESSAGE", undefined, "channel", true);
		that.getMessagesCommand(that.channelid()).then(gotMessages);
		that.message('');
		
	}
	
	function successfulFollowChannel(){
		$.mobile.hidePageLoadingMsg();
		showMessage("Now Following Channel " + $.mobile.pageData.id);
		
	}
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();
		//logger.log("SUCCESS GET MESSAGES" + JSON.stringify(data), undefined, "channel", true);
		
		
	}
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	};
	
	function errorAPIChannel(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (loginPageIfBadLogin(details.code)){
			
            showMessage("Please log in or register to view this channel.");
		}
        else {
		    showMessage("Error Getting Channel: " + ((status==500)?"Internal Server Error":details.message));
		}
            
		//logger.logError('error listing channels', null, 'channel', true);
	}
    
    function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showMessage("Error: " + ((status==500)?"Internal Server Error":details.message));
		
		//logger.logError('error listing channels', null, 'channel', true);
	}
    

    function errorFollowing(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (details.code == 100601){ // we are already following this channel
			that.getMessagesCommand(that.channelid()).then(gotMessages);
		}
        else {
		
		    showMessage("Error Following Channel: " + details.message);
		}
	}
	
	function errorPostingMessage(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showMessage("Error Posting Message: " + details.message);
		//logger.logError('error listing channels', null, 'channel', true);
	}
	
	function errorRetrievingMessages(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showMessage("Error Retrieving Messages: " + ((status==500)?"Internal Server Error":details.message));
		//logger.logError('error listing channels', null, 'channel', true);
	}
	
	this.getChannelCommand = function (lchannelid) {
		
		$.mobile.showPageLoadingMsg("a", "Loading Channel");
		//logger.log("starting getChannel", undefined, "channels", true);
		return dataService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPIChannel});
		
	};
    
    this.showMoreMessagesCommand = function(){
        
        var last_message_id = that.messages()[that.messages().length - 1].id;
        
        $.mobile.showPageLoadingMsg("a", "Loading Messages");
		
		return dataServiceM.getChannelMessages(that.channelid(), last_message_id, {success: successfulMessageGET, error: errorRetrievingMessages}).then(gotMoreMessages);
        
        
    }
	
	this.followChannelCommand = function(){
		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Requesting to Follow Channel");
		return dataService.followChannel(that.channelid(), {success: successfulFollowChannel, error: errorFollowing});
		
	};
	
	this.deleteChannelCommand = function () {

		$.mobile.showPageLoadingMsg("a", "Removing Channel");
		return dataService.deleteChannel(that.channelid(), { success: successfulDelete, error: errorAPI });

	};
    
    this.showChannelList = function(){
        
        
        var relationship = 'O';
        
        if (that.channel()[0]){
            relationship = that.channel()[0].relationship;
        }
        
        if (relationship && relationship == "F"){
            
            $.mobile.changePage("#" + channelsFollowingListViewModel.template);
        }
        else {
            $.mobile.changePage("#" + channelListViewModel.template);
        }
        
    }
	
	this.modifyChannelCommand = function(){
		//logger.log("starting modifyChannel", undefined, "channels", true);
		
		that.title("Channel: " + channel()[0].name );
		return dataService.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	};
	
	this.postMessageCommand = function(){
		//logger.log("postMessageCommand", undefined, "channels", true);
		var messageobj = {text: that.message(), type: 'FYI'};
		return dataServiceM.createChannelMessage(that.channelid(), messageobj, {success: successfulMessage, error: errorPostingMessage});
	};
	
	
	this.refreshMessagesCommand = function(){
		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		that.getMessagesCommand(that.channelid()).then(gotMessages);
	};
	
	this.getMessagesCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		//logger.log("getMessagesCommand", undefined, "channels", true);
		return dataServiceM.getChannelMessages(that.channelid(), undefined, {success: successfulMessageGET, error: errorRetrievingMessages});
	};
   

	
	
}
