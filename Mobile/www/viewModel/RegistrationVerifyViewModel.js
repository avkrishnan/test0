function RegistrationVerifyViewModel() {	
  var self = this;
	self.template = 'registrationVerifyView';
	self.viewid = 'V-02f';
	self.viewname = 'RegistrationVerify';
	self.displayname = 'Registration Verify';
	
  self.inputObs = [ 'verificationCommethodType', 'verificationCommethod', 'verificationCommethodID', 'verificationCode', 'errorMessage' ];
  self.defineObservables();
	
	self.activate = function() {
		var newUser = ENYM.ctx.getItem('newusername');		
		if(newUser == '' || newUser == null) {
			goToView('homeView');
		} else {
			self.getCommethods();
			self.accountName('Your evernym is: '+ENYM.ctx.getItem('accountName')+" (Don't forget!)");
			self.verificationCommethodType(ENYM.ctx.getItem('newuseremail'));				
			$('input').keyup(function () {
				self.errorMessage('');
			});					
		}
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'registrationVerifyView') {
			self.verifyRequestCommethod();
		}
	});		
	
	self.getCommethods = function() {
		var callbacks = {
			success: function(data){
				self.verificationCommethod(data.commethod[0].type);
				self.verificationCommethodID(data.commethod[0].id);
			},
			error: function (data, status, details) {
				showMessage(details.message);
			}
		};		
		return ES.commethodService.getCommethods(callbacks);
	};
	
	self.verifyRequestCommethod = function() {
		if(self.verificationCode() == '') {
			self.errorMessage("<span>ERROR:</span> Please input verification code!");
		}
		else if(self.verificationCode().length != 6) {
			self.errorMessage("<span>ERROR:</span> Verification code should be 6 digits!");
		}
		else {
			var verifyCommethodObject = {
				code : self.verificationCode(),
				type : self.verificationCommethodType(),
				address : self.verificationCommethod()
			};
			self.verifyRequest(verifyCommethodObject);
		}
	};
	
	self.requestVerificationCode = function() {
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
		return ES.commethodService.requestVerification(self.verificationCommethodID(), callbacks);
	};
	
	self.verifyRequest = function(verifyCommethodObject) {
		var callbacks = {
			success: function(responseData) {
				var toastobj = {redirect: 'tutorialView', type: '', text: 'Email verified'};
				showToast(toastobj);
				if(ENYM.ctx.getItem("action") == 'follow_channel') {
					goToView('nameRequiredView');
				}
				else {															
					goToView('tutorialView');
				}
			},
			error: function (responseData, status, details) {
				self.errorMessage("<span>ERROR:</span> " + details.message);
			}
		};
		$.mobile.showPageLoadingMsg('a', 'Sending Verification Request');		
		return ES.commethodService.verification(verifyCommethodObject.code, callbacks, ES.evernymService.getAccessToken());
	};

	self.skipCommand = function () {
		if(ENYM.ctx.getItem("action") == 'follow_channel') {
			goToView('nameRequiredView');
		}
		else {															
			goToView('tutorialView');
		}		
	};	
	
}

RegistrationVerifyViewModel.prototype = new ENYM.ViewModel();
RegistrationVerifyViewModel.prototype.constructor = RegistrationVerifyViewModel;