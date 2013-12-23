/*globals ko*/
/* To do - Pradeep Kumar */
function RequestiGiHelpViewModel() {
  var that = this;
  this.template = 'requestiGiHelpView';
  this.viewid = 'V-20b';
  this.viewname = 'iGi Help';
  this.displayname = 'iGi help';
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