﻿/*globals ko*/
function RegistrationVerifyViewModel() {	
  var that = this;
	this.template = 'registrationVerifyView';
	this.viewid = 'V-02f';
	this.viewname = 'RegistrationVerify';
	this.displayname = 'Registration Verify';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	
	/* Registration verify observable */
	this.verificationCommethodType = ko.observable();
	this.verificationCommethod = ko.observable();
	this.verificationCommethodID = ko.observable();		
	this.verificationCode = ko.observable();
	this.errorMessage = ko.observable();					
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
			that.clearForm();
    });	
	};  
	
	this.activate = function() {
		var newUser = localStorage.getItem('newusername');		
		if(newUser == '' || newUser == null) {
			goToView('channelListView');
		}
		that.accountName(localStorage.getItem('newusername'));
		that.verificationCommethodType(localStorage.getItem('newuseremail'));
		that.verificationCommethod(localStorage.getItem("currentVerificationCommethod"));
		that.verificationCommethodID(localStorage.getItem("currentVerificationCommethodID"));
		$('input').keyup(function () {
			that.errorMessage('');
		});
		$(document).keyup(function (e) {
			if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'registrationVerifyView') {
				that.verifyRequestCommethod();
			}
		});
	}
	
	this.clearForm = function () {
		that.verificationCode('');
    that.errorMessage('');
  };
	
	this.verifyRequestCommethod = function() {
		if(that.verificationCode() == '') {
			that.errorMessage("<span>ERROR : </span> Please input verification code!");
		}
		else if(that.verificationCode().length != 6) {
			that.errorMessage("<span>ERROR : </span> Verification code should be 6 digits!");
		}
		else {
			var verifyCommethodObject = {
				code : that.verificationCode(),
				type : that.verificationCommethodType(),
				address : that.verificationCommethod()
			};
			that.verifyRequest(verifyCommethodObject);
		}
	}
	
	this.requestVerificationCode = function() {
		var callbacks = {
			success: function(responseData) {
				showMessage('Verification code sent!');
			},
			error: function (responseData, status, details) {
				showMessage(details.message);
			}
		};	
		alert(that.verificationCommethodID())	
		return ES.commethodService.requestVerification(that.verificationCommethodID(), callbacks);
	}
	
	this.verifyRequest = function(verifyCommethodObject) {
		var callbacks = {
			success: function(responseData) {
				goToView('tutorialView');
			},
			error: function (responseData, status, details) {
				that.errorMessage("<span>ERROR : </span>" + details.message);
			}
		};
		return ES.commethodService.verification(verifyCommethodObject.code, callbacks, ES.evernymService.getAccessToken());
	};	
	
}