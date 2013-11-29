/*globals ko*/
/* To do - Pradeep Kumar */
function SignupStepSecondViewModel() {
  var that = this;
  this.template = 'signupStepSecondView';
  this.viewid = 'V-02b';
  this.viewname = 'Register';
  this.displayname = 'Register';
	
	/* Signup observable */
  this.firstname = ko.observable();
  this.lastname = ko.observable();
  this.errorFirstLastName = ko.observable();
  this.firstnameClass = ko.observable();
  this.lastnameClass = ko.observable();

	/* Methods */
  this.applyBindings = function () {
    $('#' + this.template).on('pagebeforeshow', function (e, data) {
			that.clearForm();			
      that.activate();
    });
  };
	
	this.clearForm = function () {
    that.firstname('');
    that.lastname('');
    that.errorFirstLastName('');
  };

  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		var newUser = localStorage.getItem('newusername');		
		if(token == '' || token == null) {
			$('input').keyup(function () {
				that.firstnameClass('');
				that.lastnameClass('');
				that.errorFirstLastName('');
			});
		}	else if(newUser == '' || newUser == null) {
			goToView('channelListView');
		} else {
			goToView('tutorialView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'signupStepSecondView') {
			that.signUpCommand();
		}
	});
	
	/* Create Random AccountName Generator */	
  function generateAccount() {
    return {
      emailaddress: localStorage.getItem('newuseremail'),
      accountname: localStorage.getItem('newusername'),		
      password: localStorage.getItem('newuserpassword'),
      firstname: that.firstname(),
      lastname: that.lastname()
    };
  };
	
  this.signUpCommand = function () {
    if (that.firstname() == '') {
      that.firstnameClass('validationerror');
      that.errorFirstLastName('<span>SORRY:</span> Please enter first name');
    } else if (that.lastname() == '') {
      that.lastnameClass('validationerror');
      that.errorFirstLastName('<span>SORRY:</span> Please enter last name');
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

  function signUpSuccess(args) {
    $.mobile.hidePageLoadingMsg();
		that.loginCommand();
  };

  function signUpError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', details.message);		
    goToView('signupStepFirstView');
  };
	
	this.loginCommand = function() {
    $.mobile.showPageLoadingMsg('a', 'Logging In With New Credentials');
    var callbacks = {
      success : loginSuccess,
      error : loginError
    };
    var loginModel = {};
    loginModel.accountname = localStorage.getItem('newusername');
    loginModel.password = localStorage.getItem('newuserpassword');
    loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
    ES.loginService.accountLogin(loginModel, callbacks);
	}
	
	function loginSuccess(args) {		
    $.mobile.hidePageLoadingMsg();
    ES.evernymService.clearAccessToken();
		ES.evernymService.setAccessToken(args.accessToken);
		localStorage.setItem('accountName', args.account.accountname);
		goToView('registrationVerifyView');			
  }

  function loginError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.toastText(details.message);		
		showToast();
    ES.evernymService.clearAccessToken();
  }
	
}