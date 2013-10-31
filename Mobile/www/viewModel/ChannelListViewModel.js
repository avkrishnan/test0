﻿/*globals ko*/

function ChannelListViewModel() {
  var that = this;
  this.template = 'channelListView';
  this.viewid = 'V-40';
  this.viewname = 'ChannelsIOwn';
  this.displayname = 'My Channels';
  this.hasfooter = true;
  this.channels = ko.observableArray([]);
  this.accountName = ko.observable();
  this.notification = ko.observable();
  this.name = ko.observable();
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.a) {
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
		}
	}
	this.populateChannelList = function () {
    $.mobile.showPageLoadingMsg('a', 'Loading Channels');
    return this.listMyChannelsCommand().then(gotChannelList);
  };
	
  this.refreshChannelList = function () {
    $.mobile.showPageLoadingMsg('a', 'Loading Channels');
    return this.listMyChannelsCommand().then(gotChannels);
  };

  function successfulList(data) {
    $.mobile.hidePageLoadingMsg();
		if(data.channel.length > 0) {
			goToView('channelsIOwnView');			
		}
  };
	
  this.clearForm = function () {
    that.name('');
    that.channels.removeAll();
  };

  function gotChannels(data) {
    $.mobile.hidePageLoadingMsg();
    //that.shown = true;
    //that.channels.removeAll();		
    if (data.channel && data.channel.constructor == Object) {
      data.channel = [data.channel];
    }
    if (!data.channel.length) {
      $.mobile.changePage('#' + channelNewViewModel.template);
      $('#no_channels_notification').show();
      return;
    }
    //populatePanel(data.channel);		
    //var panelhtml = $('#globalpanel').find('#mypanel').html();
    //$.mobile.activePage.find('#mypanel').html(panelhtml);
    //$.mobile.activePage.find('#mypanel').panel();
    //$.mobile.activePage.find('#mypanel').trigger('create');		
    //$.mobile.activePage.find('#mypanel').trigger('updatelayout');		
    $('#no_channels_notification').hide();
    that.channels.removeAll();
    that.channels(data.channel);
  };

  function gotChannelList(data) {
    $.mobile.hidePageLoadingMsg();
    //that.shown = true;
    //that.channels.removeAll();		
    if (data.channel && data.channel.constructor == Object) {
      data.channel = [data.channel];
    }
    $('#no_channels_notification').hide();
    that.channels.removeAll();
    that.channels(data.channel);
  };

  function errorListChannels(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    if (loginPageIfBadLogin(details.code)) {
      //showMessage('Please log in or register to view channels.');
    } else {
      showError('Error listing my channels: ' + details.message);
    }
  };
  this.listMyChannelsCommand = function () {
    return ES.channelService.listMyChannels({success: successfulList, error: errorListChannels});
  };
	
  this.showChannel = function (channel) {
    localStorage.setItem('currentChannel', JSON.stringify(channel));
    $.mobile.changePage('#' + channelMenuViewModel.template);
  };
	
  this.showChannelStartMessage = function (channel) {
    that.showChannel(channel);
    channelMenuViewModel.initiateNewBroadcast();
  };
	
  this.createChannelCommand = function () {
    goToView('channelNewView');
	}
}


/* To do - to be removed when channelList page complete 

  this.applyBindings = function () {
    $('#' + that.template).on('Xpagebeforecreate', null, function (e, data) {});
    $('#' + this.template).on('pagebeforeshow', null, function (e, data) {
      if (!that.shown) {
        that.activate();
      }
    });
  };
	
  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {		
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
			console.log('trying to get channels');
			if (that.channels() && that.channels().length) {
				// commented out to cache the channels
				//that.channels.removeAll();
			} else {
				$.mobile.showPageLoadingMsg('a', 'Loading Channels');
				return this.listMyChannelsCommand().then(gotChannels);
			}
		}
  };
	
  this.populateChannelList = function () {
    $.mobile.showPageLoadingMsg('a', 'Loading Channels');
    return this.listMyChannelsCommand().then(gotChannelList);
  };
	
  this.refreshChannelList = function () {
    $.mobile.showPageLoadingMsg('a', 'Loading Channels');
    return this.listMyChannelsCommand().then(gotChannels);
  };

  function successfulList(data) {
    $.mobile.hidePageLoadingMsg();
    //logger.log('success listing channels ' , null, 'channelService', true);
  };
	
  this.clearForm = function () {
    that.name('');
    that.channels.removeAll();
  };

  function gotChannels(data) {
    $.mobile.hidePageLoadingMsg();
    //that.shown = true;
    //that.channels.removeAll();		
    if (data.channel && data.channel.constructor == Object) {
      data.channel = [data.channel];
    }
    if (!data.channel.length) {
      $.mobile.changePage('#' + channelNewViewModel.template);
      $('#no_channels_notification').show();
      return;
    }
    //populatePanel(data.channel);		
    //var panelhtml = $('#globalpanel').find('#mypanel').html();
    //$.mobile.activePage.find('#mypanel').html(panelhtml);
    //$.mobile.activePage.find('#mypanel').panel();
    //$.mobile.activePage.find('#mypanel').trigger('create');		
    //$.mobile.activePage.find('#mypanel').trigger('updatelayout');		
    $('#no_channels_notification').hide();
    that.channels.removeAll();
    that.channels(data.channel);
  };

  function gotChannelList(data) {
    $.mobile.hidePageLoadingMsg();
    //that.shown = true;
    //that.channels.removeAll();		
    if (data.channel && data.channel.constructor == Object) {
      data.channel = [data.channel];
    }
    $('#no_channels_notification').hide();
    that.channels.removeAll();
    that.channels(data.channel);
  };

  function errorListChannels(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    if (loginPageIfBadLogin(details.code)) {
      //showMessage('Please log in or register to view channels.');
    } else {
      showError('Error listing my channels: ' + details.message);
    }
  };
  this.listMyChannelsCommand = function () {
    return ES.channelService.listMyChannels({
      success: successfulList,
      error: errorListChannels
    });
  };
	
  this.logoutCommand = function () {
    loginViewModel.logoutCommand();
    $.mobile.changePage('#' + loginViewModel.template)
  }
	
  this.showChannel = function (channel) {
    localStorage.setItem('currentChannel', JSON.stringify(channel));
    $.mobile.changePage('#' + channelMenuViewModel.template);
  };
	
  this.showChannelStartMessage = function (channel) {
    that.showChannel(channel);
    channelMenuViewModel.initiateNewBroadcast();
  };
	
  this.newChannelCommand = function () {
    channelNewViewModel.activate();
    $.mobile.changePage('#' + channelNewViewModel.template);
  };

  function successfulCreate(data) {
    $.mobile.hidePageLoadingMsg();
    $.mobile.changePage('#' + channelListViewModel.template);
    channelListViewModel.activate();
  };

  function errorCreate(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    console.log('error creating channel: ' + response.message);
    showError('Error creating channel: ' + response.message);
    loginPageIfBadLogin(details.code);
  };
	
  this.logoutCommand = function () {
    return loginViewModel.logoutCommand();
    $.mobile.changePage('#' + loginViewModel.template)
  };
	
  this.createChannelCommand = function () {
    $.mobile.showPageLoadingMsg('a', 'Creating Channel ' + that.name());
    return ES.channelService.createChannel({
      name: that.name()
    }, {
      success: successfulCreate,
      error: errorCreate
    });
  };
*/