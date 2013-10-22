/*globals ko*/

function SignupStepFirstViewModel() {    
	var that = this;        
	
	this.template = "signupStepFirstView";
	this.viewid = "V-02";
	this.viewname = "Register";
	this.displayname = "Register";
	
	this.hasfooter = false;
	this.accountName = ko.observable();
	this.password = ko.observable();
	this.emailaddress = ko.observable();
		
	this.emailhighlight = ko.observable();
	this.emailunhighlight = ko.observable();
	this.namehighlight = ko.observable();
	this.passwordhighlight = ko.observable();
			
	this.aboutEvernym = ko.observable(true);
	this.emailInfo = ko.observable(false);
	this.nameInfo = ko.observable(false);
	this.passwordInfo = ko.observable(false);
	
	this.errorEmail = ko.observable();
	this.errorAccountName = ko.observable();
	this.errorPassword = ko.observable();
	this.errorIconEmail = ko.observable();
	this.errorIconAccoountName = ko.observable();
	this.errorIconPassword = ko.observable();
	
	this.emailClass = ko.observable();
	this.accountNameClass = ko.observable();
	this.passwordClass = ko.observable()
			     
	this.tickIconEmail = ko.observable();
	this.tickIconAccoountName = ko.observable();
	this.tickIconPassword = ko.observable();
	 
	this.applyBindings = function(){        
		$("#" + this.template).on("pagebeforeshow", function(e, data){						
			that.clearForm();
			that.activate();                                    
		});        
	};

	// Methods
	this.activate = function () {
		if(localStorage.getItem("signUpError") != null) {
			that.tickIconEmail('righttick');
			that.emailaddress(localStorage.getItem("newuseremail"));			 
			that.accountNameClass('validationerror');				
			that.errorIconAccoountName('errorimg');
			that.errorAccountName('<span>SORRY:</span>This Evernym has already been taken');
			that.accountName(localStorage.getItem("newusername"));
			that.tickIconPassword('righttick');	
			that.password(localStorage.getItem("newuserpassword"));					
			localStorage.removeItem('signUpError');			
		}	
		$('input').keyup(function ( ){
			that.errorPassword('');
			that.emailClass('');			
			that.accountNameClass('');
			that.passwordClass('');
		});
		return true;
	};
	that.emailActiveInfo = function() {
		toggleInfo('nameInfo', 'namehighlight', 'passwordInfo', 'passwordhighlight', 'emailInfo', 'emailhighlight');	
	}
	that.nameActiveInfo = function() {
		toggleInfo('emailInfo', 'emailhighlight', 'passwordInfo', 'passwordhighlight', 'nameInfo', 'namehighlight');
	}
	that.passwordActiveInfo = function() {
		toggleInfo('emailInfo', 'emailhighlight', 'nameInfo', 'namehighlight', 'passwordInfo', 'passwordhighlight');	
	}
	function toggleInfo(hideElementOne, hideClassOne, hideElementTwo, hideClassTwo, showElement, showClass) {
		if(that[showElement]()==false) {
			that.aboutEvernym(false);
			that[hideElementOne](false);
			that[hideElementTwo](false);
			that[showElement](true);
			that[hideClassOne]('');
			that[hideClassTwo]('');
			that[showClass]('enable');
		}
		else {			
			that.emailInfo(false);
			that.nameInfo(false);
			that.passwordInfo(false);
			that.emailhighlight('');
			that.namehighlight('');
			that.passwordhighlight('');
		}
		if(that.emailInfo() == false && that.nameInfo() == false && that.passwordInfo() == false) {
			that.aboutEvernym(true);			
			that.emailhighlight('');
			that.namehighlight('');
			that.passwordhighlight('');
		}		
	}		
	this.clearForm = function(){
		that.accountName('');
		that.password('');
		that.emailaddress('');		
	};
	this.signUpCommand = function () {	
		if(that.accountName() == '' || that.password() == '' || that.emailaddress() == '' ) {
			that.emailClass('validationerror');				
			that.accountNameClass('validationerror');				
			that.passwordClass('validationerror');				
			that.errorPassword('<span>SORRY:</span>Please provide all details');	
		}
		/*if(that.emailaddress() != '') {
			that.tickIconEmail('righttick');
			//that.errorIconEmail('errorimg');
			//that.errorEmail('<span>SORRY:</span>This Email address has already been taken');
		}
		if(that.accountName() != '') {
			localStorage.setItem("newusername", that.accountName());
			localStorage.setItem("password", that.password());			
			that.accountNameClass('validationerror');				
			that.errorIconAccoountName('errorimg');
			that.errorAccountName('<span>SORRY:</span>This Evernym has already been taken');
		}
		if(that.password() != '') {
			that.tickIconPassword('righttick');
			//that.errorIconPassword('errorimg');
			//that.errorPassword('<span>SORRY:</span>This Password has already been taken');
		}*/
		else {
			localStorage.setItem("newuseremail", that.emailaddress());	
			localStorage.setItem("newusername", that.accountName());
			localStorage.setItem("newuserpassword", that.password());		
			$.mobile.changePage('#signupStepSecondView',{transition:'none'});		
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
		dataService.accountLogin(loginModel, callbacks);
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
		that.loginCommand();
		localStorage.setItem('flags.signup_complete', 1);	
	};
	function signUpError(data, status, response) {
		$.mobile.hidePageLoadingMsg();
		//logger.logError('signup failed!', null, 'signup', true);
		showError("Error Registering: " + response.message);
	};
}
