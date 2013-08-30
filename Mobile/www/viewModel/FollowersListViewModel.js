/*globals ko*/

function FollowersListViewModel() {
	
	// --- properties
	
	var that = this;
	var  dataService = new EvernymChannelService();
	
	this.template = "followersListView";
    this.viewid = "V-26";
    this.viewname = "Followers";
    this.hasfooter = true;
    this.isChannelView = true;
	this.title = ko.observable();
    this.description = ko.observable();
    this.url = ko.observable();
    this.relationship = ko.observable();
	this.followers = ko.observableArray([]);
	
	this.channelid = ko.observable();
	this.channelname = ko.observable();
    
    
    this.applyBindings = function(){
        $("#" + that.template).live("pagebeforeshow", function (e, data) {
                                    
                                    
                                    if ($.mobile.pageData && $.mobile.pageData.id) {
                                    that.activate({ id: $.mobile.pageData.id });
                                    }
                                    
                                    else {
                                    var currentChannel = localStorage.getItem("currentChannel");
                                    var lchannel = JSON.parse(currentChannel);
                                    that.activate(lchannel);
                                    }
                                    
                                    
                                    if ($.mobile.pageData && $.mobile.pageData.id){
                                    that.activate({id:$.mobile.pageData.id});
                                    
                                    }
                                    
                                    else {
                                    var currentChannel = localStorage.getItem("currentChannel");
                                    var lchannel = JSON.parse(currentChannel);
                                    
                                    
                                    
                                    //that.channel([lchannel]);
                                    that.title(lchannel.name );
                                    that.description(lchannel.description);
                                    that.url(lchannel.normName + ".evernym.com");
                                    that.relationship(lchannel.relationship);
                                    that.channelid(lchannel.id);
                                    
                                    that.activate(lchannel);
                                    
                                    
                                    
                                    }
                                    
                                    
                                    
                                    
                                    });
    };
    
    
	
	
	
	// Methods
	
	function getChannelFromPageData(){
		that.activate({id:$.mobile.pageData.id});
	}
	
	this.activate = function (channel) {
		
		that.followers([]);
		that.channelid(channel.id);
		that.channelname(channel.name);
		$.mobile.showPageLoadingMsg("a", "Loading Followers");
		that.getFollowersCommand().then(gotFollowers);
		
		return true;
		
	};

	
	function gotFollowers(data){
		$.mobile.hidePageLoadingMsg();
		
		if (data.followers && data.followers.constructor == Object){
			
			data.followers = [data.followers];
		}

		
		that.followers(data.followers);
		
	};

    
    this.showFollower = function(follower){
        followerViewModel.activate(follower);
        $.mobile.changePage("#" + followerViewModel.template);
        
    };
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template);
		
	}
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error Getting Messages: " + ((status==500)?"Internal Server Error":details.message));
		
		//logger.logError('error listing channels', null, 'channel', true);
	};
	

	
	this.getFollowersCommand = function () {
		
		//logger.log("starting getChannel", undefined, "channels", true);
		return dataService.getFollowers(that.channelid(), {success: function(){}, error: errorAPI});
		
	};


   

	
	
}
