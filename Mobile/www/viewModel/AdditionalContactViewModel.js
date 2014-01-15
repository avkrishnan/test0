function AdditionalContactViewModel() {
	var self = this;
	self.template = "additionalContactView";
	self.viewid = "V-081";
	self.viewname = "AdditionalContact";
	self.displayname = "Additional Contact";
	self.hasfooter = true;

  self.inputObs = [ 'baseUrl', 'comMethodName', 'navText', 'errorMessage', 'errorMessageInput' ];
  self.defineObservables();	
		
	self.pView = '';
		
	self.addCommethod = function() {
		var emailPattern = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
		var phoneNumberPatternPlus = /^\+?[0-9]{0,15}$/;
		var phonepatternforhyphen = /^\d+(-\d+)*$/;
		var phoneHypenPlus = /(?:\(?\+\d{2}\)?\s*)?\d+(?:[ -]*\d+)*$/;
		if(self.comMethodName() == '') {
			self.errorMessage("<span>ERROR: </span>Please input email or phone!");
			self.errorMessageInput('validationerror');
		} else if((!phoneNumberPatternPlus.test(self.comMethodName())) && (!phonepatternforhyphen.test(self.comMethodName()) && !phoneHypenPlus.test(self.comMethodName()))) { /* for email*/
			if(!emailPattern.test(self.comMethodName())) {
				self.errorMessage("<span>ERROR: </span>Not a valid email address!");
				return false;
			} else if(emailPattern.test(self.comMethodName())) {
				var newCommethodObject = {
					name : 'Default name', // TO DO with Timothy
					type : 'EMAIL',
					address : self.comMethodName()
				};
				self.addNewCommethod(newCommethodObject);
			}
		} else { // for phone
			if((!phoneNumberPattern.test(self.comMethodName()) || !phoneNumberPatternPlus.test(self.comMethodName())) && 10 > self.comMethodName().length > 15){
				self.errorMessage("<span>ERROR: </span>Not a valid phone number!");
			} else if(phoneNumberPattern.test(self.comMethodName()) || phoneNumberPatternPlus.test(self.comMethodName())){  
				if(self.comMethodName().match(/^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/)) {
					tempCommethodName = self.comMethodName();
				} else if(self.comMethodName().indexOf('-') == 3 || self.comMethodName().indexOf('-') == 6) {
					tempCommethodName = (self.comMethodName().indexOf('-') == 3) ? self.comMethodName().substring(0, 7) + "-" + self.comMethodName().substring(7, self.comMethodName().length) : self.comMethodName().substring(0, 3) + "-" + self.comMethodName().substring(3, self.comMethodName().length);
				}else if((self.comMethodName().charAt(0)) == '+') {
					tempCommethodName = self.comMethodName().replace(/(.{2})(.{3})(.{3})/,'$1-$2-$3-');
				}
				else {
					tempCommethodName = self.comMethodName().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
				}
				self.comMethodName(tempCommethodName);
				var newCommethodObject = {
					name : 'Default name', // TO DO with Timothy
					type : 'TEXT',
					address : self.comMethodName()
				};
				self.addNewCommethod(newCommethodObject);				    
			}
		}
	}
	
	self.inputKeyUp = function () {
		self.errorMessage('');
	}	

	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		var currentBaseUrl = ENYM.ctx.getItem("baseUrl");
		var previousView = ENYM.ctx.getItem('previousView');
		var vm = ko.dataFor($("#" + previousView).get(0));
		self.navText(vm.displayname);
		self.pView = previousView;
		if (currentBaseUrl){
			self.baseUrl(currentBaseUrl);
		} else {
			var es = new EvernymService();
			self.baseUrl(es.getBaseUrl());
		}		
		$('#additionalContactView input').on("keyup", self.inputKeyUp);
		
		self.comMethodName('');
		self.errorMessage('');
		ENYM.ctx.removeItem("currentVerificationCommethodID");	
		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;
	};
	
	$(document).keyup(function(e) {
		if (e.keyCode == 13  && $.mobile.activePage.attr('id') == 'additionalContactView') {
			self.errorMessage('');
			self.addCommethod();
		}
	});				
	
	self.addNewCommethod = function(newCommethodObject) {
		var callbacks = {
			success: function(responseData) {
				ENYM.ctx.setItem("commethodType",responseData.type);
				if (responseData.address == 'TEXT') {
					ENYM.ctx.setItem("currentVerificationCommethod",responseData.address+'(TXT)');
					ENYM.ctx.setItem("currentVerificationCommethodID",responseData.id);
				} else {
					ENYM.ctx.setItem("currentVerificationCommethod",responseData.address);
					ENYM.ctx.setItem("currentVerificationCommethodID",responseData.id);
				}
				ENYM.ctx.setItem("verificationStatus",true);
				var toastobj = {redirect: 'verifyContactView', type: '', text: 'Verification message sent'};		
				showToast(toastobj);
				goToView('verifyContactView');
			},
			error: function (responseData, status, details) {
				self.errorMessage("<span>ERROR: </span>" + details.message);
			}
		};
		ES.commethodService.addCommethod(newCommethodObject, callbacks );
	};
}

AdditionalContactViewModel.prototype = new ENYM.ViewModel();
AdditionalContactViewModel.prototype.constructor = AdditionalContactViewModel;