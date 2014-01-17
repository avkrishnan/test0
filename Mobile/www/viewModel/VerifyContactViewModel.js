function VerifyContactViewModel() {
	var self = this;
	self.template = 'verifyContactView';
	self.viewid = 'V-10';
	self.viewname = 'Verify Contact';
	self.displayname = 'Verify Contact';
	self.hasfooter = true;
	
  self.inputObs = ['verificationCommethod', 'verificationCommethodType', 'verificationCommethodID', 'verificationCode', 'verificationStatus'];
	self.errorObs = [ 'verificationClass', 'errorMessage'];	
  self.defineObservables();
	
	self.activate = function() {
		var  emailVerificationText, phoneVerificationText;
		addExternalMarkup(self.template); // This is for header/overlay message
		self.verificationCommethod(ENYM.ctx.getItem('currentVerificationCommethod'));
		self.verificationCommethodID(ENYM.ctx.getItem('currentVerificationCommethodID'));
		self.verificationStatus(ENYM.ctx.getItem('verificationStatus'));
		$('input').keyup(function () {
			self.clearErrorObs();
		});			
		if (self.verificationStatus() == false) {
			self.verificationStatus(false);
			emailVerificationText = 'To verify, click on the link (or enter the code below) from the message sent to you previously.';
			phoneVerificationText =  'To verify, enter the code below from the message sent to you previously.'
		} else {
			self.verificationStatus(true);
			emailVerificationText = 'We have sent you a confirmation message. Verify by clicking on the link (or enter the code below).';
			phoneVerificationText = 'We have sent you a confirmation message. Verify by entering the code below.';
		}
		if(ENYM.ctx.getItem('commethodType') == 'EMAIL') {
			self.verificationCommethodType(emailVerificationText);
		} else {
			self.verificationCommethodType(phoneVerificationText);
		}
	};
	
	$(document).keyup(function(e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'verifyContactView') {
			self.getCommethods();
		}
	});
	
	self.gotoView = function() {
		ENYM.ctx.removeItem('currentVerificationCommethodID');
		goToView('addContactView');
	};
	
	self.getCommethods = function(){
		$.mobile.showPageLoadingMsg('a', 'Sending Verification Request');
		var callbacks = {
			success: function(data){			
				for(var len = 0; len<data.commethod.length; len++) {
					if(data.commethod[len].id == self.verificationCommethodID()) {
						if(data.commethod[len].verified == 'Y') {
							if(ENYM.ctx.getItem('commethodType') == 'TEXT') {
								var toastText = 'Phone number already verified';					
							}
							else {
								var toastText = 'Email already verified';				
							}
							ENYM.ctx.removeItem('commethodType');
							var toastobj = {redirect: 'addContactView', type: 'toast-info', text: toastText};
							showToast(toastobj);	
							goToView('addContactView');							
						}
						else {
							self.verifyRequestCommethod();
						}
					}
				}
			},
			error: function (responseData, status, details) {
				self.verificationClass('validationerror');				
				self.errorMessage('<span>ERROR: </span> ' + details.message);
			}
		};
		return ES.commethodService.getCommethods(callbacks);
	};	
	
	self.verifyRequestCommethod = function() {
		if(self.verificationCode() == '') {
			self.verificationClass('validationerror');
			self.errorMessage('<span>ERROR: </span> Please input verification code!');
		} else if(self.verificationCode().length != 6) {
			self.verificationClass('validationerror');			
			self.errorMessage('<span>ERROR: </span> Verification code should be 6 digits!');
		} else {
			var verifyCommethodObject = {
				code : self.verificationCode(),
				type : self.verificationCommethodType,
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
				self.verificationClass('validationerror');				
				self.errorMessage('<span>ERROR: </span> ' + details.message);
			}
		};
		$.mobile.showPageLoadingMsg('a', 'Sending Verification Request');	
		return ES.commethodService.requestVerification(self.verificationCommethodID(), callbacks);
	};

	self.verifyRequest = function(verifyCommethodObject) {
		var callbacks = {
			success: function(responseData) {
				if(ENYM.ctx.getItem('commethodType') == 'TEXT') {
					var toastText = 'Phone number verified';					
				}
				else {
					var toastText = 'Email verified';				
				}
				ENYM.ctx.removeItem('commethodType');
				var toastobj = {redirect: 'addContactView', type: '', text: toastText};
				showToast(toastobj);	
				goToView('addContactView');
			},
			error: function (responseData, status, details) {
				if(details.code == '100912') {
					if(ENYM.ctx.getItem('commethodType') == 'TEXT') {
						var toastText = 'Phone number already verified';					
					}
					else {
						var toastText = 'Email already verified';				
					}
					ENYM.ctx.removeItem('commethodType');
					var toastobj = {redirect: 'addContactView', type: 'toast-info', text: toastText};
					showToast(toastobj);	
					goToView('addContactView');					
				}
				else {		
					self.errorMessage('<span>ERROR: </span>' + details.message);
				}
			}
		};	
		return ES.commethodService.verification(verifyCommethodObject.code, callbacks, ES.evernymService.getAccessToken());
	};
}

VerifyContactViewModel.prototype = new ENYM.ViewModel();
VerifyContactViewModel.prototype.constructor = VerifyContactViewModel;