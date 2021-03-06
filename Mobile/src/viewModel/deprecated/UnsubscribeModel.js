﻿/*globals ko*/

function UnsubscribeModel() {

	
	// --- properties
	
	var that = this;
	
	
	this.template = "unsubscribe";
    this.viewid = "V-??";
    this.viewname = "unsubscribe";
    this.displayname = "Unsubscribe";
    
    this.hasfooter = true;
    this.isChannelView = true;
	this.title = ko.observable();
    this.relationship = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
	
	
	this.editChannelName = ko.observable();
	this.editChannelDescription = ko.observable();
    
    this.url = ko.observable();
    this.description = ko.observable();
    
    var messageid = '';
    
    
	
    /*
    $("#" + that.template).live("pagebeforecreate", function (e, data) {
                                var panelhtml = $("#globalpanel").html();
                                $(this).find("#gpanel").html(panelhtml);
                                });
    */
    
    
    
    this.applyBindings = function(){
    
        $("#" + that.template).on("pagebeforeshow", null, function(e, data){
                                    
                                    if ($.mobile.pageData && $.mobile.pageData.key){
                                    
                                        var key = $.mobile.pageData.key;
                                        var id = key.substring(0,36);
                                        messageid = key.substring(36,72);
                                        
                                        //alert(id + " : " + messageid);
									    that.activate({id:id});
                                    }
                                    
                                    else {
                                    
									var currentChannel = ENYM.ctx.getItem("currentChannel");
									var lchannel = JSON.parse(currentChannel);
                                    
                                    
                                    
                                   
                                    
                                    if (lchannel){
                                    that.channel([lchannel]);
                                    that.title(lchannel.name );
                                    
                                    that.editChannelName(lchannel.name);
                                    that.editChannelDescription(lchannel.description);
                                    
                                    
                                    
                                    that.description(lchannel.description);
                                    
                                    that.url(lchannel.normName + '.evernym.com');
                                    that.relationship(lchannel.relationship);
                                    
                                    that.channelid(lchannel.id);
                                    that.unfollowChannelCommand();
                                    
                                    }
                                    else {
                                    $.mobile.changePage("#" + loginViewModel.template);
                                    }
                                    
                                    }
                                    
                                    });
    
    
    
    };
    
	
	
	

	
	this.activate = function (channel) {
		
		that.channelid(channel.id);

		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		that.getChannelCommand(that.channelid()).then(gotChannel);
		
		return true;
		
	};
	
	function gotChannel(data){
		$.mobile.hidePageLoadingMsg();
		ENYM.ctx.setItem("currentChannel", JSON.stringify(data));
		that.channel([data]);
		that.title(data.name );
        that.relationship(data.relationship);
        that.channelid(data.id);
        
        that.description(data.description);
        that.url(data.normName + '.evernym.com');
        
        that.editChannelName(data.name);
        that.editChannelDescription(data.description);
        
		that.unfollowChannelCommand();
		
        
	}
    
    function postFollow(data){
        
        
        
    }
	
    
	
    
    
	function successfulGetChannel(data){

		$.mobile.hidePageLoadingMsg();
		
	}
	
	function successfulDelete(data){

		$.mobile.changePage("#" + channelListViewModel.template);
        channelListViewModel.clearForm();
        channelListViewModel.activate();
        
	}
	
	function successfulModify(){
	
	    var channelObject = {
		    id: that.channelid(),
		    name: that.editChannelName(),
		    description: that.editChannelDescription()
		};
		
        that.activate(channelObject);
        //TODO - just change the one object inside of the list of channels instead of calling to get all the channels again.
        channelListViewModel.refreshChannelList();
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
        ENYM.ctx.setItem("currentMessage", JSON.stringify(message));
        
		
		$.mobile.changePage("#" + messageViewModel.template)
	};
    
    
    
    this.showChannelMenu = function(){
        
         $.mobile.changePage("#" + channelMenuViewModel.template);
        
    }
    
    
    
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
        
    };
 
	
	this.modifyChannelCommand = function(){
		
		
		
		
		var channelObject = {
		    id: that.channelid(),
		   // name: that.editChannelName(),
		    description: that.editChannelDescription()
		};
		
		return ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
	};
	
	

	
	
}
