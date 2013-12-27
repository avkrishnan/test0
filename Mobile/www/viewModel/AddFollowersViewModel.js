﻿/*globals ko*/
/* To do - Pradeep Kumar */
function AddFollowersViewModel() {	
  var that = this;
	this.template = 'addFollowersView';
	this.viewid = 'V-28';
	this.viewname = 'AddFollowers';
	this.displayname = 'Add Followers';	
	this.accountName = ko.observable();
	
  /* Add Followers observable */
	this.channelId = ko.observable();		
	this.channelName = ko.observable();
	this.firstLastName = ko.observable();	
	this.nameClass = ko.observable();
	this.errorName = ko.observable();		
	this.emailaddress = ko.observable();
	this.emailClass = ko.observable();
	this.errorEmail = ko.observable();							
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();				
      that.activate();
    });	
	};
	
	this.clearForm = function () {
		that.firstLastName('');
		that.nameClass('');
		that.errorName('');			
		that.emailaddress('');
		that.emailClass('');
		that.errorEmail('');							
	};	  
	
	this.activate = function() {
		if(authenticate()) {
			var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));		
			if(!channelObject) {
				goToView('channelsIOwnView');			
			} else {			
				that.accountName(appCtx.getItem('accountName'));		
				var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));	
				that.channelId(channelObject.channelId);										
				that.channelName(channelObject.channelName);
				$('input').keyup(function () {
					that.nameClass('');
					that.errorName('');			
					that.emailClass('');
					that.errorEmail('');
				});						
			}
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'addFollowersView') {
			that.addFollowersCommand();
		}
	});	
	
	this.addFollowersCommand = function () {		
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		if (that.firstLastName() == '') {
			that.nameClass('validationerror');
			that.errorName('<span>SORRY:</span> Please enter first and last name');
    } else if (that.emailaddress() == '' || !emailReg.test(that.emailaddress())) {
			that.emailClass('validationerror');
			that.errorEmail('<span>SORRY:</span> Please enter valid email');
    } else {
			$.mobile.showPageLoadingMsg("a", "Adding Follower");
			var provisional = generateProvisionalAccount();
			ES.channelService.provisionalEnroll(provisional, {success: successfulAdd, error: errorAPI});
		}
  };
	
	function generateProvisionalAccount() {
		var fullName = that.firstLastName().split(' ');
		var firstName = fullName[0];
		var lastName = fullName[1];		
		return {
			emailaddress: that.emailaddress(),
			smsPhone: that.smsPhone,
			firstname: firstName,
			lastname: lastName,
			channelid: that.channelId()
		};
	}
	
	function successfulAdd(data){			
		goToView('channelMainView');				
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();		
	};	
	
}