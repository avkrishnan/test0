/*globals ko*/
/* To do - Pradeep Kumar */
function SignupStepFirstViewModel() {
  var that = this;
  this.template = 'signupStepFirstView';
  this.viewid = 'V-02';
  this.viewname = 'Register';
  this.displayname = 'Register';
	
  /* Signup observable */	
  this.accountName = ko.observable();
  this.password = ko.observable();
  this.emailaddress = ko.observable();

  /* Infomation class toggle observable */
  this.emailhighlight = ko.observable();
  this.emailunhighlight = ko.observable();
  this.namehighlight = ko.observable();
  this.passwordhighlight = ko.observable();

  /* Infomation toggle observable */
  this.aboutEvernym = ko.observable(true);
  this.emailInfo = ko.observable(false);
  this.nameInfo = ko.observable(false);
  this.passwordInfo = ko.observable(false);

  /* Display errors conditionally observable */
  this.errorEmail = ko.observable();
  this.errorAccountName = ko.observable();
  this.errorPassword = ko.observable();

  /* Display error icons observable */
  this.errorIconEmail = ko.observable();
  this.errorIconAccountName = ko.observable();
  this.errorIconPassword = ko.observable();

  /* Change error textbox color observable */
  this.emailClass = ko.observable();
  this.accountNameClass = ko.observable();
  this.passwordClass = ko.observable();

  /* Tick icon observable */
  this.tickIconEmail = ko.observable();
  this.tickIconAccountName = ko.observable();
  this.tickIconPassword = ko.observable();

	/* Methods */
  this.applyBindings = function () {
    $('#' + this.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();			
    });
  };
	
	this.clearForm = function () {
    that.accountName('');
    that.password('');
    that.emailaddress('');
    that.errorEmail('');
    that.errorAccountName('');
    that.errorPassword('');
    that.emailClass('');
    that.accountNameClass('');
    that.passwordClass('');
    that.errorIconEmail('');
    that.errorIconAccountName('');
    that.errorIconPassword('');
  };

  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {			
			$('input').keyup(function () {
				that.errorEmail('');
				that.errorAccountName('');
				that.errorPassword('');
				that.emailClass('');
				that.accountNameClass('');
				that.passwordClass('');
				that.errorIconEmail('');
				that.errorIconAccountName('');
				that.errorIconPassword('');
			});
		} 
		else {
			goToView('channelListView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'signupStepFirstView') {
			that.nextViewCommand();
		}
	});
	
  that.emailinput = function () {
    that.tickIconEmail('righttick');
  };
	
  that.emailActiveInfo = function () {
    toggleInfo('nameInfo', 'namehighlight', 'passwordInfo', 'passwordhighlight', 'emailInfo', 'emailhighlight');
  };
	
  that.nameActiveInfo = function () {
    toggleInfo('emailInfo', 'emailhighlight', 'passwordInfo', 'passwordhighlight', 'nameInfo', 'namehighlight');
  };
	
  that.passwordActiveInfo = function () {
    toggleInfo('emailInfo', 'emailhighlight', 'nameInfo', 'namehighlight', 'passwordInfo', 'passwordhighlight');
  };

  /* This function will toggle info on 'i' tap */
  function toggleInfo(hideElementOne, hideClassOne, hideElementTwo, hideClassTwo, showElement, showClass) {
    if (that[showElement]() == false) {
      that.aboutEvernym(false);
      that[hideElementOne](false);
      that[hideElementTwo](false);
      that[showElement](true);
      that[hideClassOne]('');
      that[hideClassTwo]('');
      that[showClass]('enable');
    } else {
      that.emailInfo(false);
      that.nameInfo(false);
      that.passwordInfo(false);
      that.emailhighlight('');
      that.namehighlight('');
      that.passwordhighlight('');
    }
    if (that.emailInfo() == false && that.nameInfo() == false && that.passwordInfo() == false) {
      that.aboutEvernym(true);
      that.emailhighlight('');
      that.namehighlight('');
      that.passwordhighlight('');
    }
  }
	
	/* Create Random AccountName Generator */	
  function generateAccount() {
    return {
      emailaddress: that.emailaddress(),
      accountname: that.accountName(),		
      password: that.password()	
    };
  };	
	
  this.nextViewCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    if (that.emailaddress() == '' || !emailReg.test(that.emailaddress())) {
      that.emailClass('validationerror');
      that.errorIconEmail('errorimg');
      that.errorEmail('<span>SORRY:</span> Please enter valid email');
    } else if (that.accountName() == '') {
      that.accountNameClass('validationerror');
      that.errorIconAccountName('errorimg');
      that.errorAccountName('<span>SORRY:</span> Please enter Evernym name');
    } else if (that.password() == '') {
      that.passwordClass('validationerror');
      that.errorIconPassword('errorimg');
      that.errorPassword('<span>SORRY:</span> Please enter password');
    } else {
			$.mobile.showPageLoadingMsg('a', 'Checking Evernym availability');
			return ES.loginService.checkName(that.accountName(), { success: successAvailable, error: errorAPI });
    }
  };
	
	function successAvailable(data){
		if(data){
			that.accountNameClass('validationerror');
      that.errorIconAccountName('errorimg');
      that.errorAccountName('<span>SORRY:</span> This Evernym has already been taken');
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
		that.errorPassword('<span>SORRY:</span> Please enter password');
	};	
	

  function signUpSuccess(args) {
    $.mobile.hidePageLoadingMsg();
		that.loginCommand();
  };

  function signUpError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		if(details.message == 'communication method already used') {
			that.emailClass('validationerror');										
			that.errorIconEmail('errorimg');
			that.errorEmail('<span>SORRY: </span> ' + details.message);
			that.tickIconAccountName('righttick');															
			that.tickIconPassword('righttick');
		}
  };
	
	this.loginCommand = function() {
    $.mobile.showPageLoadingMsg('a', 'Logging In With New Credentials');
    var callbacks = {
      success : loginSuccess,
      error : loginError
    };
    var loginModel = {};
    loginModel.accountname = that.accountName();
    loginModel.password = that.password();
    loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
    ES.loginService.accountLogin(loginModel, callbacks);
	}
	
	function loginSuccess(args) {		
    $.mobile.hidePageLoadingMsg();
    ES.evernymService.clearAccessToken();
		ES.evernymService.setAccessToken(args.accessToken);
		localStorage.setItem('accountName', args.account.accountname);
		localStorage.setItem('newusername', that.accountName());			
		goToView('registrationVerifyView');			
  }

  function loginError(data, status, details) {
    $.mobile.hidePageLoadingMsg();		
		that.errorFirstLastName('<span>SORRY:</span> '+details.message);
    ES.evernymService.clearAccessToken();
  }	    	
				
}