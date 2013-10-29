/*globals ko*/

/*globals ko*/

function FollowersListViewModel() {	
  var that = this;
	this.template = 'followersListView';
	this.viewid = 'V-26';
	this.viewname = 'Followers';
	this.displayname = 'Followers';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Followers observable */
	this.channelname = ko.observable();			
  this.followers = ko.observableArray([]);
	this.followerCount = ko.observable();
	this.followerName = ko.observable();
	this.followerDescription = ko.observable();		
		
	this.shown = false;	
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.a) {
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }
      that.activate();
			var currentChannel = localStorage.getItem("currentChannel");
			//alert(currentChannel);
			//var lchannel = JSON.parse(currentChannel);
			//that.channelname(lchannel.name);
			/*//that.channel([lchannel]);
			that.title(lchannel.name);
			that.description(lchannel.description);
			that.url(lchannel.normName + ".evernym.com");
			that.relationship(lchannel.relationship);
			that.channelid(lchannel.id);
			that.activate(lchannel)*/;
    });	
	};  
	this.activate = function() {
		var _accountName = localStorage.getItem('accountName');
		that.accountName(_accountName);
		$.mobile.showPageLoadingMsg("a", "Loading Followers");
		return this.getFollowersCommand()/*.then(gotFollowers)*/;
	}
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		var len = 0;
		for(len; len<data.followers.length; len++) {
			that.followers.push({
				followerName: data.followers[len].firstname +' '+ data.followers[len].lastname, 
				accountname: data.followers[len].accountname
			});
		}
		that.followerCount((len++)+' Followers:');
	}; 
	
	function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    loginPageIfBadLogin(details.code);
    showError("Error Getting Messages: " + ((status == 500) ? "Internal Server Error" : details.message));
    //logger.logError('error listing channels', null, 'channel', true);
  };
	
	this.getFollowersCommand = function () {
    //logger.log("starting getChannel", undefined, "channels", true);
    return ES.channelService.getFollowers('94442626-1f93-416f-ab4f-ca1ca4614c80', { success: successfulList, error: errorAPI });
  };
}

/* Temporarly commented for future purpose*/
/*function FollowersListViewModel() {
  var that = this;
  this.template = "followersListView";
  this.viewid = "V-26";
  this.viewname = "Followers";
  this.displayname = "Followers";
  this.hasfooter = true;
  this.accountName = ko.observable();
  this.isChannelView = true;
  this.title = ko.observable();
  this.description = ko.observable();
  this.url = ko.observable();*/
	
  /* Followers observable 		
  this.relationship = ko.observable();
  this.followers = ko.observableArray([]);
  this.channelid = ko.observable();
  //this.channelname = ko.observable();
  this.navText = ko.observable('Channel Menu');
  this.applyBindings = function () {
    $("#" + that.template).on("pagebeforeshow", null, function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.id) {
        that.activate({
          id: $.mobile.pageData.id
        });
      } else {
        var currentChannel = localStorage.getItem("currentChannel");
        var lchannel = JSON.parse(currentChannel);
        that.activate(lchannel);
      }
      if ($.mobile.pageData && $.mobile.pageData.id) {
        that.activate({
          id: $.mobile.pageData.id
        });
      } else {
        var currentChannel = localStorage.getItem("currentChannel");
        var lchannel = JSON.parse(currentChannel);
        //that.channel([lchannel]);
        that.title(lchannel.name);
        that.description(lchannel.description);
        that.url(lchannel.normName + ".evernym.com");
        that.relationship(lchannel.relationship);
        that.channelid(lchannel.id);
        that.activate(lchannel);
      }
    });
  };

  // Methods
  function getChannelFromPageData() {
    that.activate({
      id: $.mobile.pageData.id
    });
  }

  this.activate = function (channel) {
    that.followers([]);
    that.channelid(channel.id);
    that.channelname(channel.name);
    $.mobile.showPageLoadingMsg("a", "Loading Followers");
    that.getFollowersCommand().then(gotFollowers);
    return true;
  };

  function gotFollowers(data) {
    $.mobile.hidePageLoadingMsg();
    if (data.followers && data.followers.constructor == Object) {
      data.followers = [data.followers];
    }
    that.followers(data.followers);
  };

  this.showFollower = function (follower) {
    followerViewModel.activate(follower);
    $.mobile.changePage("#" + followerViewModel.template);
  };

  this.logoutCommand = function () {
    loginViewModel.logoutCommand();
    $.mobile.changePage("#" + loginViewModel.template);
  }

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    loginPageIfBadLogin(details.code);
    showError("Error Getting Messages: " + ((status == 500) ? "Internal Server Error" : details.message));
    //logger.logError('error listing channels', null, 'channel', true);
  };

  this.getFollowersCommand = function () {
    //logger.log("starting getChannel", undefined, "channels", true);
    return ES.channelService.getFollowers(that.channelid(), {
      success: function () {},
      error: errorAPI
    });
  };
	
  this.backNav = function () {
    $.mobile.changePage("#" + channelMenuViewModel.template);
  };
}*/	