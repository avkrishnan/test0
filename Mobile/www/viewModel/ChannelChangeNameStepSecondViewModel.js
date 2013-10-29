/*globals ko*/

function ChannelChangeNameStepSecondViewModel() {	
  var that = this;
	this.template = 'channelChangeNameStepSecondView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelChangeNameStepSecond';
	this.displayname = 'Channel Change Name Step Second';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* New channel Step Second observable */
	this.channelWebAddress = ko.observable();				
	
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
		var _ChannelChangeName = localStorage.getItem('channelChangeName');
		that.accountName(_accountName);
		that.channelWebAddress(_ChannelChangeName+'.evernym.com');
	}
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
		var channelObject = {
			id: that.channelid(),
			name: that.editChannelName(),
			description: that.editChannelDescription()
		};
		that.activate(channelObject);
		//TODO - just change the one object inside of the list of channels instead of calling to get all the channels again.
		channelListViewModel.refreshChannelList();
    $.mobile.changePage('#channelsIOwnView');
		localStorage.removeItem('channelChangeName');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    $.mobile.changePage('#channelChangeNameStepFirstView', {
      transition: 'none'
    });
  };
	
	this.editChannelNameCommand = function () {
    
		return ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
  };
  this.confirmChannelChangeNameCommand = function () {
		var channelObject = {
			id: '85558a6c-ff1f-42cf-b972-4ec5ed9a5175',
			name: localStorage.getItem('channelChangeName'),
		};
		$.mobile.showPageLoadingMsg("a", "Modifying Channel ");
		ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
  };
}