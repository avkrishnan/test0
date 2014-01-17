function AdditionalContactViewModel() {
	var self = this;
	self.template = "additionalContactView";
	self.viewid = "V-081";
	self.viewname = "AdditionalContact";
	self.displayname = "Additional Contact";

  self.inputObs = [ 'baseUrl', 'comMethodName' ];
	self.errorObs = [ 'errorMessage', 'errorMessageInput'];	
  self.defineObservables();		

	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		$('input').keyup(function () {
			self.clearErrorObs();
		});		
		ENYM.ctx.removeItem("currentVerificationCommethodID");	
	};	
	
	$(document).keyup(function(e) {
		if (e.keyCode == 13  && $.mobile.activePage.attr('id') == 'additionalContactView') {
			self.addCommethod();
		}
	});	
		
	self.addCommethod = function() {
		var phoneNumberPattern = /^[0-9\-\s\(\)\+]+$/i;	
		if(self.comMethodName() == '') {
			self.errorMessage("<span>ERROR: </span>Please input email or phone!");
			self.errorMessageInput('validationerror');
		} 
		else if(phoneNumberPattern.test(self.comMethodName())){
			var phoneObject = validateUSAPhone(self.comMethodName());
			if(phoneObject.type == 'Error') {
				self.errorMessage(phoneObject.text);					
				self.errorMessageInput('validationerror');					
				return false;
			} 
			else {
				self.comMethodName(phoneObject.textShow);						
				var newCommethodObject = {
					name : 'Default name', // TO DO with Timothy
					type : 'TEXT',
					address : self.comMethodName()
				};
				self.addNewCommethod(newCommethodObject);
			}
		}
		else {
			var emailObject = validateEmail(self.comMethodName());		
			if(emailObject.type == 'Error') {
				self.errorMessage(emailObject.text);					
				self.errorMessageInput('validationerror');					
				return false;
			} 
			else {					
				var newCommethodObject = {
					name : 'Default name', // TO DO with Timothy
					type : 'EMAIL',
					address : self.comMethodName()
				};
				self.addNewCommethod(newCommethodObject);
			}
		}		
	}			
	
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
		$.mobile.showPageLoadingMsg('a', 'Adding new communication methods');
		ES.commethodService.addCommethod(newCommethodObject, callbacks );
	};
}

AdditionalContactViewModel.prototype = new ENYM.ViewModel();
AdditionalContactViewModel.prototype.constructor = AdditionalContactViewModel;