/*globals ko*/

function ChannelNewStepSecondViewModel() {	
  var that = this;
	this.template = 'channelNewStepSecondView';
	this.viewid = 'V-13';
	this.viewname = 'CreateAnotherChannelStepSecond';
	this.displayname = 'Create Channel Step Second';	
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
		var _newChannel = localStorage.getItem('newChannel');
		that.accountName(_accountName);
		that.channelWebAddress(_newChannel+'.evernym.com');
	}
	function successfulCreate(args) {
    $.mobile.hidePageLoadingMsg();
    $.mobile.changePage('#channelsIOwnView');
		localStorage.removeItem('newChannel');
  };

  function errorCreate(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    $.mobile.changePage('#channelNewStepFirstView', {
      transition: 'none'
    });
  };
  this.createChannelCommand = function () {
		$.mobile.showPageLoadingMsg("a", "Creating Channel ");
		ES.channelService.createChannel({name: localStorage.getItem('newChannel')}, {success: successfulCreate, error: errorCreate});
  };
}