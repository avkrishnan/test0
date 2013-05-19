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
								
								
								if ($.mobile.pageData && $.mobile.pageData.follow){
									
								
									that.channelid($.mobile.pageData.id);
									that.followChannelCommand().then(getChannelFromPageData);
								
								}
								
								else if ($.mobile.pageData && $.mobile.pageData.id){
								
									that.activate({id:$.mobile.pageData.id});
								}
								
								else {
									var currentChannel = localStorage.getItem("currentChannel");
									var lchannel = JSON.parse(currentChannel);
									that.activate(lchannel);
								
								}
								
		   });
	
	
	// Methods
	
	function getChannelFromPageData(){
		that.activate({id:$.mobile.pageData.id});
	}
	
	this.activate = function (channel) {
		
		
		
		
		
		that.channelid(channel.id);
		//if(that.channel()){
		//    that.channel.removeAll();
		//}
		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		
		that.getChannelCommand(that.channelid()).then(gotChannel);
		
		
		return true;
		
	};
	
	function gotChannel(data){
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem("currentChannel", JSON.stringify(data));
		that.channel([data]);
		that.title(data.name );
		that.getMessagesCommand(that.channelid()).then(gotMessages);
		
	   
		
	};
	
	function gotMessages(data){
		
		
		$.mobile.hidePageLoadingMsg();
		if (data.message && data.message.constructor == Object){
			
			data.message = [data.message];
		}
		
		that.messages(data.message);
		
	};
	
	function successfulGetChannel(data){
		//logger.log('success Getting Channel ' , null, 'channel', true);
		$.mobile.hidePageLoadingMsg();
		
	};
	
	function successfulDelete(data){
		//router.navigateTo('#/channellist');
		$.mobile.changePage("#" + channelListViewModel.template);
	};
	
	function successfulModify(data){
		//router.navigateTo('#/channellist');
		//logger.log("SUCCESS MODIFY", undefined, "channel", true);
	};
	
	function successfulMessage(data){
		$.mobile.hidePageLoadingMsg();
		//router.navigateTo('#/channellist');
		//logger.log("SUCCESS MESSAGE", undefined, "channel", true);
		that.getMessagesCommand(that.channelid()).then(gotMessages);
		that.message('');
		
	};
	
	function successfulFollowChannel(){
		$.mobile.hidePageLoadingMsg();
		showMessage("Now Following Channel " + $.mobile.pageData.id);
		
	};
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();
		//logger.log("SUCCESS GET MESSAGES" + JSON.stringify(data), undefined, "channel", true);
		
		
	};
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	}
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (details.code == 100202 || status == 401){
			$.mobile.changePage("#" + loginViewModel.template)
		}
		console.log("error something " + data);
		showMessage("Error Getting Messages: " + ((status==500)?"Internal Server Error":details.message));
		
		//logger.logError('error listing channels', null, 'channel', true);
	};
	
	function errorPostingMessage(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (details.code == 100202 || status == 401){
			$.mobile.changePage("#" + loginViewModel.template)
		}
		console.log("error something " + data);
		showMessage("Error Posting Message: " + details.message);
		//logger.logError('error listing channels', null, 'channel', true);
	};
	
	function errorRetrievingMessages(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (details.code == 100202 || status == 401){
			$.mobile.changePage("#" + loginViewModel.template)
		}
		
		showMessage("Error Retrieving Messages: " + ((status==500)?"Internal Server Error":details.message));
		//logger.logError('error listing channels', null, 'channel', true);
	};
	
	this.getChannelCommand = function (lchannelid) {
		
		$.mobile.showPageLoadingMsg("a", "Loading Channel");
		//logger.log("starting getChannel", undefined, "channels", true);
		return dataService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPI});
		
	};
	
	this.followChannelCommand = function(){
		
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Requesting to Follow Channel");
		return dataService.followChannel(that.channelid(), {success: successfulFollowChannel, error: errorAPI});
		
	};
	
	this.deleteChannelCommand = function () {

		debugger;
		$.mobile.showPageLoadingMsg("a", "Removing Channel");

		return dataService.deleteChannel(that.channelid() , {success: successfulDelete, error: errorAPI});
		
	};
	
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
		return dataServiceM.getChannelMessages(that.channelid(), {success: successfulMessageGET, error: errorRetrievingMessages});
	};
   

	
	
}
