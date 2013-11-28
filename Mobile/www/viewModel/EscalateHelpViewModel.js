/*globals ko*/
/* To do - Pradeep Kumar */
function EscalateHelpViewModel() {
  var that = this;
  this.template = 'escalateHelpView';
  this.viewid = 'V-20b';
  this.viewname = 'Escalate Help';
  this.displayname = 'Escalate help';
	this.accountName = ko.observable();	
	
	/* Escalate help observable */
	this.toastText = ko.observable();			
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  

	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');					
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));									
		}
	}		
	
}