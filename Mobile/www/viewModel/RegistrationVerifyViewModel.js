function RegistrationVerifyViewModel() {	
  var self = this;
	self.template = 'registrationVerifyView';
	self.viewid = 'V-02f';
	self.viewname = 'RegistrationVerify';
	self.displayname = 'Registration Verify';
	
  self.inputObs = [ 'verificationCommethodType', 'verificationCommethod', 'verificationCommethodID', 'verificationCode'];
  self.errorObs = [ 'verificationClass', 'errorMessage'];	
  self.defineObservables();
	
	self.activate = function() {
		var newUser = ENYM.ctx.getItem('newusername');		
		if(newUser == '' || newUser == null) {
			goToView('homeView');
		} else {
			action = JSON.parse(ENYM.ctx.getItem('action'));
			self.getCommethods();
			self.accountName('Your evernym is: '+ENYM.ctx.getItem('accountName')+" (Don't forget!)");
			self.verificationCommethodType(ENYM.ctx.getItem('newuseremail'));				
			$('input').keyup(function () {
				self.clearErrorObs();
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
			self.verificationClass('validationerror');
			self.errorMessage("<span>ERROR:</span> Please input verification code!");
		}
		else if(self.verificationCode().length != 6) {
			self.verificationClass('validationerror');
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
				if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'Y') {
					var toastobj = {redirect: 'nameRequiredView', type: '', text: 'Email verified'};					
					goToView('nameRequiredView');
				}
				else if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'N'){
					var callbacks = {
						success: function() {		
							var toastobj = {redirect: 'tutorialView', type: '', text: 'Now following '+channel.name};										
						},
						error: function(data, status, details) {
							var toastobj = {redirect: 'tutorialView', type: 'toast-error', text: details.message};
						}
					};
					var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));						
					ES.channelService.followChannel(channel.id, callbacks);
					goToView('tutorialView');
				}
				else {
					var toastobj = {redirect: 'tutorialView', type: '', text: 'Email verified'};																	
					goToView('tutorialView');
				}
				showToast(toastobj);				
			},
			error: function (responseData, status, details) {
				self.errorMessage("<span>ERROR:</span> " + details.message);
			}
		};
		$.mobile.showPageLoadingMsg('a', 'Sending Verification Request');		
		return ES.commethodService.verification(verifyCommethodObject.code, callbacks, ES.evernymService.getAccessToken());
	};

	self.skipCommand = function () {
		if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'Y') {
			goToView('nameRequiredView');
		}
		else if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'N'){
			var callbacks = {
				success: function() {		
					var toastobj = {redirect: 'tutorialView', type: '', text: 'Now following '+channel.name};
					showToast(toastobj);
					goToView('tutorialView');										
				},
				error: function(data, status, details) {
					var toastobj = {redirect: 'tutorialView', type: 'toast-error', text: details.message};
					showToast(toastobj);
					goToView('tutorialView');
				}
			};
			var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));						
			ES.channelService.followChannel(channel.id, callbacks);																						
		}
		else {
			goToView('tutorialView');
		}	
	};	
	
}

RegistrationVerifyViewModel.prototype = new ENYM.ViewModel();
RegistrationVerifyViewModel.prototype.constructor = RegistrationVerifyViewModel;