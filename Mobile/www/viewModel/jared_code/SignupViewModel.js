/*globals ko*/

function SignupViewModel() {

  var that = this;

  this.template = "signupView";
  this.viewid = "V-02";
  this.viewname = "Register";
  this.displayname = "Register";

  this.hasfooter = false;
  this.accountName = ko.observable();
  this.password = ko.observable();
  this.emailaddress = ko.observable();
  this.firstname = ko.observable();
  this.lastname = ko.observable();

  this.applyBindings = function() {

    $("#" + this.template).on("pagebeforeshow", null, function(e, data) {

      that.clearForm();
      that.activate();

      if ($.mobile.pageData && $.mobile.pageData.email) {

        that.emailaddress($.mobile.pageData.email);
      }

      if ($.mobile.pageData && $.mobile.pageData.follow) {

        // localStorage.setItem("follow",
        // JSON.stringify($.mobile.pageData.follow));

      }

    });

  };

  // Methods
  this.activate = function() {
    return true;
  };

  this.clearForm = function() {
    that.accountName('');
    that.password('');
    that.emailaddress('');
    that.firstname('');
    that.lastname('');
  };

  function generateAccount() {
    return {
      accountname : that.accountName(), // Create Random AccountName Generator
      emailaddress : that.emailaddress(),
      password : that.password(),
      firstname : that.firstname(),
      lastname : that.lastname()
    };
  }
  ;

  this.signUpCommand = function() {

    $.mobile.showPageLoadingMsg("a", "Enrolling");
    var callbacks = {
      success : signUpSuccess,
      error : signUpError
    };

    var account = generateAccount();
    ES.loginService.accountEnroll(account, callbacks);
  };

  this.loginCommand = function() {

    $.mobile.showPageLoadingMsg("a", "Logging In With New Credentials");
    var callbacks = {
      success : loginSuccess,
      error : loginError
    };

    var loginModel = {};

    loginModel.accountname = that.accountName();
    loginModel.password = that.password();
    loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';

    ES.loginService.accountLogin(loginModel, callbacks);
  };

  function loginSuccess(args) {

    $.mobile.hidePageLoadingMsg();
    ES.evernymService.clearAccessToken();
    if (args.accessToken) {

      var notifications = args.notifications;

      ES.evernymService.setAccessToken(args.accessToken);

      localStorage.setItem("accountName", args.account.accountname);

      that.first_name = args.account.firstname;
      that.last_name = args.account.lastname;
      localStorage.setItem('UserFullName', args.account.firstname + ' '
          + args.account.lastname);
      $.mobile.activePage.find('#thefooter #footer-gear').html(
          args.account.accountname);

      var login_nav = JSON.parse(localStorage.getItem("login_nav"));
      localStorage.removeItem("login_nav");

      var follow = localStorage.getItem("follow");

      if (follow) {

        // alert('hello, we are going to now go to or follow the channel ' +
        // follow);
        localStorage.removeItem("follow");
      } else if (login_nav) {
        var hash = login_nav.hash;
        // var parameters = login_nav.parameters;

        $.mobile.changePage(hash);
      } else if (notifications.length) {
        for ( var n in notifications) {
          var code = notifications[n].code;
          notificationsViewModel.addNotification(notifications[n].code);
        }

        $.mobile.changePage("#" + notificationsViewModel.template);
      } else {

        $.mobile.changePage("#" + channelListViewModel.template);
      }

    } else {
      loginError();
      return;
    }

  }

  function loginError(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    showError("LOGIN FAILED");
    ES.evernymService.clearAccessToken();

    // logger.logError('Your login failed, please try again!', null, 'login',
    // true);
  }

  function signUpSuccess(args) {
    $.mobile.hidePageLoadingMsg();
    that.loginCommand();
    localStorage.setItem('flags.signup_complete', 1);

  }
  ;

  function signUpError(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    // logger.logError('signup failed!', null, 'signup', true);
    showError("Error Registering: " + response.message);
  }
  ;

}
