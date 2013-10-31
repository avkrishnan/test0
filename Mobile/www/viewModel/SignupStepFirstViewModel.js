/*globals ko*/

function SignupStepFirstViewModel() {
  var that = this;
  this.template = 'signupStepFirstView';
  this.viewid = 'V-02';
  this.viewname = 'Register';
  this.displayname = 'Register';
  this.hasfooter = false;
	
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
  this.passwordClass = ko.observable()

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

  this.activate = function () {
    if (localStorage.getItem('signUpError') != null) {
      that.tickIconEmail('righttick');
      that.emailaddress(localStorage.getItem('newuseremail'));
      that.accountNameClass('validationerror');
      that.errorIconAccountName('errorimg');
      that.errorAccountName('<span>SORRY:</span>This Evernym has already been taken');
      that.accountName(localStorage.getItem('newusername'));
      that.tickIconPassword('righttick');
      that.password(localStorage.getItem('newuserpassword'));
      localStorage.removeItem('signUpError');
    }
    $(document).keypress(function (e) {
      if (e.keyCode == 13) {
        that.nextViewCommand();
      }
    });
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
    return true;
  };
	
  that.emailinput = function () {
    that.tickIconEmail('righttick');
  }
	
  that.emailActiveInfo = function () {
    toggleInfo('nameInfo', 'namehighlight', 'passwordInfo', 'passwordhighlight', 'emailInfo', 'emailhighlight');
  }
	
  that.nameActiveInfo = function () {
    toggleInfo('emailInfo', 'emailhighlight', 'passwordInfo', 'passwordhighlight', 'nameInfo', 'namehighlight');
  }
	
  that.passwordActiveInfo = function () {
    toggleInfo('emailInfo', 'emailhighlight', 'nameInfo', 'namehighlight', 'passwordInfo', 'passwordhighlight');
  }

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
	
  this.nextViewCommand = function () {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (that.emailaddress() == '' || !emailReg.test(that.emailaddress())) {
      that.emailClass('validationerror');
      that.errorIconEmail('errorimg');
      that.errorEmail('<span>SORRY:</span>Please enter valid email');
    } else if (that.accountName() == '') {
      that.accountNameClass('validationerror');
      that.errorIconAccountName('errorimg');
      that.errorAccountName('<span>SORRY:</span>Please enter Evernym name');
    } else if (that.password() == '') {
      that.passwordClass('validationerror');
      that.errorIconPassword('errorimg');
      that.errorPassword('<span>SORRY:</span>Please enter password');
    } else {
      localStorage.setItem('newuseremail', that.emailaddress());
      localStorage.setItem('newusername', that.accountName());
      localStorage.setItem('newuserpassword', that.password());
      goToView('signupStepSecondView');
    }
  };
}