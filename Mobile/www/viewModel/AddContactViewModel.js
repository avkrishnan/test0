/*globals ko*/
function AddContactViewModel() {
	
	this.template = "addContactView";
	this.viewid = "V-081";
	this.viewname = "AddEditContact";
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
			success: function(){
				//alert('succ');
			},
			error: function() {
				alert('error');
			}
		};		
		return ES.commethodService.getCommethods(callbacks);
	}
	
	this.gotoVerify = function(data) {
		var callbacks = {
			success: function(responseData) {
				//alert('Verification code sent!');
			},
			error: function (responseData, status, details) {
				alert('error');
			}
		};		
		localStorage.setItem("currentVerificationCommethod",data.comMethodAddress);
		localStorage.setItem("currentVerificationCommethodType",data.comMethodType);
		localStorage.setItem("currentVerificationCommethodID",data.comMethodID);
		localStorage.setItem("verificationStatus",false);
		//alert(that.commethods.removeAll());
		ES.commethodService.requestVerification(data.comMethodID, callbacks);
		goToView('verifyContactView');
	}
	
	this.gotoDelete = function(data) {
		//alert(that.showDelete());
		//alert(JSON.stringify(data));
		//alert(that.currentDeleteCommethodID());
		that.currentDeleteCommethod(data.comMethodAddress);
		that.currentDeleteCommethodID(data.comMethodID);
		//alert(that.currentDeleteCommethodID());
		that.showDelete(true);
	}
	
	this.showConfirmButton = function(data) {
		that.showConfirm(true);
	}
	
	this.confirmDelete = function() {
		//alert(that.currentDeleteCommethodID());
		var callbacks = {
			success: function(){
				//alert('success');
			},
			error: function() {
				alert('error');
			}
		};
		//that.commethods.remove(that.currentDeleteCommethodID());		
		ES.commethodService.deleteCommethod(that.currentDeleteCommethodID(), callbacks);
		goToView('addContactView');
	}

	this.showCommethods = function(data) {
		//alert(that.currentDeleteCommethodID());
		if(data.commethod.length > 0) {
			var tempCommethodClass = '', tempshowVerify = false;
			$.each(data.commethod, function(indexCommethods, valueCommethods) {
				//alert(JSON.stringify(valueCommethods));
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
				if(that.currentDeleteCommethodID() != valueCommethods.id) {
					that.commethods.push({ comMethodID: valueCommethods.id, comMethodAddress: valueCommethods.address, comMethodClass: tempCommethodClass, comMethodVerify: tempshowVerify, comMethodType: valueCommethods.type, comMethodTypeClass: tempCommethodTypeClass});
				}
			});
		}
	}	
    
	this.activate = function() {
		var _accountName = localStorage.getItem("accountName");
		var _name = localStorage.getItem("UserFullName");
		
		that.accountName(_accountName);
		that.name(_name);
		that.commethods.removeAll();
		that.showDelete(false);
		that.showConfirm(false);
		localStorage.removeItem("currentVerificationCommethodID");
		that.currentDeleteCommethodID('');
		//alert(localStorage.getItem('currentEscPlan'));
		//alert(JSON.stringify(localStorage.getItem('allEscPlans')));
		//$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return that.getCommethods().then(that.showCommethods);
		//return true;     
	};
}
