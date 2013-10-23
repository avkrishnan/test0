/*globals ko*/

function SignupStepSecondViewModel() {
	var that = this;
	
	this.template = 'signupStepSecondView';
	this.viewid = 'V-02b';
	this.viewname = 'Register';
	this.displayname = 'Register';
	
	this.hasfooter = false;
		
	this.firstname = ko.observable();
	this.lastname = ko.observable();
	
	/* Obeservale for activating information icon */
	this.firstNamehighlight = ko.observable();
	this.lastNamehighlight = ko.observable();
	
	/* Obeservale for toggle information */
	this.firstNameInfo = ko.observable(false);
	this.lastNameInfo = ko.observable(false);
	this.errorFirstLastName = ko.observable();
	this.firstnameClass = ko.observable();
	this.lastnameClass = ko.observable(); 
	
	this.errorIconFirstName = ko.observable();
	this.errorIconLastName = ko.observable();    
	
	this.applyBindings = function(){				
		$('#' + this.template).on('pagebeforeshow', function(e, data){						
			that.clearForm();
			that.activate();                                    
		});        
	};

	// Methods
	this.activate = function () {
		$('input').keyup(function ( ){				
			that.firstnameClass('');
			that.lastnameClass('');
			that.errorFirstLastName('');
			that.errorIconFirstName('');
			that.errorIconLastName('');				
		});
		return true;
	};
	that.firstNameActiveInfo = function() {
		showHideInfo('lastNameInfo', 'lastNamehighlight', 'firstNameInfo', 'firstNamehighlight');	
	}
	that.lastNameActiveInfo = function() {
		showHideInfo('firstNameInfo', 'firstNamehighlight', 'lastNameInfo', 'lastNamehighlight');
	}	
	//this is to toggle info on 'i' tap		
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
		that.firstname('');
		that.lastname('');
		that.errorFirstLastName('');
		that.errorIconFirstName('');
		that.errorIconLastName('');		
	};
	function generateAccount() {
		return {
			emailaddress: localStorage.getItem('newuseremail'),
			accountname: localStorage.getItem('newusername'), // Create Random AccountName Generator			
			password: localStorage.getItem('newuserpassword'),
			firstname: that.firstname(),
			lastname: that.lastname()		
		};
	};
	this.signUpCommand = function () {	
		if(that.firstname() == '') {
			that.firstnameClass('validationerror');
			that.errorIconFirstName('errorimg');			
			that.errorFirstLastName('<span>SORRY:</span>Please enter firstname');
		} else if(that.lastname() == '') {
			that.lastnameClass('validationerror');			
			that.errorIconLastName('errorimg');
			that.errorFirstLastName('<span>SORRY:</span>Please enter lastname');
		} else {	
			$.mobile.showPageLoadingMsg('a', 'Enrolling');
			var callbacks = {
				success: signUpSuccess,
				error: signUpError
			};		
			var account = generateAccount();		
			ES.loginService.accountEnroll(account, callbacks);
		}
	};
	function signUpSuccess(args) {
		$.mobile.hidePageLoadingMsg();
		$.mobile.changePage('#tutorialView');		
	};
	function signUpError(data, status, response) {
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem('signUpError', response.message);
		$.mobile.changePage('#signupStepFirstView',{transition:'none'});
	};
}
