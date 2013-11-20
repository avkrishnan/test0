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
	
	this.clearForm = function () {
    that.firstname('');
    that.lastname('');
    that.errorFirstLastName('');
    that.errorIconFirstName('');
    that.errorIconLastName('');
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
		} 
		else {
			goToView('channelListView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'signupStepSecondView') {
			that.signUpCommand();
		}
	});
	
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
      that.errorFirstLastName('<span>SORRY:</span> Please enter first name');
    } else if (that.lastname() == '') {
      that.lastnameClass('validationerror');
      that.errorIconLastName('errorimg');
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

  function signUpError(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);		
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
		var callbacks = {
			success: function() {;},
			error: function(data, status, details) {alert(details.message);}
		};		
    $.mobile.hidePageLoadingMsg();
    ES.evernymService.clearAccessToken();
    if (args.accessToken) {
      var notifications = args.notifications;
      ES.evernymService.setAccessToken(args.accessToken);
      localStorage.setItem('accountName', args.account.accountname);
      that.first_name = args.account.firstname;
      that.last_name = args.account.lastname;
      localStorage.setItem('UserFullName', args.account.firstname + ' '+ args.account.lastname);
      $.mobile.activePage.find('#thefooter #footer-gear').html(args.account.accountname);
      var login_nav = JSON.parse(localStorage.getItem('login_nav'));
      localStorage.removeItem('login_nav');
      var follow = localStorage.getItem('follow');
			if(localStorage.getItem("action") == "follow_channel") {
				//alert(localStorage.getItem('currentChannel'));
				var channel = JSON.parse(localStorage.getItem('currentChannel'));
				ES.channelService.followChannel(channel.id, callbacks);
				localStorage.removeItem('action');
				goToView('channelMessagesView');				
			}
      if (follow) {
        // alert('hello, we are going to now go to or follow the channel ' +
        // follow);
        localStorage.removeItem('follow');
      }
			else if (login_nav) {
        var hash = login_nav.hash;
        // var parameters = login_nav.parameters;
        $.mobile.changePage(hash);
      } 
			else if (notifications.length) {
        for ( var n in notifications) {
          var code = notifications[n].code;
          notificationsViewModel.addNotification(notifications[n].code);
        }
        $.mobile.changePage('#' + notificationsViewModel.template);
      } 
			else {
        $.mobile.changePage('#' + channelListViewModel.template);
      }
    } 
		else {
      loginError();
      return;
    }
		goToView('registrationVerifyView');
  }

  function loginError(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    showError('LOGIN FAILED');
    ES.evernymService.clearAccessToken();
  }
	
}