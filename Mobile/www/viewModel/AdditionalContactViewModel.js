/*globals ko*/
function AdditionalContactViewModel() {
	
	this.template = "additionalContactView";
	this.viewid = "V-081";
	this.viewname = "AdditionalContact";
	this.displayname = "Additional Contact";
	this.hasfooter = true;
	
	this.baseUrl = ko.observable();
	this.accountName = ko.observable();
	this.name = ko.observable();

	this.comMethodName = ko.observable();
	
	this.navText = ko.observable();
	this.pView = '';
	this.errorMessage = ko.observable();
	this.errorMessageInput = ko.observable();
	
	var that = this;
		
	that.addCommethod = function() {
		var emailPattern = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
		var phonepatternforhyphen = /^\d+(-\d+)*$/;
		if(that.comMethodName() == '') {
			that.errorMessage("<span>ERROR: </span>Please input email or phone!");
			that.errorMessageInput('validationerror');
		}
		else if(!phonepatternforhyphen.test(that.comMethodName())) { /* for email*/
			if(!emailPattern.test(that.comMethodName())) {
				that.errorMessage("<span>ERROR: </span>Not a valid email address!");
				return false;
			}
			else if(emailPattern.test(that.comMethodName())) {
				var newCommethodObject = {
					name : 'Default name', // TO DO with Timothy
					type : 'EMAIL',
					address : that.comMethodName()
				};
				that.addNewCommethod(newCommethodObject);
			}
		}
		else { // for phone
			if(!phoneNumberPattern.test(that.comMethodName()) || (10 > that.comMethodName().length > 12 )){
				that.errorMessage("<span>ERROR: </span>Not a valid phone number!");
			}
			else if(phoneNumberPattern.test(that.comMethodName())){  
				if(that.comMethodName().match(/^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/)) {
					tempCommethodName = that.comMethodName();
				}
				else if(that.comMethodName().indexOf('-') == 3 || that.comMethodName().indexOf('-') == 6) {
					tempCommethodName = (that.comMethodName().indexOf('-') == 3) ? that.comMethodName().substring(0, 7) + "-" + that.comMethodName().substring(7, that.comMethodName().length) : that.comMethodName().substring(0, 3) + "-" + that.comMethodName().substring(3, that.comMethodName().length);
				}
				else {
					tempCommethodName = that.comMethodName().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
				}
				that.comMethodName(tempCommethodName);
				var newCommethodObject = {
					name : 'Default name', // TO DO with Timothy
					type : 'TEXT',
					address : that.comMethodName()
				};
				that.addNewCommethod(newCommethodObject);				    
			}    
		} 	
	}
	
	this.inputKeyUp = function () {
		that.errorMessage('');
	}	
		
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
		$('#additionalContactView input').on("keyup", that.inputKeyUp);
	};
    
	this.activate = function() {
		that.accountName(localStorage.getItem("accountName"));
		that.name(localStorage.getItem("UserFullName"));
		that.comMethodName('');
		that.errorMessage('');
		localStorage.removeItem("currentVerificationCommethodID");
		$(document).keyup(function(e) {
			if (e.keyCode == 13) {
				that.errorMessage('');
				that.addCommethod();
			}
		});		
		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;     
	};
	
	this.addNewCommethod = function(newCommethodObject) {
		//alert(JSON.stringify(newCommethodObject));
		var callbacks = {
			success: function(responseData) {
				//alert(JSON.stringify(responseData));
				if (responseData.address == 'TEXT') {
					localStorage.setItem("currentVerificationCommethod",responseData.address+'(TXT)');
					localStorage.setItem("currentVerificationCommethodID",responseData.id);
				}
				else {
					localStorage.setItem("currentVerificationCommethod",responseData.address);
					localStorage.setItem("currentVerificationCommethodID",responseData.id);
				}
				localStorage.setItem("verificationStatus",true);
				goToView('verifyContactView');
			},
			error: function (responseData, status, details) {
				that.errorMessage("<span>ERROR : </span>" + details.message);
			}
		};
		ES.commethodService.addCommethod(newCommethodObject, callbacks );
	};
}
