/*globals ko*/

function MessageViewModel() {

	
	// --- properties
	
	var that = this;
	var  dataService = new EvernymChannelService();
	var  dataServiceM = new EvernymMessageService();
	var replyToId = '';
	
	this.template = "messageView";
    this.viewid = "V-23";
    this.viewname = "BroadcastDetails";
    this.hasfooter = true;
    this.isChannelView = true;
	this.title = ko.observable();
    this.relationship = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
    this.messageid = ko.observable();
    this.messagetext = ko.observable();
    this.replyMessage = ko.observable();
    this.messagecreated = ko.observable();
    
    
    this.url = ko.observable();
    this.description = ko.observable();
    
    /*
    $("#" + that.template).live("pagebeforecreate", function (e, data) {
                                var panelhtml = $("#globalpanel").html();
                                $(this).find("#gpanel").html(panelhtml);
                                });
	
    */
    
    this.applyBindings = function(){
       	$("#" + that.template).live("pagebeforeshow", function(e, data){
                                    
                                    that.clear();
                                    
                                    $("#message-reply-form2").hide();
                                    $('.more_messages_button').hide();
                                    
                                    if ($.mobile.pageData && $.mobile.pageData.channelid && $.mobile.pageData.id){
                                    
					that.activate($.mobile.pageData.channelid, $.mobile.pageData.id);
                                    }
                                    
                                    else {
					var currentChannel = localStorage.getItem("currentChannel");
					var lchannel = JSON.parse(currentChannel);
                                        var currentMessage = localStorage.getItem("currentMessage");
                                        var lmessage = JSON.parse(currentMessage);
                                    
                                        if (!(that.channel()[0] && lchannel.id == that.channel()[0].id)){
                                            that.messages([]);
                                        }
                                    
                                    that.channel([lchannel]);
                                    
                                    that.message([lmessage]);
                                    
                                    that.messagetext(lmessage.text);
                                    
                                    
                                    that.description(lchannel.description);
                                    that.url(lchannel.normName + ".evernym.com");
                                    
                                    
                                    that.messagecreated(lmessage.created);
                                    
                                    that.messageid(lmessage.id);
                                    
                                    that.title(lchannel.name );
                                    that.relationship(lchannel.relationship);
                                    that.channelid(lchannel.id);
                                    $.mobile.showPageLoadingMsg("a", "Loading Messages");
									
                                    that.getMessagesCommand().then(gotMessages);
                                    
                                    
                                    }
                                    
                                    });
    };
    
    
    

	
	

	
	this.activate = function (channelid, messageid) {
		
		that.messages([]);
	        that.channelid(channelid);
	        that.messageid(messageid);
                that.getSingleMessageCommand().then();
		$.mobile.showPageLoadingMsg("a", "Loading The Message");
		that.getChannelCommand(channelid).then(gotChannel);
		return true;
		
	};
    
    this.clear = function(){
        
        that.replyMessage('');
    }
	
	function gotChannel(data){
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem("currentChannel", JSON.stringify(data));
		that.channel([data]);
		that.title(data.name );
		that.relationship(data.relationship);
		that.channelid(data.id);
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
                that.getMessagesCommand().then(gotMessages);
        
	}
    
        function postFollow(data){
            that.getMessagesCommand().then(gotMessages);
        }

	function gotSingleMessage(data){
        that.clear();
		$.mobile.hidePageLoadingMsg();
                alert(JSON.stringify(data));

		if (data.message && data.message.constructor == Object){
			data.message = [data.message];
		}
        
                if (data.more){
                    $('.more_messages_button').show();
                }

		that.messages(data.message);
	}


	function gotMessages(data){
        that.clear();
		$("#message-reply-form2").hide();
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

		that.getMessagesCommand().then(gotMessages);
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
			that.getMessagesCommand().then(gotMessages);
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

		return dataService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPIChannel});
		
	};
    
    this.showMoreMessagesCommand = function(){
        
        var last_message_id = that.messages()[that.messages().length - 1].id;
        
        $.mobile.showPageLoadingMsg("a", "Loading Messages");
		
		return dataServiceM.getChannelMessages(that.channelid(), {before: last_message_id, replyto: that.messageid()}, {success: successfulMessageGET, error: errorRetrievingMessages}).then(gotMoreMessages);
        
        
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
		
		showError("Error Unfollowing Channel: " + ((status==500)?"Internal Server Error":details.message));
	}
	
	this.deleteChannelCommand = function () {

		$.mobile.showPageLoadingMsg("a", "Removing Channel");
		return dataService.deleteChannel(that.channelid(), { success: successfulDelete, error: errorAPI });

	};
    
    this.showChannelList = function(){
        
        
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
    
    this.initiateReply = function(message){
        //alert(JSON.stringify(message));
        replyToId = message.id;
        
        if (!replyToId) {
            replyToId = that.messageid();
        }
        
        $("#message-reply-form2").show(200, function(){
                                                $("#reply-text-box").focus();
                                                });
        
    }
    
    this.replyToMessage = function(){
        
        //alert(that.replyMessage());
        //alert(replyToId);
        
        
        this.postResponseMessageCommand(that.replyMessage(), replyToId);
    }
    
    this.showMessageView = function(){
            $.mobile.changePage("#" + channelViewModel.template);
    }
	
	this.modifyChannelCommand = function(){
		
		//that.title("Channel: " + channel()[0].name );
		return dataService.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	};
	
	this.postMessageCommand = function(){
        var messageobj = {text: that.message(), type: 'FYI'};
		return dataServiceM.createChannelMessage(that.channelid(), messageobj, {success: successfulMessage, error: errorPostingMessage});
	};
    
    this.postResponseMessageCommand = function(message, messageid){
        var messageobj = {text: message, type: 'FYI', responseToMsgId:messageid};
		return dataServiceM.createChannelMessage(that.channelid(), messageobj, {success: successfulMessage, error: errorPostingMessage});
	};
	
    

	
	this.refreshMessagesCommand = function(){
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		that.getMessagesCommand().then(gotMessages);
	};

        this.getSingleMessageCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Message");
		return dataServiceM.getChannelMessage(that.channelid(), that.messageid(), {success: successfulMessageGET, error: errorRetrievingMessages});
	};
    
	
	this.getMessagesCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return dataServiceM.getChannelMessages(that.channelid(), {replyto: that.messageid()}, {success: successfulMessageGET, error: errorRetrievingMessages});
	};
   

	
	
}
