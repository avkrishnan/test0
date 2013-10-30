/*globals ko*/

function ChannelChangeIconViewModel() {	
  var that = this;
	this.template = 'channelChangeIconView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelChangeIcon';
	this.displayname = 'Channel Chage Icon Image';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Channel Icon Image observable */
	this.picId = ko.observable();
	
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
	}
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelsIOwnView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelChangeIconView');
  };
	
  this.changeChannelIconCommand = function () {
		var channelObject = {
			id: localStorage.getItem('currentChannelId'),
			picId: that.picId()
		};
		$.mobile.showPageLoadingMsg("a", "Modifying Channel ");
		ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
  };
}