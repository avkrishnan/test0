﻿/*globals ko*/

function ChannelViewModel() {

	
	// --- properties
	
	var that = this;
	var  dataService = new EvernymChannelService();
	var  dataServiceM = new EvernymMessageService();
	
	
	this.template = "channelView";
    this.viewid = "V-18";
    this.viewname = "ChannelDetails";
    this.displayname = "Channel";
    
    this.hasfooter = true;
    this.isChannelView = true;
	this.title = ko.observable();
    this.relationship = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
    this.channelIconObj = ko.observable();
	
	this.url = ko.observable('');
    this.description = ko.observable('DESCRIPTION');
    this.longdescription = ko.observable('');
    this.email = ko.observable('');
	
    /*
    $("#" + that.template).live("pagebeforecreate", function (e, data) {
                                var panelhtml = $("#globalpanel").html();
                                $(this).find("#gpanel").html(panelhtml);
                                });
    */
    
    
   
    
    this.clean = function(){
    
    
        $("#" + that.template).find("#follow_channel_button").hide();
        $("#" + that.template).find("#unfollow_channel_button").hide();
        
    };
    
    
    this.applyBindings = function(){
    
    
        $("#" + that.template).live("pagebeforeshow", function(e, data){
								
                                
                                
                                that.clean();
                                
                                $('.more_messages_button').hide();
                                
                                
                                
                                var action = localStorage.getItem("action");
       
								
                                
                                
								
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
                                        $.mobile.showPageLoadingMsg("a", "Loading Messages");
                                        
                                        that.description(lchannel.description);
                                        that.longdescription(lchannel.longDescription);
                                        that.url(lchannel.normName + '.evernym.com');
                                        that.email(lchannel.normName + '@evernym.com');
                                        that.showMainIcon(lchannel);
                                        
                                        if (action == 'follow_channel'){

								        that.followChannelCommand();
                                        localStorage.removeItem('action');


								         }
                                        
                                         //data-bind="style: {display:relationship()=='F'?'none':'block'}"
                                        
                                        if (lchannel.relationship == 'F'){
                                            $("#" + that.template).find("#unfollow_channel_button").show();
                                        }
                                        else if (lchannel.relationship != 'F' && lchannel.relationship != 'O'){
                                            $("#" + that.template).find("#follow_channel_button").show();
                                        }
									    
                                    }
                                    else {
                                        //$.mobile.changePage("#" + channelListViewModel.template);
                                    }
								
								}
								
								
								
                                
								
		   });
	
	
    
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
    
	
	this.activate = function (channel) {
		
		that.channelid(channel.id);

		
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
		
		that.description(data.description);
        that.longdescription(data.longDescription);
        that.url(data.normName + '.evernym.com');
        that.email(data.normName + '@evernym.com');
		
		that.showMainIcon(data);
        that.relationship(data.relationship);
        that.channelid(data.id);
        
        if (data.relationship == 'F'){
			$("#" + that.template).find("#unfollow_channel_button").show();
		}
		else if (data.relationship != 'F' && data.relationship != 'O'){
			$("#" + that.template).find("#follow_channel_button").show();
		}
		
		
		 var action = localStorage.getItem("action");
       
		if (action == 'follow_channel'){

			that.followChannelCommand();
			localStorage.removeItem('action');


		}
									    
        
		
		
        
	}
    
    function postFollow(data){
        
        
        
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
	
	
	
	function successfulFollowChannel(){
		$.mobile.hidePageLoadingMsg();
		showMessage("Now Following Channel " + that.title());
		localStorage.removeItem("currentChannel");
        $.mobile.changePage("#" + channelsFollowingListViewModel.template);
		
	}
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();

		
		
	}
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template);
		
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
			
            showError('You are already following this channel');
            
		}
		else if (isBadLogin(details.code)){
		    
		    localStorage.setItem("action", 'follow_channel');
		    $.mobile.changePage("#" + loginViewModel.template);
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
        localStorage.removeItem("currentChannel");
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
    
    
    this.showMessage = function (message) {
        localStorage.setItem("currentMessage", JSON.stringify(message));
        
		
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
        
    }
	
	this.modifyChannelCommand = function(){
		
		//that.title("Channel: " + channel()[0].name );
		return dataService.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	};
	
	
	
	
	
   

	
	
}
