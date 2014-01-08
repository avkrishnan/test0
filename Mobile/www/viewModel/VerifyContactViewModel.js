function VerifyContactViewModel() {
	var self = this;
	self.template = "verifyContactView";
	self.viewid = "V-081";
	self.viewname = "Verify Contact";
	self.displayname = "Verify Contact";
	self.hasfooter = true;
	
  self.inputObs = ['verificationCommethod', 'verificationCommethodType', 'verificationCommethodID', 'verificationCode', 'navText', 'errorMessage', 'verificationStatus'];
  self.defineObservables();		
	
	self.pView = '';
	
	self.gotoView = function() {
		ENYM.ctx.removeItem("currentVerificationCommethodID");
		goToView("addContactView");
	};
	
	self.verifyRequestCommethod = function() {
		if(self.verificationCode() == '') {
			self.errorMessage("<span>ERROR: </span> Please input verification code!");
		} else if(self.verificationCode().length != 6) {
			self.errorMessage("<span>ERROR: </span> Verification code should be 6 digits!");
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
				self.errorMessage("<span>ERROR: </span> " + details.message);
			}
		};		
		return ES.commethodService.requestVerification(self.verificationCommethodID(), callbacks);
	};
	
	self.inputKeyUp = function(e) {
		if( e.keyCode != 13 ) {
			self.errorMessage('');
		}
		return true;
	};
    
	self.activate = function() {
		addExternalMarkup(self.template); // This is for header/overlay message
		var currentBaseUrl = ENYM.ctx.getItem("baseUrl");
		var previousView = ENYM.ctx.getItem('previousView');
		console.log("previousView: " + previousView);
		var vm = ko.dataFor($("#" + previousView).get(0));
		console.log("previousView Model viewid: " + vm.displayname);
		self.navText(vm.displayname);
		self.pView = previousView;		
		$('#verifyContactView input').on("keyup", self.inputKeyUp);
		self.verificationCode('');
		self.errorMessage('');
		self.verificationCommethod(ENYM.ctx.getItem("currentVerificationCommethod"));
		self.verificationCommethodID(ENYM.ctx.getItem("currentVerificationCommethodID"));
		self.verificationStatus(ENYM.ctx.getItem("verificationStatus"));
		if (self.verificationStatus() == 'false') {
			self.verificationStatus(false);
		} else {
			self.verificationStatus(true);
		}
		if(ENYM.ctx.getItem("commethodType") == 'EMAIL') {
			self.verificationCommethodType('We have sent you a confirmation message. Verify by clicking on the link (or enter the code below).');
		} else {
			self.verificationCommethodType('We have sent you a confirmation message. Verify by entering the code below.');
		}
		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;
	};
	
	$(document).keyup(function(e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'verifyContactView') {
			self.errorMessage('');
			self.verifyRequestCommethod();
		}
	});

	self.verifyRequest = function(verifyCommethodObject) {
		var callbacks = {
			success: function(responseData) {
				if(ENYM.ctx.getItem("commethodType") == 'TEXT') {
					var toastText = 'Phone number verified';					
				}
				else {
					var toastText = 'Email verified';				
				}
				ENYM.ctx.removeItem("commethodType");
				var toastobj = {redirect: 'addContactView', type: '', text: toastText};
				showToast(toastobj);	
				goToView('addContactView');
			},
			error: function (responseData, status, details) {
				if(details.code == '100912') {
					if(ENYM.ctx.getItem("commethodType") == 'TEXT') {
						var toastText = 'Phone number already verified';					
					}
					else {
						var toastText = 'Email already verified';				
					}
					ENYM.ctx.removeItem("commethodType");
					var toastobj = {redirect: 'addContactView', type: 'toast-info', text: toastText};
					showToast(toastobj);	
					goToView('addContactView');					
				}
				else {		
					self.errorMessage("<span>ERROR: </span>" + details.message);
				}
			}
		};	
		return ES.commethodService.verification(verifyCommethodObject.code, callbacks, ES.evernymService.getAccessToken());
	};
}

VerifyContactViewModel.prototype = new ENYM.ViewModel();
VerifyContactViewModel.prototype.constructor = VerifyContactViewModel;