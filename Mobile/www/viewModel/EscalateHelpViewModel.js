/*globals ko*/
/* To do - Pradeep Kumar */
function EscalateHelpViewModel() {
  var that = this;
  this.template = 'escalateHelpView';
  this.viewid = 'V-20b';
  this.viewname = 'Escalate Help';
  this.displayname = 'Escalate help';
	this.accountName = ko.observable();			
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  

	this.activate = function() {
		if(authenticate()) {
			addExternalMarkup(that.template); // this is for header/overlay message						
			that.accountName(appCtx.getItem('accountName'));									
		}
	}		
	
}