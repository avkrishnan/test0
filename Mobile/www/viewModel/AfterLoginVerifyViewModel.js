function AfterLoginVerifyViewModel() {	
  var self = this;
	self.template = 'afterLoginVerifyView';
	self.viewid = 'V-??';
	self.viewname = 'Verify Contact';
	self.displayname = 'Verify Contact';
	
  self.inputObs = [ 'commethod', 'verificationCommethodType', 'verificationCommethod', 'verificationCommethodID', 'verificationCode', 'verified', 'status'];
  self.errorObs = [ 'verificationClass', 'errorMessage'];	
  self.defineObservables();
	
	self.activate = function() {
		addExternalMarkup(self.template); // This is for header/overlay message	
		action = JSON.parse(ENYM.ctx.getItem('action'));	
		$('input').keyup(function () {
			self.clearErrorObs();
		});
		return self.getCommethods();
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'afterLoginVerifyView') {
			self.verifyRequestCommethod();
		}
	});
	
	self.verifyCommand = function(){
		self.status('verify');
		$.when(self.getCommethods().then(function(data) {
			if(self.verified() == 'Y') {
				self.skipCommand();					
			}
			else {
				self.verifyRequestCommethod();
			}
		}));		
	};			
	
	self.getCommethods = function() {
		var callbacks = {
			success: function(data){
				self.commethod(data.commethod[0].address);
				self.verificationCommethodType();		
				self.verificationCommethod(data.commethod[0].type);
				self.verificationCommethodID(data.commethod[0].id);
				self.verified(data.commethod[0].verified);
				var callback = {
					success: function(responseData) {										
					},
					error: function (responseData, status, details) {
						var toastobj = {type: 'toast-error', text: details.message};
						showToast(toastobj);
					}
				};
				if(self.status() != 'verify') {				
					ES.commethodService.requestVerification(self.verificationCommethodID(), callback);
				}
			},
			error: function (data, status, details) {
				showMessage(details.message);
			}
		};
		$.mobile.showPageLoadingMsg('a', 'Sending Verification Request');		
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
							var toastobj = {redirect: 'channelsFollowingListView', type: '', text: 'Now following '+channel.name};
							showToast(toastobj);										
						},
						error: function(data, status, details) {
							var toastobj = {redirect: 'channelsFollowingListView', type: 'toast-error', text: details.message};
							showToast(toastobj);
						}
					};
					var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));						
					ES.channelService.followChannel(channel.id, callbacks);
					goToView('channelsFollowingListView');
					ENYM.ctx.removeItem('action');
				}
				else {
					var toastobj = {redirect: 'homeView', type: '', text: 'Email verified'};																	
					goToView('homeView');
				}
				showToast(toastobj);				
			},
			error: function (responseData, status, details) {
				if(details.code == '100912') {
					self.verified('Y');
					self.skipCommand();
				}
				else {
					self.verified('N');
					self.errorMessage("<span>ERROR:</span> " + details.message);
				}
			}
		};
		$.mobile.showPageLoadingMsg('a', 'Sending Verification Request');		
		return ES.commethodService.verification(verifyCommethodObject.code, callbacks, ES.evernymService.getAccessToken());
	};

	self.skipCommand = function () {
		if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'Y') {
			if(self.verified() == 'Y') {
				var toastobj = {redirect: 'nameRequiredView', type: 'toast-info', text: 'Email already verified'};
				showToast(toastobj);
				goToView('nameRequiredView');
			}
			else {
				goToView('nameRequiredView');
			}
		}
		else if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'N'){
			var callbacks = {
				success: function() {		
					var toastobj = {redirect: 'channelsFollowingListView', type: '', text: 'Now following '+channel.name};
					showToast(toastobj);
					goToView('channelsFollowingListView');										
				},
				error: function(data, status, details) {
					var toastobj = {redirect: 'channelsFollowingListView', type: 'toast-error', text: details.message};
					showToast(toastobj);
					goToView('channelsFollowingListView');
				}
			};
			var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));						
			ES.channelService.followChannel(channel.id, callbacks);
			ENYM.ctx.removeItem('action');																						
		}
		else {
			if(self.verified() == 'Y') {
				if(self.verificationCommethod == 'TEXT') {
					var toastText = 'Phone number already verified';					
				}
				else {
					var toastText = 'Email already verified';				
				}				
				var toastobj = {redirect: 'homeView', type: 'toast-info', text: toastText};
				showToast(toastobj);
				goToView('homeView');
			}
			else {			
				goToView('homeView');
			}
		}	
	};		
	
}

AfterLoginVerifyViewModel.prototype = new ENYM.ViewModel();
AfterLoginVerifyViewModel.prototype.constructor = AfterLoginVerifyViewModel;