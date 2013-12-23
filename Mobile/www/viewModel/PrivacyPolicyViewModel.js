/*globals ko*/
/* To do - Pradeep Kumar */
function PrivacyPolicyViewModel() {
  var that = this;
  this.template = 'privacyPolicyView';
  this.viewid = 'V-49';
  this.viewname = 'Privacy Policy';
  this.displayname = 'Privacy Policy';
	this.accountName = ko.observable();	
	
	/* Privacy policy observable */
	this.hasfooter = ko.observable(false);
	this.noheader = ko.observable(false);		
	
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
			that.hasfooter(true);								
		}
	}	
	
}