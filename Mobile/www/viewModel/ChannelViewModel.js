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
	this.channelid = '';
    
    // Methods
	
    this.activate = function (channel) {
	    
        localStorage.setItem("currentChannel", JSON.stringify(channel));
        
        that.channelid = channel.id;
	    //if(that.channel()){
        //    that.channel.removeAll();
        //}
        
        that.getChannelCommand(that.channelid).then(gotChannel);
        that.getMessagesCommand(that.channelid).then(gotMessages);
        
        return true;
	    
    };
	
	function gotChannel(data){
		that.channel([data]);
		that.title("Channel: " + data.name );
		
    };
    
	function gotMessages(data){
	    that.messages(data.message);
        
	};
	
    function successfulGetChannel(data){
	    //logger.log('success Getting Channel ' , null, 'channel', true);
	    
	    
	};
    
	function successfulDelete(data){
	    //router.navigateTo('#/channellist');
	};
    
	function successfulModify(data){
	    //router.navigateTo('#/channellist');
	    //logger.log("SUCCESS MODIFY", undefined, "channel", true);
	};
    
	function successfulMessage(data){
	    //router.navigateTo('#/channellist');
	    //logger.log("SUCCESS MESSAGE", undefined, "channel", true);
	    that.getMessagesCommand(that.channelid).then(gotMessages);
	    that.message('');
	    
	};
    
	function successfulMessageGET(data){
	    
	    //logger.log("SUCCESS GET MESSAGES" + JSON.stringify(data), undefined, "channel", true);
	    
	    
	};
    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
        
    }
    
	function errorAPI(data, status, details){
        if (data == "Unauthorized"){
            $.mobile.changePage("#" + loginViewModel.template)
        }
        console.log("error something " + data);
        alert("Error Getting Messages: " + ((status==500)?"Internal Server Error":details.message));
	    //logger.logError('error listing channels', null, 'channel', true);
	};
    
    function errorPostingMessage(data, status, details){
        if (data == "Unauthorized"){
            $.mobile.changePage("#" + loginViewModel.template)
        }
        console.log("error something " + data);
        alert("Error Posting Message: " + details.message);
	    //logger.logError('error listing channels', null, 'channel', true);
	};
    
    function errorRetrievingMessages(data, status, details){
        if (data == "Unauthorized"){
            $.mobile.changePage("#" + loginViewModel.template)
        }
        console.log("error something " + data);
        alert("Error Retrieving Messages: " + ((status==500)?"Internal Server Error":details.message));
	    //logger.logError('error listing channels', null, 'channel', true);
	};
	
	this.getChannelCommand = function (lchannelid) {
	    
        //logger.log("starting getChannel", undefined, "channels", true);
	    return dataService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPI});
        
	};
	
	this.deleteChannelCommand = function () {
	    
        //logger.log("starting deleteChannel", undefined, "channels", true);
	    return dataService.deleteChannel(that.channelid , {success: successfulDelete, error: errorAPI});
        
	};
	
	this.modifyChannelCommand = function(){
	    //logger.log("starting modifyChannel", undefined, "channels", true);
	    
	    that.title("Channel: " + channel()[0].name );
	    return dataService.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	};
	
	this.postMessageCommand = function(){
	    //logger.log("postMessageCommand", undefined, "channels", true);
	    var messageobj = {text: that.message(), type: 'FYI'};
	    return dataServiceM.createChannelMessage(that.channelid, messageobj, {success: successfulMessage, error: errorPostingMessage});
	};
    
    this.refreshMessagesCommand = function(){
        that.getMessagesCommand(that.channelid).then(gotMessages);
    };
	
	this.getMessagesCommand = function(){
	    //logger.log("getMessagesCommand", undefined, "channels", true);
	    return dataServiceM.getChannelMessages(that.channelid, {success: successfulMessageGET, error: errorRetrievingMessages});
	};
   

    
    
}
