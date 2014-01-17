function AddContactViewModel() {
	var self = this;
	self.template = "addContactView";
	self.viewid = "V-081";
	self.viewname = "Cont. Info";
	self.displayname = "Add/Edit Contact";
	self.hasfooter = true;
	
	self.channels = ko.observableArray([]);
	self.commethods = ko.observableArray([]);

  self.inputObs = [ 'baseUrl', 'currentDeleteCommethod', 'verify', 'deletedID', 'navText', 'currentDeleteCommethodID' ];
  self.defineObservables();	
	
	self.showDelete = ko.observable(false);
	self.showConfirm = ko.observable(false);

	self.pView = '';
	
	self.getCommethods = function() {
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
	
	self.gotoVerify = function(data) {
		self.verify(true);
		ENYM.ctx.setItem("currentVerificationCommethod",data.comMethodAddress);
		ENYM.ctx.setItem("commethodType",data.comMethodType);
		ENYM.ctx.setItem("currentVerificationCommethodID",data.comMethodID);
		ENYM.ctx.setItem("verificationStatus",false);
		viewNavigate('Cont. Info', 'addContactView', 'verifyContactView');
	}
	
	self.gotoDelete = function(data) {	
		if(self.verify() == false) {
			self.currentDeleteCommethod(data.comMethodAddress);
			self.currentDeleteCommethodID(data.comMethodID);
			ENYM.ctx.setItem("CommethodType",data.comMethodType);
		}
		self.showDelete(true);
	}
	
	self.gotoView = function() {
		if(self.currentDeleteCommethodID()) {
			self.currentDeleteCommethodID('');						
			goToView('addContactView');
		}
		else {
			self.currentDeleteCommethodID('');						
			goToView('userSettingsView');
		}
	};
	
	self.showConfirmButton = function(data) {
		self.showConfirm(true);
	};
	
	self.confirmDelete = function() {
		var callbacks = {
			success: function(data){
				self.deletedID(self.currentDeleteCommethodID());
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);				
			}
		};	
		ES.commethodService.deleteCommethod(self.currentDeleteCommethodID(), callbacks);
		if(ENYM.ctx.getItem("CommethodType") == 'EMAIL') {
			var toastText = 'Email address deleted';
			ENYM.ctx.removeItem("CommethodType");
		}
		else {
			var toastText = 'Phone number deleted';
			ENYM.ctx.removeItem("CommethodType");			
		}
		var toastobj = {redirect: 'addContactView', type: '', text: toastText};		
		showToast(toastobj);					
		goToView('addContactView');
	}

	self.showCommethods = function(data) {
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
				if(self.deletedID() != valueCommethods.id) {
					self.commethods.push({ comMethodID: valueCommethods.id, comMethodAddress: valueCommethods.address, comMethodClass: tempCommethodClass, comMethodVerify: tempshowVerify, comMethodType: valueCommethods.type, comMethodTypeClass: tempCommethodTypeClass});
				}
			});
		}
	}	
    
	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		
		var currentBaseUrl = ENYM.ctx.getItem("baseUrl");
		var previousView = ENYM.ctx.getItem('previousView');
		console.log("previousView: " + previousView);
		var vm = ko.dataFor($("#" + previousView).get(0));
		console.log("previousView Model viewid: " + vm.displayname);
		self.navText(vm.displayname);
		self.pView = previousView;
		
		if (currentBaseUrl){
			self.baseUrl(currentBaseUrl);
		} else {
			var es = new EvernymService();
			self.baseUrl(es.getBaseUrl());
		}			
		
		self.commethods.removeAll();
		self.showDelete(false);
		self.showConfirm(false);
		self.verify(false);
		ENYM.ctx.removeItem("currentVerificationCommethodID");
		setTimeout(function() {
			$.mobile.showPageLoadingMsg("a", "Loading commmethods.");
			return self.getCommethods().then(self.showCommethods);
		}, 1000);
	};
}

AddContactViewModel.prototype = new ENYM.ViewModel();
AddContactViewModel.prototype.constructor = AddContactViewModel;