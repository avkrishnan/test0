function SignupStepFirstViewModel() {
  var self = this;
	self.requiresAuth = false;
  self.template = 'signupStepFirstView';
  self.viewid = 'V-02';
  self.viewname = 'Register';
  self.displayname = 'Register';
	
  self.inputObs = [ 'evernym', 'password', 'emailaddress', 'guest' ];
  self.errorObs = [ 'errorEmail', 'errorAccountName', 'errorPassword', 'emailClass', 'accountNameClass', 'passwordClass']
	
	self.defineObservables();	

  self.activate = function () {
		var token = ES.evernymService.getAccessToken();
		self.guest(true);
		if(token == '' || token == null) {
			$('input').keyup(function () {
				self.clearErrorObs();
			});
			if(ENYM.ctx.getItem('signupObj')) {
				self.emailaddress(ENYM.ctx.getItem('signupObj').emailAddress);
				self.evernym(ENYM.ctx.getItem('signupObj').evernymName);
				ENYM.ctx.removeItem('signupObj');
			} 
		} 
		else {
			goToView('homeView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'signupStepFirstView') {
			self.nextViewCommand();
		}
	});
	
	/* Create Random AccountName Generator */	
  function generateAccount() {
    return {
      emailaddress: self.emailaddress(),
      accountname: self.evernym(),		
      password: self.password()	
    };
  };	
	
  self.nextViewCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		var nameReg = /^[a-zA-Z0-9]+$/;
		txtEmail = self.emailaddress().replace(/\s/g, '');
		self.emailaddress(txtEmail);
    if (self.emailaddress() == '' || !emailReg.test(self.emailaddress())) {
      self.emailClass('validationerror');
      self.errorEmail('<span>Sorry,</span> Please enter valid email');
    } else if (self.evernym() == '') {
      self.accountNameClass('validationerror');
      self.errorAccountName('<span>Sorry,</span> Please enter Evernym name');
		} else if (!nameReg.test(self.evernym())) {
			self.accountNameClass('validationerror');
			self.errorAccountName('<span>Sorry,</span> Letters and numbers only, no spaces.');			
    } else if (self.evernym().length < 5 || self.evernym().length > 25) {
      self.accountNameClass('validationerror');
      self.errorAccountName('<span>Sorry,</span> Evernym min. 5 and max. 25 characters');
		} else if (self.password() == '') {
      self.passwordClass('validationerror');
      self.errorPassword('<span>Sorry,</span> Please enter password');	
    } else if (self.password().length < 8) {
      self.passwordClass('validationerror');
      self.errorPassword('<span>Sorry,</span> Password of min. 8 characters');
    } else {
			$.mobile.showPageLoadingMsg('a', 'Checking Evernym availability');
			return ES.loginService.checkName(self.evernym(), { success: successAvailable, error: errorAPI });
    }
  };
	
	function successAvailable(data){
		if(data){
			self.accountNameClass('validationerror');
      self.errorAccountName('<span>Sorry,</span> This evernym has already been taken');
		} else {
      $.mobile.showPageLoadingMsg('a', 'Enrolling');
      var callbacks = {
        success: signUpSuccess,
        error: signUpError
      };
      var account = generateAccount();
      ES.loginService.accountEnroll(account, callbacks);
		}
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		self.errorPassword('<span>Sorry,</span> Please enter password');
	};	
	

  function signUpSuccess(args) {
		if(!$.isEmptyObject(args)) {
			self.guest(false);
		}
    $.mobile.hidePageLoadingMsg();
		self.loginCommand();
  };

  function signUpError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		if(details.code == '100930') {
			self.emailClass('validationerror');										
			self.errorEmail('<span>Sorry, </span> email used by another account');
		}
  };
	
	self.loginCommand = function() {
    $.mobile.showPageLoadingMsg('a', 'Logging in with new credentials');
    var callbacks = {
      success : loginSuccess,
      error : loginError
    };
    var loginModel = {};
    loginModel.accountname = self.evernym();
    loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';		
		loginModel.overrideTtl = 3600;
    loginModel.password = self.password();		
    ES.loginService.accountLogin(loginModel, callbacks);
	};
	
	function loginSuccess(args) {		
    $.mobile.hidePageLoadingMsg();
    ES.evernymService.clearAccessToken();
		ES.evernymService.setAccessToken(args.accessToken);
		ENYM.ctx.setItem('accountName', args.account.accountname);
		ENYM.ctx.setItem('newusername', self.evernym());
		ENYM.ctx.setItem('newuseremail', self.emailaddress());
		ENYM.ctx.setItem('evernym', 1);
		if(self.guest() == true) {			
			goToView('registrationVerifyView');
		}
  };

  function loginError(data, status, details) {
    $.mobile.hidePageLoadingMsg();		
		self.errorFirstLastName('<span>Sorry,</span> '+details.message);
    ES.evernymService.clearAccessToken();
  };	    	
	self.privacyPolicy = function(){
		var signupObj = {emailAddress: self.emailaddress(), evernymName: self.evernym()};			
		ENYM.ctx.setItem('signupObj', signupObj);
		goToView('privacyPolicyView');
	};		
}

SignupStepFirstViewModel.prototype = new ENYM.ViewModel();
SignupStepFirstViewModel.prototype.constructor = SignupStepFirstViewModel;