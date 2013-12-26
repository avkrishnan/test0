/*globals ko*/
/* To do - Pradeep Kumar */
function HelpViewModel() {	
  var that = this;
	this.template = 'helpView';
	this.viewid = 'V-45';
	this.viewname = 'Help';
	this.displayname = 'Help and FAQs';	
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
			that.accountName(localStorage.getItem('accountName'));			
		}
	}	
	
}