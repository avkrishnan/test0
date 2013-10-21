/*globals ko*/

function ChannelBroadcastsViewModel() {

	
	// --- properties
	
	var that = this;
	
	
	this.template = "channelBroadcastsView";
    this.viewid = "V-22";
    this.viewname = "Broadcasts";
    this.displayname = "Broadcasts";
    
    this.hasfooter = true;
    this.isChannelView = true;
    
	this.title = ko.observable();
    this.relationship = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
   
    this.url = ko.observable();
    this.description = ko.observable();
    that.channelIconObj = ko.observable();
    
	this.navText = ko.observable('Channel Menu');
	
    /*
    $("#" + that.template).live("pagebeforecreate", function (e, data) {
                                var panelhtml = $("#globalpanel").html();
                                $(this).find("#gpanel").html(panelhtml);
                                });
    */
    
    this.applyBindings = function(){
        
    };
    
    
	$("#" + this.template).live("pagebeforeshow", function(e, data){
								
                                
                                $('.more_messages_button').hide();
								
								if ($.mobile.pageData && $.mobile.pageData.id){
								
									that.activate({id:$.mobile.pageData.id});
								}
								
								else {
									var currentChannel = localStorage.getItem("currentChannel");
									var lchannel = JSON.parse(currentChannel);
                                
                                
                                
                                    if (!(that.channel()[0] && lchannel.id == that.channel()[0].id)){
                                
                                        that.messages([]);
                                    }
                                
                                    if (lchannel){
                                        that.channel([lchannel]);
                                        that.title(lchannel.name );
                                        that.relationship(lchannel.relationship);
                                        that.channelid(lchannel.id);
                                        that.description(lchannel.description);
                                        that.url(lchannel.normName + '.evernym.com');
                                        that.showMainIcon(lchannel);
                                        $.mobile.showPageLoadingMsg("a", "Loading Messages");
									    that.getMessagesCommand(that.channelid()).then(gotMessages);
                                    }
                                    else {
                                        $.mobile.changePage("#" + loginViewModel.template);
                                    }
								
								}
								
		   });
	
	

	
	this.activate = function (channel) {
		
		that.channelid(channel.id);

		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		
		that.getChannelCommand(that.channelid()).then(gotChannel);
		
		
		return true;
		
	};
	
	this.showMainIcon = function(lchannel){
		if (lchannel.picId ){
			var iconJSON = JSON.parse(lchannel.picId);
			if (iconJSON && iconJSON.id){
				var set = iconJSON.set;
				var id = iconJSON.id;
			
				var mappedIcon2 = selectIconViewModel.mapImage(set, id, 63);
				that.channelIconObj(mappedIcon2);
			}
		}
    };
	
	function gotChannel(data){
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem("currentChannel", JSON.stringify(data));
		that.channel([data]);
		that.title(data.name );
        that.relationship(data.relationship);
        that.channelid(data.id);
        $.mobile.showPageLoadingMsg("a", "Loading Messages");
		
		that.showMainIcon(data);
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
            
             $('.more_messages_button').show();
        }
		
		that.messages(data.message);
		
	}
	
    function gotMoreMessages(data){
		
		
		$.mobile.hidePageLoadingMsg();
		
        if (data.more){
            
            $('.more_messages_button').show();
        }
        else {
            $('.more_messages_button').hide();
        }
		
        
        var tmp_messages = that.messages().concat(data.message);
        
        
        that.messages(tmp_messages);
        
		
		
	}
    
    
	function successfulGetChannel(data){

		$.mobile.hidePageLoadingMsg();
		
	}
	
	function successfulDelete(data){

		$.mobile.changePage("#" + channelListViewModel.template);
	}
	
	function successfulModify(data){
        ;
	}
	
	function successfulMessage(data){
		$.mobile.hidePageLoadingMsg();

		that.getMessagesCommand(that.channelid()).then(gotMessages);
		that.message('');
		
	}
	
	function successfulFollowChannel(){
		$.mobile.hidePageLoadingMsg();
		showMessage("Now Following Channel " + $.mobile.pageData.id);
		
	}
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();

		
		
	}
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	};
	
	function errorAPIChannel(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (loginPageIfBadLogin(details.code)){
			
            showError("Please log in or register to view this channel.");
		}
        else {
		    showError("Error Getting Channel: " + ((status==500)?"Internal Server Error":details.message));
		}
            

	}
    
    function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error: " + ((status==500)?"Internal Server Error":details.message));
		

	}
    

    function errorFollowing(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (details.code == 100601){ // we are already following this channel
			that.getMessagesCommand(that.channelid()).then(gotMessages);
		}
        else {
		
		    showError("Error Following Channel: " + details.message);
		}
	}
	
	function errorPostingMessage(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error Posting Message: " + details.message);

	}
	
	function errorRetrievingMessages(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error Retrieving Messages: " + ((status==500)?"Internal Server Error":details.message));

	}
	
	this.getChannelCommand = function (lchannelid) {
		
		$.mobile.showPageLoadingMsg("a", "Loading Channel");

		return ES.channelService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPIChannel});
		
	};
    
    this.showMoreMessagesCommand = function(){
        
        var last_message_id = that.messages()[that.messages().length - 1].id;
        
        $.mobile.showPageLoadingMsg("a", "Loading Messages");
		
		return ES.messageService.getChannelMessages(that.channelid(), {before: last_message_id}, {success: successfulMessageGET, error: errorRetrievingMessages}).then(gotMoreMessages);
        
        
    }
	
	this.followChannelCommand = function(){
		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Requesting to Follow Channel");
		return ES.channelService.followChannel(that.channelid(), {success: successfulFollowChannel, error: errorFollowing});
		
	};
    
    
    this.unfollowChannelCommand = function(){
	   
        
		$.mobile.showPageLoadingMsg("a", "Requesting to Unfollow Channel");
        var callbacks = {
        success: function(){;},
            error: errorUnfollow
        };
		
        return ES.channelService.unfollowChannel(that.channelid(),callbacks).then(successfulUnfollowChannel);
		
	};
    
    
    function successfulUnfollowChannel(data){
        
        that.showChannelList();
    }
    
    function errorUnfollow(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error Unfollowing Channel: " + ((status==500)?"Internal Server Error":details.message));
	}
	
	this.deleteChannelCommand = function () {

		$.mobile.showPageLoadingMsg("a", "Removing Channel");
		return ES.channelService.deleteChannel(that.channelid(), { success: successfulDelete, error: errorAPI });

	};
    
    
    this.showMessage = function (message) {
        localStorage.setItem("currentMessage", JSON.stringify(message));
        
		
		$.mobile.changePage("#" + messageViewModel.template)
	};
    
    
    
    this.showChannelMenu = function(){
        
         $.mobile.changePage("#" + channelMenuViewModel.template);
        
    }
    
    
    this.showChannelSettings = function(){
	    
        $.mobile.changePage("#" + channelSettingsViewModel.template);
    
    };
    
    
    this.backNav = function(){
        
        
        var lrelationship = 'O';
        
        if (that.channel()[0]){
            lrelationship = that.channel()[0].relationship;
        }
        
        if (lrelationship && lrelationship == "F"){
            
            $.mobile.changePage("#" + channelsFollowingListViewModel.template);
        }
        else {
            $.mobile.changePage("#" + channelMenuViewModel.template);
        }
        
    }
	
	this.modifyChannelCommand = function(){
		
		//that.title("Channel: " + channel()[0].name );
		return ES.channelService.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	};
	
	this.postMessageCommand = function(){

		var messageobj = {text: that.message(), type: 'FYI'};
		return ES.messageService.createChannelMessage(that.channelid(), messageobj, {success: successfulMessage, error: errorPostingMessage});
	};
	
	
	this.refreshMessagesCommand = function(){
		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		that.getMessagesCommand(that.channelid()).then(gotMessages);
	};
	
	this.getMessagesCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return ES.messageService.getChannelMessages(that.channelid(), undefined, {success: successfulMessageGET, error: errorRetrievingMessages});
	};
   

	
	
}
