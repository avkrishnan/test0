/*globals ko*/

function ChannelEditDisplayNameViewModel() {	
  var that = this;
	this.template = 'channelEditDisplayNameView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelEditDisplayName';
	this.displayname = 'Channel Edit Display Name';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* New Channel Step First observable */
	this.channelEditDisplayName = ko.observable('');	
	this.message = ko.observable();					
	
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
		$('input').keyup(function () {
      that.message('');
    });
	}
	this.clearForm = function () {
    that.newChannel('');
  };
  this.changeChannelDisplayNameCommand = function () {
		that.message('<span>LOOKS GREAT! </span>');
		/*$.mobile.changePage('#channelListView', {
			transition: 'none'
		});*/
  };
}