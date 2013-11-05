/*globals ko*/
function TutorialViewModel() {
  var that = this;
  this.template = 'tutorialView';
  this.viewid = 'V-51';
  this.viewname = 'Tutorial';
  this.displayname = 'Tutorials';
  this.hasfooter = false;

  this.applyBindings = function() {
    $('#' + that.template).on('pagebeforeshow', function(e, data) {
      that.activate();
    });
  };

  /* Methods */
  this.activate = function() {
		var newUser = localStorage.getItem('newusername');
		if(newUser == '' || newUser == null) {
			goToView('channelListView');
		}
		SwipeSlide('div.tutorialslides', 'swipeleft', 'next');
		SwipeSlide('div.tutorialslides', 'swiperight', 'prev');
		navigation('.msg-content span', 'next', 'div.tutorialslides');

		/* This function will swipe tutorial slides */
		function SwipeSlide(Element, Event, functionName) {
			$(Element).on(Event, function() {
				$('header ul li').removeClass('active');
				var swipeView = $(this)[functionName](Element).attr('id');
				$(this).hide();
				if (typeof swipeView == 'undefined') {
					swipeView = $(this).attr('id');
				}
				$('header ul li#' + swipeView + 'Active').addClass('active');
				$('#' + swipeView).show();
			});
		}
		
		/* This function will slide tutorial slides on arrow click */
		function navigation(clickElement, functionName, Element) {
			$(clickElement).on('click',function() {
				$('header ul li').removeClass('active');
				$(Element).hide();
				var slideview = $(this).parent().parent()[functionName]("div "+Element).attr('id');
				if(typeof slideview == 'undefined') {
					slideview = $(this).parent().parent().attr('id');
				}
				$('#'+slideview).show();
				$('header ul li#' + slideview + 'Active').addClass('active');
			});
		}
		$('img').on('dragstart', function(event) {
			event.preventDefault();
		});
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
      if (follow) {
        // alert('hello, we are going to now go to or follow the channel ' +
        // follow);
        localStorage.removeItem('follow');
      } else if (login_nav) {
        var hash = login_nav.hash;
        // var parameters = login_nav.parameters;
        $.mobile.changePage(hash);
      } else if (notifications.length) {
        for ( var n in notifications) {
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
		localStorage.removeItem('newusername');
		localStorage.removeItem('newuserpassword');
  }

  function loginError(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    showError('LOGIN FAILED');
    ES.evernymService.clearAccessToken();
  }
  that.getStartedCommand = function() {
    that.loginCommand();
  }
}