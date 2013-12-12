/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelNewViewModel() {	
  var that = this;
	this.template = 'channelNewView';
	this.viewid = 'V-13';
	this.viewname = 'New Chan';
	this.displayname = 'Create a channel';	
	this.accountName = ko.observable();	
	
  /* New Channel Step First observable */
	this.sectionOne = ko.observable(true);
	this.sectionTwo = ko.observable(false);		
	this.newChannel = ko.observable('');	
	this.channelClass = ko.observable();	
	this.message = ko.observable();	
	this.errorNewChannel = ko.observable();
	this.channelWebAddress = ko.observable();
	this.toastText = ko.observable();								
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();					
    });	
	};
	
	this.clearForm = function () {
		that.newChannel('');
		that.channelClass('');		
		that.message('');
		that.errorNewChannel('');			
  };
	  
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}			
			that.accountName(localStorage.getItem('accountName'));
			that.sectionOne(true);
			that.sectionTwo(false);							
			$('input').keyup(function () {
				that.message('');
				that.channelClass('');				
				that.errorNewChannel('');
			});							
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'channelNewView') {
			that.nextViewCommand();
		}
	});	

	this.nextViewCommand = function (e) {
    if (that.newChannel() == '') {
      that.errorNewChannel('<span>SORRY:</span> Please enter channel name');
    } else if (that.newChannel().match(/\s/)) {
			that.errorNewChannel('<span>SORRY:</span> Please choose a short name with no spaces');
		} else {
			$.mobile.showPageLoadingMsg('a', 'Checking channel name availability');
			ES.loginService.checkName(that.newChannel(), { success: successAvailable, error: errorAPI });			
    }
  };
	
	function successfulCreate(args) {
    $.mobile.hidePageLoadingMsg()			
		that.toastText('Channel created');		
		localStorage.setItem('toastData', that.toastText());
		sendMessageViewModel.clearForm();				
    goToView('channelsIOwnView');
  };
	
	function successAvailable(data){
		if(data){
			that.channelClass('validationerror');
      that.errorNewChannel('<span>SORRY:</span> This channel name has already been taken');
		} else {
			//that.message('<span>GREAT! </span> This name is available');
			that.sectionOne(false);
			that.sectionTwo(true);							
			that.channelWebAddress(that.newChannel()+'.evernym.com');			
		}
	};
						
  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelNameView');
		that.sectionOne(true);
		that.sectionTwo(false);
		that.message('');
    that.errorNewChannel('<span>SORRY:</span> ' + details.message);		
  };
	
  this.createChannelCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Creating Channel ');
		ES.channelService.createChannel({name: that.newChannel()}, {success: successfulCreate, error: errorAPI});
  };		
	
}