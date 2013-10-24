/*globals ko*/

function TutorialViewModel() {
  var that = this;
  this.template = 'tutorialView';
  this.viewid = 'V-51';
  this.viewname = 'Tutorial';
  this.displayname = 'Tutorials';
  this.hasfooter = false;

  this.applyBindings = function () {
    $('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });
  };

  /* Methods */
  this.activate = function () {
    SwipeSlide('div.tutorialslides', 'swipeleft', 'next');
    SwipeSlide('div.tutorialslides', 'swiperight', 'prev');

    /* This function will swipe tutorial slides */

    function SwipeSlide(Element, Event, functionName) {
      $(Element).on(Event, function () {
        $('header ul li').removeClass('active');
        var slideDiv = $(this)[functionName]('div.tutorialslides').attr('id');
        $(this).hide();
        if (typeof slideDiv == 'undefined') {
          slideDiv = $(this).attr('id');
        }
        $('header ul li#' + slideDiv + 'Active').addClass('active');
        $('#' + slideDiv).show();
      });
    }
  };
  this.loginCommand = function () {
    $.mobile.showPageLoadingMsg('a', 'Logging In With New Credentials');
    var callbacks = {
      success: loginSuccess,
      error: loginError
    };
    var loginModel = {};
    loginModel.accountname = localStorage.getItem('newusername');
    loginModel.password = localStorage.getItem('newuserpassword');
    loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
    ES.loginService.accountLogin(loginModel, callbacks);
  }

  function loginSuccess(args) {
    $.mobile.hidePageLoadingMsg();
    localStorage.removeItem('accessToken');
    if (args.accessToken) {
      localStorage.setItem('accessToken', args.accessToken);
      var notifications = args.notifications;
      localStorage.setItem('accessToken', args.accessToken);
      localStorage.setItem('accountName', args.account.accountname);
      that.first_name = args.account.firstname;
      that.last_name = args.account.lastname;
      localStorage.setItem('UserFullName', args.account.firstname + ' ' + args.account.lastname);
      $.mobile.activePage.find('#thefooter #footer-gear').html(args.account.accountname);
      var login_nav = JSON.parse(localStorage.getItem('login_nav'));
      localStorage.removeItem('login_nav');
      var follow = localStorage.getItem('follow');
      if (follow) {
        //alert('hello, we are going to now go to or follow the channel ' + follow);
        localStorage.removeItem('follow');
      } else if (login_nav) {
        var hash = login_nav.hash;
        //var parameters = login_nav.parameters;				
        $.mobile.changePage(hash);
      } else if (notifications.length) {
        for (var n in notifications) {
          var code = notifications[n].code;
          notificationsViewModel.addNotification(notifications[n].code);
        }
        $.mobile.changePage('#' + notificationsViewModel.template);
      } else {
        $.mobile.changePage('#' + channelListViewModel.template);
      }
    } else {
      loginError();
      return;
    }
  }

  function loginError(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    showError('LOGIN FAILED');
    localStorage.removeItem('accessToken');
  }
  that.getStartedCommand = function () {
    that.loginCommand();
  }
}