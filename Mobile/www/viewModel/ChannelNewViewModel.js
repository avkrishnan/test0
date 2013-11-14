﻿/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelNewViewModel() {	
  var that = this;
	this.template = 'channelNewView';
	this.viewid = 'V-13';
	this.viewname = 'CreateNewChannel';
	this.displayname = 'Create a channel';	
	this.accountName = ko.observable();	
	
  /* New Channel Step First observable */
	this.sectionOne = ko.observable(true);
	this.sectionTwo = ko.observable(false);		
	this.newChannel = ko.observable('');	
	this.message = ko.observable();	
	this.errorNewChannel = ko.observable();
	this.channelWebAddress = ko.observable();
	this.backText = ko.observable();
	this.backNav = ko.observable();							
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();					
    });	
	};
	
	this.clearForm = function () {
		that.newChannel('');
		that.message('');
		that.errorNewChannel('');
    that.backNav('');				
  };
	  
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			that.sectionOne(true);
			that.sectionTwo(false);			
			$('input').keyup(function () {
				that.message('');
				that.errorNewChannel('');
			});
			that.backText('<em></em>Back');				
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'channelNewView') {
			that.nextViewCommand();
		}
	});
	
	this.goToBack = function() {
		if(that.backNav() == 'channelNewView') {			
			that.sectionOne(true)
			that.sectionTwo(false);
			that.backText('<em></em>Back');
			that.backNav('');																	
		}
		else {
			goToView('channelListView');
		}
	}

	this.nextViewCommand = function (e) {
    if (that.newChannel() == '') {
      that.errorNewChannel('<span>SORRY :</span> Please enter channel name');
    } else {
			//that.message('<span>GREAT! </span> This name is available');
			that.sectionOne(false);
			that.sectionTwo(true);
			that.backText('<em></em>New Chan');
			that.backNav('channelNewView');
			that.channelWebAddress(that.newChannel()+'.evernym.com');	
    }
  };
	
	function successfulCreate(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelsIOwnView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelNameView');
		that.sectionOne(true);
		that.sectionTwo(false);
		that.message('');
    that.errorNewChannel('<span>SORRY :</span> ' + response.message);		
  };
	
  this.createChannelCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Creating Channel ');
		ES.channelService.createChannel({name: that.newChannel()}, {success: successfulCreate, error: errorAPI});
  };
	
}