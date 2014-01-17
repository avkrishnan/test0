function AdditionalContactViewModel() {
	var self = this;
	self.template = "additionalContactView";
	self.viewid = "V-081";
	self.viewname = "AdditionalContact";
	self.displayname = "Additional Contact";
	//self.hasfooter = true;

  self.inputObs = [ 'baseUrl', 'comMethodName'/*, 'navText'*/, 'validatedCommethod' ];
	self.errorObs = [ 'errorMessage', 'errorMessageInput'];	
  self.defineObservables();	
		
	//self.pView = '';
	

	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		//var currentBaseUrl = ENYM.ctx.getItem("baseUrl");
		//var previousView = ENYM.ctx.getItem('previousView');
		//var vm = ko.dataFor($("#" + previousView).get(0));
		//self.navText(vm.displayname);
		//self.pView = previousView;
		/*if (currentBaseUrl){
			self.baseUrl(currentBaseUrl);
		} else {
			var es = new EvernymService();
			self.baseUrl(es.getBaseUrl());
		}		
		$('#additionalContactView input').on("keyup", self.inputKeyUp);
		
		self.comMethodName('');
		self.errorMessage('');*/
		$('input').keyup(function () {
			self.clearErrorObs();
		});		
		ENYM.ctx.removeItem("currentVerificationCommethodID");	
		/*$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;*/
	};
/*	
	
	self.inputKeyUp = function () {
		self.errorMessage('');
	}	*/	
	
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
				self.validatedCommethod(phoneObject.text);						
				var newCommethodObject = {
					name : 'Default name', // TO DO with Timothy
					type : 'EMAIL',
					address : self.validatedCommethod()
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
				self.validatedCommethod(emailObject.text);					
				var newCommethodObject = {
					name : 'Default name', // TO DO with Timothy
					type : 'EMAIL',
					address : self.validatedCommethod()
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