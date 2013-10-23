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
			
			that.activate();
		});
	};
    
	this.activate = function() {
		var _accountName = localStorage.getItem("accountName");
		var _name = localStorage.getItem("UserFullName");
		
		that.accountName(_accountName);
		that.name(_name);
		that.getCommethods().then(gotCommethods);
	
		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;     
	};

	function requestVerificationError(data, status, details) {
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		showError("Error Requesting Verification: " + details.message);
	}
    
	function requestVerificationSuccess(data){
		$("#chicken").html("Verification Email Sent"); 
	}

	this.verifyCommand = function(commethod){
		//showMessage(JSON.stringify(commethod));
		$.mobile.showPageLoadingMsg("a", "Requesting Verification");
		var callbacks = {
		//success: requestVerificationSuccess,
		success: function (){
				$("#commethod-" + commethod.id).html("Verification Email Sent");
		},
		error: requestVerificationError
		};
		return ES.commethodService.requestVerification( commethod.id, callbacks);
	};
	
	this.verifyCodeCommand = function(commethod) {
	function verificationSuccess(){
			showMessage("Successfully Verified Communication Method");
			that.getCommethods().then(gotCommethods);
	}
	
	function verificationError(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showError("Error in Verification: " + details.message);
		loginPageIfBadLogin(details.code);
	};
					
	function submitVerificationCode(){
		
		var code = $("#verifyCode").find("#verifyCodeCode").val();
		$.mobile.showPageLoadingMsg("a", "Verifying");
		
		var callbacks = {
			success: verificationSuccess,
			error: verificationError
		};
		
		var needsAuthentication = true;
			ES.commethodService.verification(code, callbacks, needsAuthentication).then(closeCodeDialog);
		}
	}
}
