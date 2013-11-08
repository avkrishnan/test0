﻿/*globals ko*/
function LoginViewModel() {
  var that = this;
  this.template = "loginView";
  this.viewid = "V-01";
  this.viewname = "Login";
  this.displayname = "Login";
  this.hasfooter = false;
  this.accountName = ko.observable();	
	
	/* Login view observable */
  this.password = ko.observable();
  this.errorMessage = ko.observable();
  this.usernameClass = ko.observable();
  this.passwordClass = ko.observable();
	
	/* Methods */
  this.applyBindings = function() {
    $("#" + that.template).on("pagebeforeshow", null, function(e, data) {
      if ($.mobile.pageData && $.mobile.pageData.a) {
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }
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
				else {
					that.loginCommand();
				}
			});			
			$(document).keyup(function(e) {
				if (e.keyCode == 13) {
					that.errorMessage('');
					that.loginCommand();
				}
			});
		} 
		else {
			goToView('escalationPlansView');
		}
  };
	
  this.loginCommand = function() {
    if (that.accountName() == '' && that.password() == '') {
      that.usernameClass('validationerror');
      that.passwordClass('validationerror');
      that.errorMessage('<span>SORRY : </span>Please enter username and password');
    } 
		else if(that.accountName() == '') {
      that.usernameClass('validationerror');
      that.errorMessage('<span>SORRY : </span>Please enter username');
    } 
		else if(that.password() == '') {
      that.passwordClass('validationerror');
      that.errorMessage('<span>SORRY : </span>Please enter password');
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
        success : function() {
					//loginSuccess2	
				},
        error : function(data, status, details) {
					//loginError
					that.usernameClass('validationerror');
					that.passwordClass('validationerror');
					that.errorMessage('<span>SORRY : </span> ' + details.message);
					that.password('');
				}
      };
      //channelListViewModel.shown = false;
      var loginModel = {};
      $.mobile.showPageLoadingMsg("a", "Logging In");
      loginModel.accountname = this.accountName();
      loginModel.password = this.password();
      loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
      return ES.loginService.accountLogin(loginModel, callbacks).then(loginSuccess);
    }
  };
	
  this.cleanApplication = function() {
    sendMessageViewModel.clearForm();
    inviteFollowersViewModel.clearForm();
    ES.evernymService.clearAccessToken();
    localStorage.removeItem('login_nav');
    localStorage.removeItem('currentChannel');
    localStorage.removeItem('accountName');
    localStorage.removeItem('name');
    channelListViewModel.clearForm();
    notificationsViewModel.removeNotifications();
    OVERLAY.removeNotifications();
  };

  function loginSuccess(args) {
		//alert(JSON.stringify(args));
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
      localStorage.setItem("accountName", that.accountName());
			if(localStorage.getItem("action") == 'follow_channel') {
				localStorage.removeItem('action');
				goToView('channelMessagesView');
			}
			else {
				goToView('channelListView');
			}
			//ES.channelService.listMyChannels({success: successfulList, error: errorAPI });
    } 
		else {
      //loginError();
			that.errorMessage('<span>SORRY : </span> Unknown Error.');
      return;
    }
  }
	
	function successfulList(data) {
		if(data.channel.length < 1) {
			goToView('channelListView');
		}
		else {
			goToView('channelsIOwnView');
		}
    //$.mobile.hidePageLoadingMsg();
	};    
	
	function errorAPI(data, status, details){
		alert('error');
	};	
}