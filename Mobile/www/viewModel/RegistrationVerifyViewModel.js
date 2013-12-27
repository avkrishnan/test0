/*globals ko*/
/* To do - Pradeep Kumar */
function RegistrationVerifyViewModel() {	
  var that = this;
	this.template = 'registrationVerifyView';
	this.viewid = 'V-02f';
	this.viewname = 'RegistrationVerify';
	this.displayname = 'Registration Verify';	
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
			that.clearForm();			
      that.activate();
    });	
	};  
	
	this.clearForm = function () {
		that.verificationCode('');
    that.errorMessage('');
  };
	
	this.activate = function() {
		var newUser = ENYM.ctx.getItem('newusername');		
		if(newUser == '' || newUser == null) {
			goToView('homeView');
		} else {
			that.getCommethods();
			that.accountName('Your evernym is: '+ENYM.ctx.getItem('accountName')+" (Don't forget!)");
			that.verificationCommethodType(ENYM.ctx.getItem('newuseremail'));				
			$('input').keyup(function () {
				that.errorMessage('');
			});					
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'registrationVerifyView') {
			that.verifyRequestCommethod();
		}
	});		
	
	this.getCommethods = function() {
		var callbacks = {
			success: function(data){
				that.verificationCommethod(data.commethod[0].type);
				that.verificationCommethodID(data.commethod[0].id);
			},
			error: function (data, status, details) {
				showMessage(details.message);
			}
		};		
		return ES.commethodService.getCommethods(callbacks);
	}
	
	this.verifyRequestCommethod = function() {
		if(that.verificationCode() == '') {
			that.errorMessage("<span>ERROR:</span> Please input verification code!");
		}
		else if(that.verificationCode().length != 6) {
			that.errorMessage("<span>ERROR:</span> Verification code should be 6 digits!");
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
				var toastobj = {type: '', text: 'Verification code sent'};
				showToast(toastobj);										
			},
			error: function (responseData, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);
			}
		};
		$.mobile.showPageLoadingMsg('a', 'Resending Verification code');				
		return ES.commethodService.requestVerification(that.verificationCommethodID(), callbacks);
	}
	
	this.verifyRequest = function(verifyCommethodObject) {
		var callbacks = {
			success: function(responseData) {
				var toastobj = {redirect: 'tutorialView', type: '', text: 'Email verified'};
				showToast(toastobj);															
				goToView('tutorialView');
			},
			error: function (responseData, status, details) {
				that.errorMessage("<span>ERROR:</span> " + details.message);
			}
		};
		$.mobile.showPageLoadingMsg('a', 'Sending Verification Request');		
		return ES.commethodService.verification(verifyCommethodObject.code, callbacks, ES.evernymService.getAccessToken());
	};
	
}