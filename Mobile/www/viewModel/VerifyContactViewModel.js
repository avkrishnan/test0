/*globals ko*/
function VerifyContactViewModel() {
	this.template = "verifyContactView";
	this.viewid = "V-081";
	this.viewname = "VerifyContact";
	this.displayname = "Verify Contact";
	this.hasfooter = true;
	
	this.baseUrl = ko.observable();
	this.accountName = ko.observable();	
	this.name = ko.observable();
	
	this.verificationCommethod = ko.observable();
	this.verificationCommethodType = ko.observable();
	this.verificationCommethodID = ko.observable();
	this.verificationCode = ko.observable();
	this.verificationStatus = ko.observable();
	
	this.navText = ko.observable();
	this.pView = '';
	this.errorMessage = ko.observable();
	this.toastText = ko.observable();	
	
	var that = this;
	
	this.gotoView = function() {
		localStorage.removeItem("currentVerificationCommethodID");
		goToView("addContactView");
	}
	
	this.verifyRequestCommethod = function() {
		if(that.verificationCode() == '') {
			that.errorMessage("<span>ERROR: </span> Please input verification code!");
		}
		else if(that.verificationCode().length != 6) {
			that.errorMessage("<span>ERROR: </span> Verification code should be 6 digits!");
		}
		else {
			var verifyCommethodObject = {
				code : that.verificationCode(),
				type : that.verificationCommethodType,
				address : that.verificationCommethod()
			};
			that.verifyRequest(verifyCommethodObject);
		}
	}
	
	this.requestVerificationCode = function() {
		//alert(that.verificationCommethodID());
		var callbacks = {
			success: function(responseData) {
				alert('Verification code sent!');
			},
			error: function (responseData, status, details) {
				alert('error');
			}
		};		
		return ES.commethodService.requestVerification(that.verificationCommethodID(), callbacks);
	}
	
	this.inputKeyUp = function(e) {
		if( e.keyCode != 13 ) {
			//e.preventDefault();
			that.errorMessage('');
		}
		return true;
	}	
  
	this.applyBindings = function(){
		$("#" + that.template).on("pagebeforeshow", null, function (e, data) {
			var currentBaseUrl = localStorage.getItem("baseUrl");
			var previousView = localStorage.getItem('previousView');
			console.log("previousView: " + previousView);
			var vm = ko.dataFor($("#" + previousView).get(0));
			//alert(JSON.stringify(vm));
			console.log("previousView Model viewid: " + vm.displayname);
			that.navText(vm.displayname);
			that.pView = previousView;
			that.activate();
		});
		$('#verifyContactView input').on("keyup", that.inputKeyUp);
	};
    
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}			
			var _accountName = localStorage.getItem("accountName");
			var _name = localStorage.getItem("UserFullName");
			
			that.accountName(_accountName);	
			that.name(_name);
			that.verificationCode('');
			that.errorMessage('');
			that.verificationCommethod(localStorage.getItem("currentVerificationCommethod"));
			that.verificationCommethodID(localStorage.getItem("currentVerificationCommethodID"));
			that.verificationStatus(localStorage.getItem("verificationStatus"));
			if (that.verificationStatus() == 'false') {
				that.verificationStatus(false);
			}
			else {
				that.verificationStatus(true);
			}
			if(localStorage.getItem("currentVerificationCommethodType") == 'EMAIL') {
				that.verificationCommethodType('We have sent you a confirmation message. Verify by clicking on the link (or enter the code below).');
			}
			else {
				that.verificationCommethodType('We have sent you a confirmation message. Verify by entering the code below.');
			}	
			//alert(localStorage.getItem("currentVerificationCommethod"));
			//that.getCommethods().then(gotCommethods);
			
			$.mobile.showPageLoadingMsg("a", "Loading Settings");
			return true;     
		}
	};
	
	$(document).keyup(function(e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'verifyContactView') {
			that.errorMessage('');
			that.verifyRequestCommethod();
		}
	});			
	
	this.menuCommand = function () {
		pushBackNav('Cont. Info', 'verifyContactView', 'channelMenuView');		
  };	

	this.verifyRequest = function(verifyCommethodObject) {
		var callbacks = {
			success: function(responseData) {
				if(localStorage.getItem("currentVerificationCommethodType") == 'EMAIL') {
					that.toastText('Email verified');		
					localStorage.setItem('toastData', that.toastText());
				}
				else {
					that.toastText('Phone number verified');		
					localStorage.setItem('toastData', that.toastText());
				}				
				goToView('addContactView');
			},
			error: function (responseData, status, details) {
				//alert('error');
				that.errorMessage("<span>ERROR: </span>" + details.message);
			}
		};
		return ES.commethodService.verification(verifyCommethodObject.code, callbacks, ES.evernymService.getAccessToken());
	};
	
	this.userSettings = function () {
		pushBackNav('Cont. Info', 'verifyContactView', 'escalationPlansView');
  };		
	
	this.composeCommand = function () {
		pushBackNav('Cont. Info', 'verifyContactView', 'sendMessageView');
  };
		
}
