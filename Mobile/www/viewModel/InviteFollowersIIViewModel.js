﻿/*globals ko*/
/* To do - Pradeep Kumar */
function InviteFollowersIIViewModel() {
  var that = this;
  this.template = 'inviteFollowersIIView';
  this.viewid = 'V-41';
  this.viewname = 'GetFollowersII';
  this.displayname = 'Praise for Evernym Channels';
	this.accountName = ko.observable();	

  /* Feedback value and error observable */
	this.emailaddress = ko.observable();		
	this.feedbackClass = ko.observable();
	this.feedback = ko.observable();
	this.feedbackId = ko.observable('feedback');								
	this.errorFeedback = ko.observable();	
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();						
      that.activate();
    });	
	};
	
	this.clearForm = function () {
		that.emailaddress('');
		that.feedback('');
		that.feedbackClass('');
		that.errorFeedback('');				
	};  

	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			$('input').keyup(function () {
				that.emailClass('');
				that.errorEmail('');
				that.feedbackClass('');
				that.errorFeedback('');
			});
		}
	}
	
	$(document).keypress(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'inviteFollowersIIView') {
			that.sendFeedbackCommand();
		}
	});
	
	this.sendFeedbackCommand = function () {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var feedbackData = $('#'+that.feedbackId()).val();
    if (feedbackData == '') {
			that.feedbackClass('validationerror');
			that.errorFeedback('<span>SORRY :</span> Please give feedback');
    } else {
      goToView('inviteFollowersIIView');
    }
  };
		
}
/* To do - removed once Invitefollowers page complete
 function generateProvisionalAccount() {
    return {
      emailaddress: that.emailaddress,
      smsPhone: that.smsPhone,
      firstname: that.firstname,
      lastname: that.lastname,
      channelid: that.channelid
    };
  }

  function getChannelFromPageData() {
    that.activate({
      id: $.mobile.pageData.id
    });
  }
  this.logoutCommand = function () {
    loginViewModel.logoutCommand();
    $.mobile.changePage('#' + loginViewModel.template)
  };
  this.backNav = function () {
    $.mobile.changePage('#' + channelMenuViewModel.template);
  };
  this.activate = function (channel) {
    that.channelid(channel.id);
    that.channelname(channel.name);
    that.normName(channel.normName);
    return true;
  };
  this.addFollowerCommand = function (provisionalAccount) {
    $.mobile.showPageLoadingMsg('a', 'Adding Follower');
    var callbacks = {
      success: addFollowerSuccess,
      error: addFollowerError
    };
    var provisional = generateProvisionalAccount();
    ES.channelService.provisionalEnroll(provisional, callbacks);
  };

  function addFollowerSuccess(args) {
    $.mobile.hidePageLoadingMsg();
  }

  function addFollowerError(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    loginPageIfBadLogin(response.code);
    showError('Error Creating Follower Account: ' + response.message);
  }*/