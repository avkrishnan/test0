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
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);			
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
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);				
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
	};
	
	this.showConfirmButton = function(data) {
		that.showConfirm(true);
	};
	
	this.confirmDelete = function() {
		var callbacks = {
			success: function(data){
				that.deletedID(that.currentDeleteCommethodID());
				//alert(that.deletedID());
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);				
			}
		};	
		ES.commethodService.deleteCommethod(that.currentDeleteCommethodID(), callbacks);
		if(localStorage.getItem("CommethodType") == 'EMAIL') {
			var toastText = 'Email address deleted';
			localStorage.removeItem("CommethodType");
		}
		else {
			var toastText = 'Phone number deleted';
			localStorage.removeItem("CommethodType");			
		}
		var toastobj = {redirect: 'addContactView', type: '', text: toastText};		
		showToast(toastobj);					
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
		if(authenticate()) {
			addExternalMarkup(that.template); // this is for header/overlay message
			that.accountName(localStorage.getItem("accountName"));
			that.name(localStorage.getItem("UserFullName"));
			that.commethods.removeAll();
			that.showDelete(false);
			that.showConfirm(false);
			that.verify(false);
			localStorage.removeItem("currentVerificationCommethodID");
			setTimeout(function() {
				$.mobile.showPageLoadingMsg("a", "Loading commmethods.");
				return that.getCommethods().then(that.showCommethods);
			}, 1000);
			//return that.getCommethods().then(that.showCommethods);
		}
	};
}