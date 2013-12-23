/*globals ko*/
/* To do - Pradeep Kumar */
function AboutEvernymViewModel() {	
  var that = this;
	this.template = 'aboutEvernymView';
	this.viewid = 'V-46';
	this.viewname = 'About Evernym';
	this.displayname = 'About Evernym Channels';	
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