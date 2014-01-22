function CommethodVerificationViewModel() {
	var self = this;
	self.template = 'commethodVerificationView';
	self.viewid = 'V-??';
	self.viewname = 'ComMethodVerification';
	self.displayname = 'ComMethod Verification';
	
	self.message = ko.observable();	
	
	self.activate = function() {
		$.mobile.showPageLoadingMsg("a", "Verifying");
		var key = (jQuery.mobile.path.get().split('?')[1]).replace('key=','');
		return ES.commethodService.verification(key, { success: successfulVerify, error: errorAPI });
	}
    
	function successfulVerify(data){	
		$.mobile.hidePageLoadingMsg();
		self.message("Successfully verified");
	};    
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		self.message(details.message);	
	};
}

CommethodVerificationViewModel.prototype = new ENYM.ViewModel();
CommethodVerificationViewModel.prototype.constructor = CommethodVerificationViewModel;