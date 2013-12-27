﻿/*globals ko*/
/* To do - Pradeep Kumar */
function CommethodVerificationViewModel() {
	var that = this;
	this.template = 'commethodVerificationView';
	this.viewid = 'V-??';
	this.viewname = 'ComMethodVerification';
	this.displayname = 'ComMethod Verification';
	this.accountName = ko.observable();
	
	/* Verify commethod observable */	
	this.message = ko.observable();	
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		if(authenticate()) {
			that.accountName(ENYM.ctx.getItem('accountName'));
			$.mobile.showPageLoadingMsg("a", "Verifying");
			var key = (jQuery.mobile.path.get().split('?')[1]).replace('key=','');
			return ES.commethodService.verification(key, { success: successfulVerify, error: errorAPI });
		}
	}
    
	function successfulVerify(data){	
		$.mobile.hidePageLoadingMsg();
		that.message("Successfully verified");
	};    
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		that.message(details.message);	
	};
	
}