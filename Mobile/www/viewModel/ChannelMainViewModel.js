/*globals ko*/

function ChannelMainViewModel() {	
  var that = this;
	this.template = 'channelMainView';
	this.viewid = 'V-46';
	this.viewname = 'ChannelMain';
	this.displayname = 'Channel Main';	
	this.hasfooter = true;    
	this.channels = ko.observableArray([]);
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Channel Main observable */			
	this.channelId = ko.observable();	
	
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.a) {
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }
      that.activate();
    });	
	};  
	this.activate = function() {
		var _accountName = localStorage.getItem('accountName');
		that.accountName(_accountName);
		that.channelId(localStorage.getItem('currentChannel'));
	}
	this.channelSettings = function(){
		//alert(localStorage.getItem('currentChannel'));
		$.mobile.changePage('#channelSettingsView', {
			transition: 'none'
		});
	};
}