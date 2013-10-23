/*globals ko*/

function LoginViewModel() {
	/// <summary>
	/// A view model that represents a single tweet
	/// </summary>

	// --- properties

  var that = this;
  this.template = "loginView";
  this.viewid = "V-01";
  this.viewname = "Login";
  this.displayname = "Login";
  this.hasfooter = false;
  this.first_name = '';
  this.last_name = '';
  this.accountName = ko.observable();
  this.password = ko.observable();
  this.channelName = ko.observable();
  this.donotfollow = ko.observable();
  this.errorMessage = ko.observable();
  this.usernameClass = ko.observable();
  this.passwordClass = ko.observable();
  var username, password, rememberPassword;
  this.applyBindings = function() {
  	$("#" + that.template).on("pagebeforeshow", null, function(e, data) {		
      if ($.mobile.pageData && $.mobile.pageData.a) {		
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }		
      that.clearForm();		
      that.activate();		
    });
  };
  this.activate = function() {
    that.errorMessage('');
    if (localStorage.getItem("username") == null
        && localStorage.getItem("password") == null) {
      username = '';
      password = '';
    } else {
      username = localStorage.getItem("username");
      password = localStorage.getItem("password");
      $("input[type='checkbox']").attr("checked", true).checkboxradio(
          "refresh");
    }
    that.password(password);
    that.accountName(username);
    $('input').keyup(function() {
      that.errorMessage('');
      that.usernameClass('');
      that.passwordClass('');
    });
    var action = localStorage.getItem("action");
    if (action == 'follow_channel') {
      var channel = JSON.parse(localStorage.getItem("currentChannel"));
      //alert(JSON.stringify(channel));
      if (channel) {
        that.channelName(channel.name);
        //alert('request to follow ' + channel.name);
        $("#login-follow-li").show();
      }
    }
  };
  this.clearForm = function() {
    that.password('');
    that.accountName('');
    $("#login-follow-li").hide();
  };
  this.loginCommand = function() {
    if (that.accountName() == '' && that.password() == '') {
      that.usernameClass('validationerror');
      that.passwordClass('validationerror');
      that.errorMessage('<span>SORRY:</span>Please enter username and password');
    } else if (that.accountName() == '') {
      that.usernameClass('validationerror');
      that.errorMessage('<span>SORRY:</span>Please enter username');
    } else if (that.password() == '') {
      that.passwordClass('validationerror');
      that.errorMessage('<span>SORRY:</span>Please enter password');
    } else {
      rememberPassword = document.getElementById('rememberPassword').checked;
      if (rememberPassword == true) {
        localStorage.setItem("username", that.accountName());
				localStorage.setItem("password", that.password());
				//indended
			}
			var callbacks = {
				success : loginSuccess2,
				error : loginError
			};

			channelListViewModel.shown = false;
			var loginModel = {};
			$.mobile.showPageLoadingMsg("a", "Logging In");
			loginModel.accountname = this.accountName();
			loginModel.password = this.password();
			loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';

			return ES.loginService.accountLogin(loginModel, callbacks).then(
					loginSuccess);
		}
	};

	/* JARED'S CODE REPLACED BY CHAMAN
	this.getAccount = function(){
	    
	    
	    var callbacks = {
	    success: getAccountSuccess,
	    error: loginError
	    };
	    
	    return ES.loginService.getAccount(undefined, callbacks);
	    
	};
	
	
	this.forgotPasswordCommand = function () {
	    
	    
	     $.mobile.changePage("#" + forgotPasswordViewModel.template);
	};
	
	this.showRegistration = function(){
	    
	    $.mobile.changePage("#" + signupViewModel.template);
	    
	};
	*/

	this.logoutCommand = function() {
		var token = localStorage.getItem("accessToken");
		if (token) {
			var callbacks = {
				success : logoutSuccess,
				error : logoutError
			};
			ES.loginService.accountLogout(token, callbacks);
			that.clearForm();
			that.cleanApplication();
		}
	};
	this.cleanApplication = function() {	
		sendMessageViewModel.clearForm();
		inviteFollowersViewModel.clearForm();
		localStorage.removeItem('accessToken');
		localStorage.removeItem('login_nav');
		localStorage.removeItem('currentChannel');
		localStorage.removeItem('accountName');
		localStorage.removeItem('name');
		channelListViewModel.clearForm();
		//notificationsViewModel.removeNotifications();
		OVERLAY.removeNotifications();
	};
	function loginSuccess2(data) {
	}
	function getAccountSuccess(data) {
		that.first_name = data.firstname;
		that.last_name = data.lastname;
		localStorage.setItem('UserFullName', data.firstname + ' '
				+ data.lastname);
		$.mobile.activePage.find('#thefooter #footer-gear').html(
				data.accountname);
	}
	function loginSuccess(args) {
		$.mobile.hidePageLoadingMsg();
		//if (isPhoneGap()) {
			//alert("Running on PhoneGap!");
			//registerPushNotifications();
		//} else {
			//alert("Not running on PhoneGap!");
		//}
		localStorage.removeItem('accessToken');
		if (args.accessToken) {
			localStorage.setItem("accessToken", args.accessToken);
			localStorage.setItem("accountName", that.accountName());
			var notifications = args.notifications;
			that.first_name = args.account.firstname;
			that.last_name = args.account.lastname;
			localStorage.setItem('UserFullName', args.account.firstname + ' '
					+ args.account.lastname);
			$.mobile.activePage.find('#thefooter #footer-gear').html(
					args.account.accountname);
			var channelCount = channelListViewModel.channels().length;
			if (!channelCount) {
				channelListViewModel.populateChannelList();
			}
			var login_nav = JSON.parse(localStorage.getItem("login_nav"));
			localStorage.removeItem("login_nav");
			//notificationsViewModel.removeNotifications();
			OVERLAY.removeNotifications();
			if (login_nav) {
				var hash = login_nav.hash;
				if (hash.indexOf("index.html") !== -1
						|| hash.indexOf("loginView") !== -1) {
					hash = '#channelListView';
				}
				$.mobile.changePage(hash);
			} else {
				$.mobile.changePage("#" + channelListViewModel.template);
			}
			if (notifications && notifications.length) {
				for ( var n in notifications) {

					OVERLAY.addNotification(notifications[n]);
				}
				//$.mobile.changePage("#" + notificationsViewModel.template);
				OVERLAY.show();
			}

		} else {
			loginError();
			return;
		}
		//logger.log('You successfully logged in!', null, 'login', true);
	}

	function loginError(data, status, details) {
		that.usernameClass('validationerror');
		that.passwordClass('validationerror');
		that.errorMessage('<span>SORRY:</span>' + details.message);
		that.password('');
		that.accountName('');
	}

	function logoutSuccess() {
		localStorage.removeItem('accessToken');
		//logger.logError('You successfully logged out!', null, 'login', true);
	}
	function logoutError() {
		//logger.logError('Your log out failed, please try again!', null, 'login', true);
	}
	// --- private functions
	function parseDate(date) {
		/// <summary>
		/// Parses the tweet date to give a more readable format.
		/// </summary>
		var diff = (new Date() - new Date(date)) / 1000;
		if (diff < 60) {
			return diff.toFixed(0) + " seconds ago";
		}
		diff = diff / 60;
		if (diff < 60) {
			return diff.toFixed(0) + " minutes ago";
		}
		diff = diff / 60;
		if (diff < 10) {
			return diff.toFixed(0) + " hours ago";
		}
		diff = diff / 24;
		if (diff.toFixed(0) === 1) {
			return diff.toFixed(0) + " day ago";
		}
		return diff.toFixed(0) + " days ago";
	}
}
