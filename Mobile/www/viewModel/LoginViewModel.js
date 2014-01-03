﻿function LoginViewModel() {
  var self = this;
  
  self.requiresAuth = false;
  
  self.template = "loginView";
  self.viewid = "V-01";
  self.viewname = "Login";
  self.displayname = "Login";	
	
  self.inputObs = [ 'username', 'password'];
  self.errorObs = [ 'errorMessage', 'usernameClass', 'passwordClass' ];

  self.defineObservables();
	
  self.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {			
			self.errorMessage('');
			if (ENYM.ctx.getItem("username") == null && ENYM.ctx.getItem("password") == null) {
				self.username('');
				self.password('');
			}
			else {
				self.username(ENYM.ctx.getItem("username"));
				self.password(ENYM.ctx.getItem("password"));
				$("input[type='checkbox']").attr("checked", true).checkboxradio("refresh");
			}
			$('input').keyup(function() {
				self.clearErrorObs();
			});
		} 
		else {
			goToView('homeView');
		}
  };
	
	$(document).keyup(function(e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'loginView') {
			//self.errorMessage('');
			self.loginCommand();
		}
	});
	
  self.loginCommand = function() {
    if (self.username() == '' && self.password() == '') {
      self.usernameClass('validationerror');
      self.passwordClass('validationerror');
      self.errorMessage('<span>SORRY:</span> Please enter username and password');
    } 
		else if(self.username() == '') {
      self.usernameClass('validationerror');
      self.errorMessage('<span>SORRY:</span> Please enter username');
    } 
		else if(self.password() == '') {
      self.passwordClass('validationerror');
      self.errorMessage('<span>SORRY:</span> Please enter password');
    } 
		else {
			self.errorMessage('');
      if ($('input[name="rememberPassword"]:checked').length == 1) {
				ENYM.ctx.setItem("username", self.username());
        ENYM.ctx.setItem("password", self.password());
      }
			else {
				ENYM.ctx.removeItem('username');
				ENYM.ctx.removeItem('password');
			}
      var loginError = function(data, status, details) {
				self.usernameClass('validationerror');
				self.passwordClass('validationerror');
				self.errorMessage('<span>SORRY: </span> ' + details.message);
			  self.password('');
			};
      var loginModel = {};
      $.mobile.showPageLoadingMsg("a", "Logging In");
      loginModel.accountname = self.username();
      loginModel.password = self.password();
      loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
      return ES.loginService.accountLogin(loginModel).then(loginSuccess, loginError);
    }
  };
	
  self.cleanApplication = function() {
    ES.evernymService.clearAccessToken();
    ENYM.ctx.removeItem('login_nav');
    ENYM.ctx.removeItem('currentChannel');
    ENYM.ctx.removeItem('accountName');
    ENYM.ctx.removeItem('name');
    ENYM.ctx.removeItem('signUpError');
		ENYM.ctx.removeItem('newuseremail');
		ENYM.ctx.removeItem('newusername');
		ENYM.ctx.removeItem('newuserpassword');
		ENYM.ctx.removeItem('roleType');
    //channelListViewModel.clearForm();
    //notificationsViewModel.removeNotifications();
    //OVERLAY.removeNotifications();
  };

  function loginSuccess(args) {
		var callbacks = {
			success: function() {
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);
			}
		};
    $.mobile.hidePageLoadingMsg();
    // if (isPhoneGap()) {
    // alert("Running on PhoneGap!");
    // registerPushNotifications();
    // } else {
    // alert("Not running on PhoneGap!");
    // }
    ES.evernymService.clearAccessToken();
    if (args.accessToken) {
      ES.evernymService.setAccessToken(args.accessToken);
			ENYM.ctx.setItem('account', JSON.stringify(args.account));
      ENYM.ctx.setItem('accountName', self.username());
			if(typeof args.privs != 'undefined') {
				ENYM.ctx.setItem('roleType', args.privs);
			}
			var action = JSON.parse(ENYM.ctx.getItem('action'));
			if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'N') {
				var callbacks = {
					success: function() {
						ENYM.ctx.removeItem('action');
						var toastobj = {redirect: 'channelMessagesView', type: '', text: 'Now following '+channel.name};
						showToast(toastobj);						
						goToView('channelMessagesView');					
					},
					error: function(data, status, details) {
						ENYM.ctx.removeItem('action');
						var toastobj = {redirect: 'channelMessagesView', type: 'toast-info', text: details.message};
						showToast(toastobj);											
						goToView('channelMessagesView');
					}
				};						
				var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));
				ES.channelService.followChannel(channel.id, callbacks);
			}
			else if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'Y') {
				if(args.account.firstname && args.account.lastname) {
					var callbacks = {
						success: function() {		
							var toastobj = {redirect: 'channelMessagesView', type: '', text: 'Now following '+channel.name};
							showToast(toastobj);
							goToView('channelMessagesView');										
						},
						error: function(data, status, details) {
							var toastobj = {type: 'toast-error', text: details.message};
							showToast(toastobj);
						}
					};
					var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));						
					ES.channelService.followChannel(channel.id, callbacks);																						
				}
				else {
					goToView('nameRequiredView');
				}
			}
			else {
				goToView('homeView');
			}
    } 
		else {
			self.errorMessage('<span>SORRY: </span> Unknown Error.');
      return;
    }
  }
		
}

LoginViewModel.prototype = new ENYM.ViewModel();
LoginViewModel.prototype.constructor = LoginViewModel;