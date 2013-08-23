/*globals ko*/

function SendMessageViewModel() {

    
    // --- properties
    
    var that = this;
    var  dataService = new EvernymChannelService();
    var  dataServiceM = new EvernymMessageService();
	
    this.template = "sendMessageView";
    this.viewid = "V-20";
    this.viewname = "ComposeBroadcast";
    
    this.title = ko.observable();
    this.channel = ko.observableArray([]);
    
	this.channelid = ko.observable();
    this.channelname = ko.observable();
    this.message = ko.observable();
    
   
    this.applyBindings = function(){
        
        $("#" + that.template).live("pagebeforeshow", function (e, data) {
                                    
                                    
                                    that.clearForm();
                                    if ($.mobile.pageData && $.mobile.pageData.id) {
                                    that.activate({ id: $.mobile.pageData.id });
                                    }
                                    
                                    else {
                                    var currentChannel = localStorage.getItem("currentChannel");
                                    var lchannel = JSON.parse(currentChannel);
                                    that.activate(lchannel);
                                    
                                    }
                                    
                                    
                                    });
    };
    
    
    
    
    
    // Methods
    
    function getChannelFromPageData(){
        that.activate({id:$.mobile.pageData.id});
    }
	
    this.activate = function (channel) {
        
        
	    
        localStorage.setItem("currentChannel", JSON.stringify(channel));
        
        that.channelid(channel.id);
        that.channelname(channel.name);
	    
       
        
        return true;
	    
    };
	
	function gotChannel(data){
		that.channel([data]);
		that.title("Channel: " + data.name );
		
    };
    

	
    function successfulGetChannel(data){
	    //logger.log('success Getting Channel ' , null, 'channel', true);
	    
	    
	};

    
	function successfulMessage(data){
	    $.mobile.hidePageLoadingMsg();
	    that.message('');
        $.mobile.changePage("#" + channelViewModel.template)
	    
	};
    
    this.clearForm = function(){
        that.message('');
    };

    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
        
    }
    
	function errorAPI(data, status, details){
        $.mobile.hidePageLoadingMsg();
        
        loginPageIfBadLogin(details.code);
        
        console.log("error something " + data);
        showError("Error Getting Messages: " + ((status==500)?"Internal Server Error":details.message));
        
	    //logger.logError('error listing channels', null, 'channel', true);
	};
    
    function errorPostingMessage(data, status, details){
        $.mobile.hidePageLoadingMsg();
		
        loginPageIfBadLogin(details.code);
        
        showError("Error Posting Message: " + getAPICode(details.code));
	    //logger.logError('error listing channels', null, 'channel', true);
	};

	
	this.getChannelCommand = function (lchannelid) {
	    
        //logger.log("starting getChannel", undefined, "channels", true);
	    return dataService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPI});
        
	};

	
	this.postMessageCommand = function(){
	    //logger.log("postMessageCommand", undefined, "channels", true);
        $.mobile.showPageLoadingMsg("a", "Posting Message");
	    var messageobj = {text: that.message(), type: 'FYI'};
	    return dataServiceM.createChannelMessage(that.channelid(), messageobj, {success: successfulMessage, error: errorPostingMessage});
	};
   

    
    
}
