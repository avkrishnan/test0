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
	this.channelId = ko.observable();	
	this.channelName = ko.observable();			
  this.followers = ko.observableArray([]);
	this.followerCount = ko.observable();
	this.followerName = ko.observable();
	this.followerDescription = ko.observable();		
	
	/* Methods */	
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
			var currentChannel = localStorage.getItem('currentChannel');
			/*To do - removed when followersList page is complete
			alert(currentChannel);
			var lchannel = JSON.parse(currentChannel);
			that.channelname(lchannel.name);
			that.channel([lchannel]);
			that.title(lchannel.name);
			that.description(lchannel.description);
			that.url(lchannel.normName + '.evernym.com');
			that.relationship(lchannel.relationship);
			that.channelid(lchannel.id);
			that.activate(lchannel)*/
    });	
	};
	  
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			that.channelId(localStorage.getItem('currentChannelId'));			
			that.followers.removeAll();			
			$.mobile.showPageLoadingMsg('a', 'Loading Followers');		
			return this.getChannelCommand().then(this.getFollowersCommand());
			goToView('followersListView');
		}
	}
	
	this.channelSettings = function(){
		goToView('channelSettingsView');
	};
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		var len = 0;
		for(len; len<data.followers.length; len++) {
			that.followers.push({
				followerName: data.followers[len].firstname +' '+ data.followers[len].lastname, 
				accountname: data.followers[len].accountname
			});
		}
		if(data.followers.length <= 1) {
			that.followerCount(data.followers.length+' follower');
		} else {
			that.followerCount(data.followers.length+' followers');
		}
	}; 
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem('currentChannelName', data.name);
		that.channelName(localStorage.getItem('currentChannelName'));
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('followersListView');
  };
	
  this.getChannelCommand = function () {
		var channelId = localStorage.getItem('currentChannelId');
		$.mobile.showPageLoadingMsg('a', 'Loading Channel');
		return ES.channelService.getChannel(channelId, {success: successfulGetChannel, error: errorAPI});
  };
	
	this.getFollowersCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Loading Followers');				
    return ES.channelService.getFollowers(that.channelId(), { success: successfulList, error: errorAPI });
  };
}

/* To do - removed when followersList page is complete
function FollowersListViewModel() {
  var that = this;
  this.template = 'followersListView';
  this.viewid = 'V-26';
  this.viewname = 'Followers';
  this.displayname = 'Followers';
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
    $('#' + that.template).on('pagebeforeshow', null, function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.id) {
        that.activate({
          id: $.mobile.pageData.id
        });
      } else {
        var currentChannel = localStorage.getItem('currentChannel');
        var lchannel = JSON.parse(currentChannel);
        that.activate(lchannel);
      }
      if ($.mobile.pageData && $.mobile.pageData.id) {
        that.activate({
          id: $.mobile.pageData.id
        });
      } else {
        var currentChannel = localStorage.getItem('currentChannel');
        var lchannel = JSON.parse(currentChannel);
        //that.channel([lchannel]);
        that.title(lchannel.name);
        that.description(lchannel.description);
        that.url(lchannel.normName + '.evernym.com');
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
    $.mobile.showPageLoadingMsg('a', 'Loading Followers');
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
    $.mobile.changePage('#' + followerViewModel.template);
  };

  this.logoutCommand = function () {
    loginViewModel.logoutCommand();
    $.mobile.changePage('#' + loginViewModel.template);
  }

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    loginPageIfBadLogin(details.code);
    showError('Error Getting Messages: ' + ((status == 500) ? 'Internal Server Error' : details.message));
    //logger.logError('error listing channels', null, 'channel', true);
  };

  this.getFollowersCommand = function () {
    //logger.log('starting getChannel', undefined, 'channels', true);
    return ES.channelService.getFollowers(that.channelid(), {
      success: function () {},
      error: errorAPI
    });
  };
	
  this.backNav = function () {
    $.mobile.changePage('#' + channelMenuViewModel.template);
  };
}*/	