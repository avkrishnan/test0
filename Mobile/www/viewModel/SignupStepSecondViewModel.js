/*globals ko*/

function SignupStepSecondViewModel() {
    
    
    var that = this;
    
    this.template = "signupStepSecondView";
    this.viewid = "V-02b";
    this.viewname = "Register";
    this.displayname = "Register";
    
    this.hasfooter = false;
    this.accountName = ko.observable();
    this.password = ko.observable();
    this.emailaddress = ko.observable();
		this.firstname = ko.observable();
		this.lastname = ko.observable();
		
		this.firstNamehighlight = ko.observable();
		this.lastNamehighlight = ko.observable();
		
		this.firstNameInfo = ko.observable(false);
		this.lastNameInfo = ko.observable(false);
		this.errorFirstLastName = ko.observable();
		this.firstnameClass = ko.observable();
		this.lastnameClass = ko.observable();     
    
		this.applyBindings = function(){				
			$("#" + this.template).on("pagebeforeshow", function(e, data){						
				that.clearForm();
				that.activate();                                    
			});        
		};

		// Methods
		this.activate = function () {
			$('input').keyup(function ( ){
				that.errorFirstLastName('');
				that.firstnameClass('');
				that.lastnameClass('');				
			});
			return true;
		};
		that.firstNameActiveInfo = function() {
			showHideInfo('lastNameInfo', 'lastNamehighlight', 'firstNameInfo', 'firstNamehighlight');	
		}
		that.lastNameActiveInfo = function() {
			showHideInfo('firstNameInfo', 'firstNamehighlight', 'lastNameInfo', 'lastNamehighlight');
		}
		function showHideInfo(hideElement, hideClass,showElement, showClass) {
			if(that[showElement]()==false) {
				that[hideElement](false);			
				that[showElement](true);
				that[hideClass]('');				
				that[showClass]('enable');
			}
			else {			
				that.firstNameInfo(false);
				that.lastNameInfo(false);				
			
				that.firstNamehighlight('');
				that.lastNamehighlight('');
			}			
		}		
		this.clearForm = function(){
			that.accountName('');
			that.password('');
			that.emailaddress('');
			that.firstname('');
			that.lastname('');		
		};

		function generateAccount() {
			return {
				emailaddress: localStorage.getItem("newuseremail"),
				accountname: localStorage.getItem("newusername"), // Create Random AccountName Generator			
				password: localStorage.getItem("newuserpassword"),
				firstname: that.firstname(),
				lastname: that.lastname()		
			};
		};
		this.signUpCommand = function () {
			if(that.firstname() == '' || that.lastname() == '') { 
				if(that.firstname() == '') {
					that.firstnameClass('validationerror');
				}
				if(that.lastname() == '') {
					that.lastnameClass('validationerror');
				}
				that.errorFirstLastName('<span>SORRY:</span>Please enter firstname or lastname');							
			}
			else {	
				$.mobile.showPageLoadingMsg("a", "Enrolling");
				var callbacks = {
					success: signUpSuccess,
					error: signUpError
				};		
				var account = generateAccount();		
				ES.loginService.accountEnroll(account, callbacks);
			}
		};
		this.loginCommand = function () {		
			$.mobile.showPageLoadingMsg("a", "Logging In With New Credentials");
			var callbacks = {
				success: loginSuccess,
				error: loginError
			};		
			var loginModel = {};		
			loginModel.accountname = that.accountName();
			loginModel.password = that.password();
			loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';		
			ES.loginService.accountLogin(loginModel, callbacks);
		}
		function loginSuccess(args) {		
		$.mobile.hidePageLoadingMsg();
		localStorage.removeItem('accessToken');
		if (args.accessToken) {				
				localStorage.setItem("accessToken", args.accessToken);
				var notifications = args.notifications;				
				localStorage.setItem("accessToken", args.accessToken);
				localStorage.setItem("accountName", args.account.accountname);				
				that.first_name = args.account.firstname;
				that.last_name = args.account.lastname;
				localStorage.setItem('UserFullName', args.account.firstname + ' ' + args.account.lastname);
				$.mobile.activePage.find('#thefooter #footer-gear').html(args.account.accountname);
				
				var login_nav = JSON.parse(localStorage.getItem("login_nav"));
				localStorage.removeItem("login_nav");				
				var follow = localStorage.getItem("follow");				
				if (follow){						
					//alert('hello, we are going to now go to or follow the channel ' + follow);
					localStorage.removeItem("follow");
				}
				else if (login_nav){
						var hash = login_nav.hash;
						//var parameters = login_nav.parameters;
						
						$.mobile.changePage(hash);
				}
				else if (notifications.length){
						for (var n in notifications){
								var code = notifications[n].code;
								notificationsViewModel.addNotification(notifications[n].code);
						}
						
						$.mobile.changePage("#" + notificationsViewModel.template);
				}
				else {
						
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
		localStorage.removeItem('accessToken');
		
		//logger.logError('Your login failed, please try again!', null, 'login', true);
}

function signUpSuccess(args) {
		$.mobile.hidePageLoadingMsg();
		$.mobile.changePage('#tutorialView');
		that.loginCommand();		
		localStorage.setItem('flags.signup_complete', 1);
		
		
};

function signUpError(data, status, response) {
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem("signUpError", response.message);
		$.mobile.changePage('#signupStepFirstView',{transition:'none'});
		//logger.logError('signup failed!', null, 'signup', true);
		//showError("Error Registering: " + response.message);
};

}
