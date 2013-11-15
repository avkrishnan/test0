/*globals ko*/
/* To do - Pradeep Kumar */
function ForgotPasswordViewModel() {
  var that = this;
  this.template = 'forgotPasswordView';
  this.viewid = 'V-03';
  this.viewname = 'ForgotPassword';
  this.displayname = 'Forgot Password';
	
	/* Forgot password observable */
  this.accountName = ko.observable();	
  this.email = ko.observable();
  this.errorEvernym = ko.observable();	
  this.errorEmail = ko.observable();
  this.usernameClass = ko.observable();
  this.emailClass = ko.observable();
	
	/* Methods */
  this.applyBindings = function () {
    $('#' + that.template).on('pagebeforeshow', null, function (e, data) {
      that.clearForm();	      
			that.activate();		
    });
  };
	
	this.clearForm = function () {
    that.email('');
    that.accountName('');
		that.usernameClass('');		
		that.emailClass('');		
    that.errorEvernym('');			
    that.errorEmail('');		
  };
	
  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {		
			$('input').keyup(function () {
				that.errorEvernym('');					
				that.errorEmail('');
				that.usernameClass('');
				that.emailClass('');
			});
		} else {
			goToView('channelListView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'forgotPasswordView') {
			that.forgotPasswordCommand();
		}
	});
	
  this.forgotPasswordCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    if (that.accountName() == '' && that.email() == '') {
      that.usernameClass('validationerror');
      that.emailClass('validationerror');
      that.errorEmail('Please enter Evernym or email');
    } else if (that.email() != '' && !emailReg.test(that.email())) {
      that.emailClass('validationerror');
      that.errorEmail('Please enter valid email');
    } else {
      var callbacks = {
        success: forgotPasswordSuccess,
        error: forgotPasswordError
      };
      var forgotPasswordModel = {};
      forgotPasswordModel.accountname = that.accountName();
      forgotPasswordModel.emailAddress = that.email();
			$.mobile.showPageLoadingMsg('a', 'Sending Forgot Password Request');
      return ES.loginService.forgotPassword(forgotPasswordModel, callbacks);
    }
  };

  function forgotPasswordSuccess(args) {
    $.mobile.hidePageLoadingMsg();
		if(that.accountName() == '') {
			localStorage.setItem('resetAccount', that.email());	
		} else {
			localStorage.setItem('resetAccount', that.accountName());				
		}
		goToView('forgotPasswordSuccessView');		
  }

  function forgotPasswordError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    loginPageIfBadLogin(details.code);
    if (details) {
			if(that.accountName() != '') {
				that.usernameClass('validationerror');
				that.errorEvernym(details.message);								
			} else{
				that.emailClass('validationerror');
				that.errorEmail(details.message);
			}
    } else {
      showError(details.message);
    }
  }
	
}