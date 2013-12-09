/*globals ko*/
function AddContactViewModel() {
	
	this.template = "addContactView";
	this.viewid = "V-081";
	this.viewname = "Cont. Info";
	this.displayname = "Add/Edit Contact";
	this.hasfooter = true;
	
	this.channels = ko.observableArray([]);
	this.commethods = ko.observableArray([]);
	this.baseUrl = ko.observable();
	this.accountName = ko.observable();	
	this.name = ko.observable();
	
	this.currentDeleteCommethodID = ko.observable();
	this.showDelete = ko.observable(false);
	this.showConfirm = ko.observable(false);
	this.currentDeleteCommethod = ko.observable();
	this.verify = ko.observable();
	this.toastText = ko.observable();	
	this.deletedID = ko.observable('');
	
	this.navText = ko.observable();
	this.pView = '';
	
	var that = this;

	this.applyBindings = function(){
		$("#" + that.template).on("pagebeforeshow", null, function (e, data) {
			var currentBaseUrl = localStorage.getItem("baseUrl");
			var previousView = localStorage.getItem('previousView');
			console.log("previousView: " + previousView);
			var vm = ko.dataFor($("#" + previousView).get(0));
			console.log("previousView Model viewid: " + vm.displayname);
			that.navText(vm.displayname);
			that.pView = previousView;
			
			if (currentBaseUrl){
				that.baseUrl(currentBaseUrl);
			}
			else {
				var es = new EvernymService();
				that.baseUrl(es.getBaseUrl());
			}
			that.activate();
		});
	};
	
	this.getCommethods = function() {
		var callbacks = {
			success: function(data){
				//alert('succ');
			},
			error: function(data, status, details) {
				that.toastText(details.message);		
				localStorage.setItem('toastData', that.toastText());				
			}
		};		
		return ES.commethodService.getCommethods(callbacks);
	}
	
	this.gotoVerify = function(data) {
		that.verify(true);
		var callbacks = {
			success: function(responseData) {
				//alert('Verification code sent!');
			},
			error: function (responseData, status, details) {
				that.toastText(details.message);		
				localStorage.setItem('toastData', that.toastText());				
			}
		};		
		localStorage.setItem("currentVerificationCommethod",data.comMethodAddress);
		localStorage.setItem("currentVerificationCommethodType",data.comMethodType);
		localStorage.setItem("currentVerificationCommethodID",data.comMethodID);
		localStorage.setItem("verificationStatus",false);
		ES.commethodService.requestVerification(data.comMethodID, callbacks);
		viewNavigate('Cont. Info', 'addContactView', 'verifyContactView');		
	}
	
	this.gotoDelete = function(data) {	
		if(that.verify() == false) {
			that.currentDeleteCommethod(data.comMethodAddress);
			that.currentDeleteCommethodID(data.comMethodID);
			localStorage.setItem("CommethodType",data.comMethodType);
		}
		that.showDelete(true);
		//alert(headerViewModel.backText());
	}
	
	this.gotoView = function() {
		if(that.currentDeleteCommethodID()) {
			that.currentDeleteCommethodID('');						
			goToView('addContactView');
		}
		else {
			that.currentDeleteCommethodID('');						
			goToView('escalationPlansView');
		}
	}
	
	this.showConfirmButton = function(data) {
		that.showConfirm(true);
	}
	
	this.confirmDelete = function() {
		var callbacks = {
			success: function(data){
				that.deletedID(that.currentDeleteCommethodID());
			},
			error: function(data, status, details) {
				that.toastText(details.message);		
				localStorage.setItem('toastData', that.toastText());				
			}
		};	
		ES.commethodService.deleteCommethod(that.currentDeleteCommethodID(), callbacks);
		if(localStorage.getItem("CommethodType") == 'EMAIL') {
			that.toastText('Email address deleted');		
			localStorage.setItem('toastData', that.toastText());
			localStorage.removeItem("CommethodType");			
		}
		else {
			that.toastText('Phone number deleted');
			localStorage.setItem('toastData', that.toastText());
			localStorage.removeItem("CommethodType");			
		}				
		goToView('addContactView');
	}

	this.showCommethods = function(data) {
		if(data.commethod.length > 0) {
			var tempCommethodClass = '', tempshowVerify = false;
			$.each(data.commethod, function(indexCommethods, valueCommethods) {
				if (valueCommethods.verified == "N") {
					tempCommethodClass = "notverify";
					tempshowVerify = true;
				}
				else {
					tempCommethodClass = "notverify";
					tempshowVerify = false;
				}
				if(valueCommethods.type == "EMAIL") {
					tempCommethodTypeClass = "emailicon";
				}
				else {
					tempCommethodTypeClass = "texticon";	
				}
				if(that.deletedID() != valueCommethods.id) {
					that.commethods.push({ comMethodID: valueCommethods.id, comMethodAddress: valueCommethods.address, comMethodClass: tempCommethodClass, comMethodVerify: tempshowVerify, comMethodType: valueCommethods.type, comMethodTypeClass: tempCommethodTypeClass});
				}
			});
		}
	}	
    
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} 
		else {
			addExternalMarkup(that.template); // this is for header/overlay message
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}				
			var _accountName = localStorage.getItem("accountName");
			var _name = localStorage.getItem("UserFullName");
			that.accountName(_accountName);
			that.name(_name);
			that.commethods.removeAll();
			that.showDelete(false);
			that.showConfirm(false);
			that.verify(false);
			localStorage.removeItem("currentVerificationCommethodID");
			$.mobile.showPageLoadingMsg("a", "Loading Settings");
			return that.getCommethods().then(that.showCommethods);
		}
	};
}
