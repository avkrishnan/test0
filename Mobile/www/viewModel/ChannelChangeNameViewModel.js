/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelChangeNameViewModel() {	
  var that = this;
	this.template = 'channelChangeNameView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelChangeName';
	this.displayname = 'Change Channel Name';	
	this.accountName = ko.observable();	
	
  /* Channel changet name observable */
	this.sectionOne = ko.observable(true);
	this.sectionTwo = ko.observable(false);
	this.channelId = ko.observable();		
	this.channelChangeName = ko.observable('');
	this.channelClass = ko.observable();		
	this.message = ko.observable();	
	this.errorChannel = ko.observable();	
	this.channelWebAddress = ko.observable();
	this.backText = ko.observable();
	this.backNav = ko.observable();							
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();      
			that.activate();			
    });	
	};
	
	this.clearForm = function () {
    that.channelChangeName('');
		that.channelClass('');			
		that.message('');
		that.errorChannel('');
    that.backNav('');		
  };
	  
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			that.accountName(localStorage.getItem('accountName'));		
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));
			that.channelId(channelObject.channelId);	
			that.channelChangeName(channelObject.channelName);						
			$('input').keyup(function () {
				that.message('');
				that.errorChannel('');
			});
			that.backText('<em></em>Settings');			
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'channelChangeNameView') {
			that.nextViewCommand();
		}
	});
	
	this.goToBack = function() {
		if(that.backNav() == 'channelChangeNameView') {			
			that.sectionOne(true)
			that.sectionTwo(false);
			that.backText('<em></em>Settings');
			that.backNav('');																	
		}
		else {
			goToView('channelSettingsView');
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Step 1', 'channelChangeNameView', 'channelMenuView');		
  };		
	
  this.nextViewCommand = function () {
    if (that.channelChangeName() == '') {
      that.errorChannel('<span>SORRY:</span> Please enter channel name');
		} else if (that.channelChangeName().match(/\s/)) {
			 that.errorChannel('<span>SORRY:</span> Please choose a short name with no spaces');
    } else {
			$.mobile.showPageLoadingMsg('a', 'Checking channel name availability');
			ES.loginService.checkName(that.channelChangeName(), { success: successAvailable, error: errorAPI });					
    }
  };
	
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelSettingsView');
  };
	
	function successAvailable(data){
		if(data){
			that.channelClass('validationerror');
      that.errorChannel('<span>SORRY:</span> This channel name has already been taken');
		} else {
			//that.message('<span>GREAT! </span> This name is available');
			that.sectionOne(false);
			that.sectionTwo(true);
			that.backText('<em></em>Step 1');
			that.backNav('channelChangeNameView');				
			that.channelWebAddress(that.channelChangeName()+'.evernym.com');				
		}
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
			id: that.channelId(),
			name: that.channelChangeName()
		};
		$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
		ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
	}
	
	this.userSettings = function () {
		pushBackNav('Step 1', 'channelChangeNameView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Step 1', 'channelChangeNameView', 'sendMessageView');
  };	
	
}