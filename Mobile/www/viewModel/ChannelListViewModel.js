/* To do - Pradeep Kumar */
function ChannelListViewModel() {
  var that = this;
  this.template = 'channelListView';
  this.viewid = 'V-40';
  this.viewname = 'Home';
  this.displayname = 'Home';
  this.accountName = ko.observable();
	this.responseData = ko.observable();												
	
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
			localStorage.setItem('counter', 0);
		}
	}
}