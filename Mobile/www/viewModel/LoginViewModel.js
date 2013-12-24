function LoginViewModel() {
  var that = this;
  this.template = "loginView";
  this.viewid = "V-01";
  this.viewname = "Login";
  this.displayname = "Login";	
	
	that.observables = ['accountName', 'password', 'errorMessage', 'usernameClass', 'passwordClass', 'toastText'];
	
	$.each(that.observables, function(i,v) {that[v] = ko.observable();});
	
	/* Methods */
  this.applyBindings = function() {
    $("#" + that.template).on("pagebeforeshow", null, function(e, data) {
			$.each(that.observables, function(i,v) {that[v]('');});		
      that.activate();
    });
  };

  this.activate = function() {
		if(ES.evernymService.getAccessToken() == '' || ES.evernymService.getAccessToken() == null) {		
			that.errorMessage('');		
			if (localStorage.getItem("username") == null && localStorage.getItem("password") == null) {
				that.accountName('');
				that.password('');
			}
			else {
				that.accountName(localStorage.getItem("username"));
				that.password(localStorage.getItem("password"));
				$("input[type='checkbox']").attr("checked", true).checkboxradio("refresh");
			}
			$('#loginView input').keyup(function(e) {
				if(e.keyCode != 13) {
					that.errorMessage('');
					that.usernameClass('');
					that.passwordClass('');
				}
			});
		} 
		else {
			goToView('channelListView');
		}
  };
	
	$(document).keyup(function(e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'loginView') {
			that.errorMessage('');
			that.loginCommand();
		}
	});
	
  this.loginCommand = function() {
    if (that.accountName() == '' && that.password() == '') {
      that.usernameClass('validationerror');
      that.passwordClass('validationerror');
      that.errorMessage('<span>SORRY:</span> Please enter username and password');
    } 
		else if(that.accountName() == '') {
      that.usernameClass('validationerror');
      that.errorMessage('<span>SORRY:</span> Please enter username');
    } 
		else if(that.password() == '') {
      that.passwordClass('validationerror');
      that.errorMessage('<span>SORRY:</span> Please enter password');
    } 
		else {
			that.errorMessage('');
      if ($('input[name="rememberPassword"]:checked').length == 1) {
				localStorage.setItem("username", that.accountName());
        localStorage.setItem("password", that.password());
      }
			else {
				localStorage.removeItem('username');
				localStorage.removeItem('password');
			}
      var callbacks = {
        success : function(responseData) {;},
        error : function(data, status, details) {
					that.usernameClass('validationerror');
					that.passwordClass('validationerror');
					that.errorMessage('<span>SORRY: </span> ' + details.message);
					that.password('');
				}
      };
      var loginModel = {};
      $.mobile.showPageLoadingMsg("a", "Logging In");
      loginModel.accountname = that.accountName();
      loginModel.password = that.password();
      loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
      return ES.loginService.accountLogin(loginModel, callbacks).then(loginSuccess);
    }
  };
	
  this.cleanApplication = function() {
    //sendMessageViewModel.clearForm();
    //inviteFollowersViewModel.clearForm();
    ES.evernymService.clearAccessToken();
    localStorage.removeItem('login_nav');
    localStorage.removeItem('currentChannel');
    localStorage.removeItem('accountName');
    localStorage.removeItem('name');
    localStorage.removeItem('signUpError');
		localStorage.removeItem('newuseremail');
		localStorage.removeItem('newusername');
		localStorage.removeItem('newuserpassword');
    //channelListViewModel.clearForm();
    //notificationsViewModel.removeNotifications();
    //OVERLAY.removeNotifications();
  };

  function loginSuccess(args) {
		var callbacks = {
			success: function() {
			},
			error: function(data, status, details) {
				that.toastText(details.message);		
				showToast();
			}
		};
    $.mobile.hidePageLoadingMsg();
    // if (isPhoneGap()) {
    // alert("Running on PhoneGap!");
    // registerPushNotifications();
    // } else {
    // alert("Not running on PhoneGap!");
    // }
    ES.evernymService.clearAccessToken();
    if (args.accessToken) {
      ES.evernymService.setAccessToken(args.accessToken);
			localStorage.setItem('account', JSON.stringify(args.account));
      localStorage.setItem("accountName", that.accountName());
			if(localStorage.getItem("action") == 'follow_channel') {
				var callbacks = {
					success: function() {
						localStorage.removeItem('action');
						that.toastText('Now following '+channel.name);
						localStorage.setItem('toastData', that.toastText());		
					},
					error: function(data, status, details) {
						localStorage.removeItem('action');					
						channelMessagesViewModel.toastClass('toast-info');
						that.toastText(details.message);		
						localStorage.setItem('toastData', that.toastText());
						goToView('channelMessagesView');
					}
				};						
				var channel = JSON.parse(localStorage.getItem('currentChannel'));
				ES.channelService.followChannel(channel.id, callbacks);
			}
			else {
				goToView('channelListView');
			}
    } 
		else {
			that.errorMessage('<span>SORRY: </span> Unknown Error.');
      return;
    }
  }
}

LoginViewModel.prototype = new AppCtx.ViewModel();
LoginViewModel.prototype.constructor = LoginViewModel;