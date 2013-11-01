/*globals ko*/

function SignupStepSecondViewModel() {
  var that = this;
  this.template = 'signupStepSecondView';
  this.viewid = 'V-02b';
  this.viewname = 'Register';
  this.displayname = 'Register';
  this.hasfooter = false;
	
	/* Signup observable */
  this.firstname = ko.observable();
  this.lastname = ko.observable();
	
  /* Information icon activate observable */
  this.firstNamehighlight = ko.observable();
  this.lastNamehighlight = ko.observable();

  /* Information toggle observable */
  this.firstNameInfo = ko.observable(false);
  this.lastNameInfo = ko.observable(false);
  this.errorFirstLastName = ko.observable();
  this.firstnameClass = ko.observable();
  this.lastnameClass = ko.observable();

	/* Error Icon observable */
  this.errorIconFirstName = ko.observable();
  this.errorIconLastName = ko.observable();

	/* Methods */
  this.applyBindings = function () {
    $('#' + this.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();
      that.activate();
    });
  };

  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			$('input').keyup(function () {
				that.firstnameClass('');
				that.lastnameClass('');
				that.errorFirstLastName('');
				that.errorIconFirstName('');
				that.errorIconLastName('');
			});
			$(document).keyup(function (e) {
				if (e.keyCode == 13) {
					that.signUpCommand();
				}
			});
			return true;
		} else {
			goToView('escalationPlansView');
		}
  };
	
  that.firstNameActiveInfo = function () {
    showHideInfo('lastNameInfo', 'lastNamehighlight', 'firstNameInfo', 'firstNamehighlight');
  }
	
  that.lastNameActiveInfo = function () {
    showHideInfo('firstNameInfo', 'firstNamehighlight', 'lastNameInfo', 'lastNamehighlight');
  }

  /* This function will toggle info on 'i' tap */
  function showHideInfo(hideElement, hideClass, showElement, showClass) {
    if (that[showElement]() == false) {
      that[hideElement](false);
      that[showElement](true);
      that[hideClass]('');
      that[showClass]('enable');
    } else {
      that.firstNameInfo(false);
      that.lastNameInfo(false);
      that.firstNamehighlight('');
      that.lastNamehighlight('');
    }
  }
	
  this.clearForm = function () {
    that.firstname('');
    that.lastname('');
    that.errorFirstLastName('');
    that.errorIconFirstName('');
    that.errorIconLastName('');
  };

  function generateAccount() {
    return {
      emailaddress: localStorage.getItem('newuseremail'),
      accountname: localStorage.getItem('newusername'),
      /* Create Random AccountName Generator */			
      password: localStorage.getItem('newuserpassword'),
      firstname: that.firstname(),
      lastname: that.lastname()
    };
  };
	
  this.signUpCommand = function () {
    if (that.firstname() == '') {
      that.firstnameClass('validationerror');
      that.errorIconFirstName('errorimg');
      that.errorFirstLastName('<span>SORRY:</span>Please enter firstname');
    } else if (that.lastname() == '') {
      that.lastnameClass('validationerror');
      that.errorIconLastName('errorimg');
      that.errorFirstLastName('<span>SORRY:</span>Please enter lastname');
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
    goToView('tutorialView');
  };

  function signUpError(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('signupStepFirstView');
  };
}