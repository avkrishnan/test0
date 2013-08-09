/*globals ko*/

function ChannelMenuViewModel() {

	
	// --- properties
	
	var that = this;
	var  dataService = new EvernymChannelService();
	var  dataServiceM = new EvernymMessageService();
	var initNB = false;
	
	this.template = "channelMenuView";
	this.title = ko.observable();
    this.relationship = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
    
    this.last_date = ko.observable();
    this.last_message = ko.observable();
    this.last_replies = ko.observable();
    
    this.urgency = ko.observable('N');
    this.igi = ko.observable();
	
    this.newMessage = ko.observable('');
    
    this.description = ko.observable('-');
    this.url = ko.observable('-');
    
    this.clear = function(){
        
        if (! initNB){
            that.newMessage('');
            that.urgency('N');
            
            that.last_date('');
            that.last_message('');
            that.last_replies('');
            
            $("#new_broadcast_div").hide();
        }
    }
    
    /*
    $("#" + that.template).live("pagebeforecreate", function (e, data) {
                                var panelhtml = $("#globalpanel").html();
                                $(this).find("#gpanel").html(panelhtml);
                                });
    */
	$("#" + this.template).live("pagebeforeshow", function(e, data){
								
                                $('#broadcasts_mr').hide();
                                
                                that.clear();
                                
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
                                    that.description(lchannel.description);
                                    that.url(lchannel.normName + ".evernym.com");
                                    that.relationship(lchannel.relationship);
                                    that.channelid(lchannel.id);
                                    $.mobile.showPageLoadingMsg("a", "Loading Messages");
									that.getLastMessageCommand(that.channelid()).then(gotMessages);
                                    
								
								}
								
		   });
	
	
	this.activate = function (channel, action) {
		
		that.channelid(channel.id);
        
        
        
        if ($.mobile.pageData && $.mobile.pageData.action){
            action = $.mobile.pageData.action;
        }
        
        if (action == 'newbroadcast'){
            that.initiateNewBroadcast();
        }
        
    	
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		
		that.getChannelCommand(that.channelid()).then(gotChannel);
		
		return true;
		
	};
    
    
    
    this.sendNewBroadcast = function(){
        //alert(that.newMessage());
        //alert(that.urgency());
        //alert(that.igi());
        
        initNB = false;
        var messageobj = {text: that.newMessage(), urgencyId: that.urgency(),type: 'FYI'};
        
        
        
		return dataServiceM.createChannelMessage(that.channelid(), messageobj, {success: successfulMessage, error: errorPostingMessage});
        
    };
    
    this.initiateNewBroadcast = function(){
        
        initNB = true;
        $("#new_broadcast_div").show(200, function(){$(window).resize(); $("#newMessage-cm").focus() } );
        
    };
    
    
    this.cancelNewBroadcast = function(){
        that.newMessage('');
        initNB = false;
        $("#new_broadcast_div").hide(200, function(){$(window).resize();  } );
        
    };
    
    this.showMessageDetails = function(){
        that.showMessage(that.message());
    };
	
	function gotChannel(data){
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem("currentChannel", JSON.stringify(data));
		that.channel([data]);
		that.title(data.name );
        that.relationship(data.relationship);
        that.channelid(data.id);
        $.mobile.showPageLoadingMsg("a", "Loading Messages");
		
		
        //if ($.mobile.pageData && $.mobile.pageData.id){
        //    that.followChannelCommand().then(postFollow);
	    //}
        //else {
        
        that.getLastMessageCommand(that.channelid()).then(gotMessages);
        
        //}
        
	}
    
    function postFollow(data){
        that.getMessagesCommand(that.channelid()).then(gotMessages);
        
    }
	
	function gotMessages(data){
		
        
        that.clear();
        
		
		$.mobile.hidePageLoadingMsg();
		if (data.message && data.message.constructor == Object){
			
			data.message = [data.message];
            
		}
        
        if(data.message && data.message.length){
            
            $('#broadcasts_mr').show();
            
            var maxlength = 60;
            var messagetext = data.message[0].text;
            if (messagetext.length > maxlength){
                messagetext = messagetext.substring(0,maxlength) + " ...";
            }
            
            that.message(data.message[0]);
            that.last_date(convDate(data.message[0].created));
            that.last_message(messagetext);
        }
       
		
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
			
            showMessage("Please log in or register to view this channel.");
		}
        else {
		    showMessage("Error Getting Channel: " + ((status==500)?"Internal Server Error":details.message));
		}
            

	}
    
    function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showMessage("Error: " + ((status==500)?"Internal Server Error":details.message));
		

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

	}
	
	function errorRetrievingMessages(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showMessage("Error Retrieving Messages: " + ((status==500)?"Internal Server Error":details.message));

	}
	
	this.getChannelCommand = function (lchannelid) {
		
		$.mobile.showPageLoadingMsg("a", "Loading Channel");

		return dataService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPIChannel});
		
	};
    
    this.showMoreMessagesCommand = function(){
        
        var last_message_id = that.messages()[that.messages().length - 1].id;
        
        $.mobile.showPageLoadingMsg("a", "Loading Messages");
		
		return dataServiceM.getChannelMessages(that.channelid(), {before: last_message_id}, {success: successfulMessageGET, error: errorRetrievingMessages}).then(gotMoreMessages);
        
        
    }
	
	this.followChannelCommand = function(){
		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Requesting to Follow Channel");
		return dataService.followChannel(that.channelid(), {success: successfulFollowChannel, error: errorFollowing});
		
	};
    
    
    this.unfollowChannelCommand = function(){
	   
        
		$.mobile.showPageLoadingMsg("a", "Requesting to Unfollow Channel");
        var callbacks = {
        success: function(){;},
            error: errorUnfollow
        };
		
        return dataService.unfollowChannel(that.channelid(),callbacks).then(successfulUnfollowChannel);
		
	};
    
    
    function successfulUnfollowChannel(data){
        
        that.showChannelList();
    }
    
    function errorUnfollow(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showMessage("Error Unfollowing Channel: " + ((status==500)?"Internal Server Error":details.message));
	}
	
	this.deleteChannelCommand = function () {

		$.mobile.showPageLoadingMsg("a", "Removing Channel");
		return dataService.deleteChannel(that.channelid(), { success: successfulDelete, error: errorAPI });

	};
    
    
    this.showMessage = function (message) {
        localStorage.setItem("currentMessage", JSON.stringify(message));
    	
		$.mobile.changePage("#" + messageViewModel.template)
	};
    
    
    this.showChannelList = function(){
        
        initNB = false;
        var lrelationship = 'O';
        
        if (that.channel()[0]){
            lrelationship = that.channel()[0].relationship;
        }
        
        if (lrelationship && lrelationship == "F"){
            
            $.mobile.changePage("#" + channelsFollowingListViewModel.template);
        }
        else {
            $.mobile.changePage("#" + channelListViewModel.template);
        }
        
    }
	
	this.modifyChannelCommand = function(){
		
		//that.title("Channel: " + channel()[0].name );
		return dataService.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	};
	
	
    this.postMessageCommand = function(){

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
		return dataServiceM.getChannelMessages(that.channelid(), undefined, {success: successfulMessageGET, error: errorRetrievingMessages});
	};
    
    
    this.getLastMessageCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Message");
		return dataServiceM.getChannelMessages(that.channelid(), {limit: 1}, {success: successfulMessageGET, error: errorRetrievingMessages});
	};
   

	
	
}
