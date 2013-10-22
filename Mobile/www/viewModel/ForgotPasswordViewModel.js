/*globals ko*/

function ForgotPasswordViewModel() {
	/// <summary>
	/// A view model that represents a single tweet
	/// </summary>

	// --- properties

	var that = this;
	this.template = "forgotPasswordView";
	this.viewid = "V-03";
	this.viewname = "ForgotPassword";
	this.displayname = "Forgot Password";

	this.hasfooter = false;
	this.accountName = ko.observable();

	this.email = ko.observable();
	this.errorForgotPassword = ko.observable();

	this.usernameClass = ko.observable();
	this.emailClass = ko.observable();

	this.notification = ko.observable();

	this.applyBindings = function() {
		$("#" + that.template).on("pagebeforeshow", null, function(e, data) {
			that.clearForm();
			that.activate();
		});

	};

	this.activate = function() {
		that.errorForgotPassword('');
		$('input').keyup(function() {
			that.errorForgotPassword('');
			that.usernameClass('');
			that.emailClass('');
		});
	};

	this.clearForm = function() {
		that.email('');
		that.accountName('');
		that.notification('');
	};

	function gotForgotPassword(data, status, details) {
		that.notification('We have sent you an email with a link to change your password');	
	}

	this.forgotPasswordCommand = function() {

		if (this.accountName() == '' && this.email() == '') {
			that.usernameClass('validationerror');
			that.emailClass('validationerror');
			that.errorForgotPassword('Please enter username or email');
		} else {
			var callbacks = {
				success : forgotPasswordSuccess,
				error : forgotPasswordError
			};

			var forgotPasswordModel = {};
			//$.mobile.showPageLoadingMsg("a", "Sending Email for Fogotten Password");
			forgotPasswordModel.accountname = that.accountName();
			forgotPasswordModel.emailAddress = that.email();

			return ES.loginService.forgotPassword(forgotPasswordModel, callbacks).then(gotForgotPassword);
		}
	};

	function forgotPasswordSuccess(args) {

		$.mobile.hidePageLoadingMsg();

		//logger.log('You successfully logged in!', null, 'login', true);
	}

	function forgotPasswordError(data, status, details) {
		$.mobile.hidePageLoadingMsg();

		//that.notification(details.message);

		loginPageIfBadLogin(details.code);

		if (details) {
			that.usernameClass('validationerror');
			that.emailClass('validationerror');
			that.errorForgotPassword(details.message);
			// showError("Error Sending Forgot Password Request: " + details.message);
		} else {
			// showError("Error Sending Forgot Password Request: " + details.message);
		}

	}

}
