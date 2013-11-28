﻿/*globals ko*/
/* To do - Pradeep Kumar */
function InviteFollowersViewModel() {	
  var that = this;
	this.template = 'inviteFollowersView';
	this.viewid = 'V-27a';
	this.viewname = 'InviteFollowers';
	this.displayname = 'Invite Followers';	
	this.accountName = ko.observable();	
	
  /* Invite Followers observable */
	this.channelName = ko.observable();	
	this.channelWebAddress = ko.observable();
	this.emailClass = ko.observable();
	this.errorEmail = ko.observable();		
	this.emailaddress = ko.observable();		
	this.textClass = ko.observable();
	this.text = ko.observable();
	this.textId = ko.observable('message');								
	this.error = ko.observable(false);	
	this.errorText = ko.observable();
	this.toastText = ko.observable();			
		
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();				
      that.activate();
    });	
	};  
	
	this.clearForm = function () {
		that.emailaddress('');
		that.emailClass('');
		that.errorEmail('');				
		that.text('');
		that.textClass('');
		that.error(false);		
		that.errorText('');				
	};	
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));	
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));								
			that.channelName(channelObject.channelName);
			that.channelWebAddress(channelObject.channelName+'.evernym.dom');		
			$('textarea').keyup(function () {
				that.textClass('');
				that.error(false);				
				that.errorText('');												
			});							
			$('input, textarea').keyup(function () {
				that.emailClass('');
				that.errorEmail('');									
			});			
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'inviteFollowersView') {
			that.sendInviteCommand();
		}
	});
	
	this.menuCommand = function () {
		viewNavigate('Add/Invite', 'inviteFollowersView', 'channelMenuView');		
  };	
	
	this.sendInviteCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		var textData = $('#'+that.textId()).val();
		if (that.emailaddress() == '' || !emailReg.test(that.emailaddress())) {
			that.emailClass('validationerror');
			that.errorEmail('<span>SORRY:</span> Please enter valid email');
    } else if (textData == '') {
			that.textClass('validationerror');
			that.error(true);			
			that.errorText('<span>SORRY:</span> Please give message');
    } else {
			showMessage('Testing');			
    }
  };
	
	this.userSettings = function () {
		viewNavigate('Add/Invite', 'inviteFollowersView', 'escalationPlansView');
  };	
	
	this.composeCommand = function () {
		viewNavigate('Add/Invite', 'inviteFollowersView', 'sendMessageView');
  };	
	
}
