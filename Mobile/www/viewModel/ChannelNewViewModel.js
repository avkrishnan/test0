/*globals ko*/
function ChannelNewViewModel() {	
  var that = this;
	this.template = 'channelNewView';
	this.viewid = 'V-13';
	this.viewname = 'CreateNewChannel';
	this.displayname = 'Create a channel';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* New Channel Step First observable */
	this.sectionOne = ko.observable(true);
	this.sectionTwo = ko.observable(false);		
	this.newChannel = ko.observable('');	
	this.message = ko.observable();	
	this.errorNewChannel = ko.observable();
	this.channelWebAddress = ko.observable();					
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			that.newChannel('');
			$('input').keyup(function () {
				that.message('');
				that.errorNewChannel('');
				if(that.newChannel().length > 2) {
					//alert(that.newChannel().length);
				}
			});
			$(document).keyup(function (e) {
				if (e.keyCode == 13) {
					that.nextViewCommand();
				}
			});
		}
	}

	this.nextViewCommand = function () {
    if (that.newChannel() == '') {
      that.errorNewChannel('<span>SORRY:</span> Please enter channel name');
    } else {
			that.message('<span>GREAT!</span> This name is available');
			that.sectionOne(false);
			that.sectionTwo(true);
			that.channelWebAddress(that.newChannel()+'.evernym.com');	
    }
  };
	
	function successfulCreate(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelsIOwnView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelNameView');
		that.sectionOne(true);
		that.sectionTwo(false);
		that.message('');
    that.errorNewChannel('<span>SORRY:</span> ' + response.message);		
  };
	
  this.createChannelCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Creating Channel ');
		ES.channelService.createChannel({name: that.newChannel()}, {success: successfulCreate, error: errorAPI});
  };
}