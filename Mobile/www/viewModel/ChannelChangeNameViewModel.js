/*globals ko*/

function ChannelChangeNameViewModel() {	
  var that = this;
	this.template = 'channelChangeNameView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelChangeName';
	this.displayname = 'Change Channel Name';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* New Channel Step First observable */
	this.sectionOne = ko.observable(true);
	this.sectionTwo = ko.observable(false);	
	this.channelChangeName = ko.observable('');	
	this.message = ko.observable();	
	this.errorChannel = ko.observable();	
	this.channelWebAddress = ko.observable();				
	
	/* Methods */
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
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
			that.channelChangeName('');		
			$('input').keyup(function () {
				that.message('');
				that.errorChannel('');
			});
		}
	}
	
	this.clearForm = function () {
    that.channelChangeName('');
		that.message('');
		that.errorChannel('');
  };
  this.nextViewCommand = function () {
    if (that.channelChangeName() == '') {
      that.errorChannel('<span>SORRY:</span> Please enter channel name');
    } else {
			that.message('<span>GREAT!</span> This name is available');
			that.sectionOne(false);
			that.sectionTwo(true);
			that.channelWebAddress(that.channelChangeName()+'.evernym.com');	
    }
  };
	
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
		that.activate(channelObject);
    goToView('channelsIOwnView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelChangeNameView');
		that.sectionOne(true);
		that.sectionTwo(false);
		that.message('');
    that.errorChannel('<span>SORRY:</span> '+response.message);		
  };
	
  this.confirmChannelChangeNameCommand = function () {
		var channelObject = {
			id: localStorage.getItem('currentChannelId'),
			name: that.channelChangeName()
		};
		$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
		ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
  };
}