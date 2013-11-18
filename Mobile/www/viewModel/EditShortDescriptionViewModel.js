/*globals ko*/
/* To do - Pradeep Kumar */
function EditShortDescriptionViewModel() {	
  var that = this;
	this.template = 'editShortDescriptionView';
	this.viewid = 'V-66';
	this.viewname = 'EditShortDescription';
	this.displayname = 'Edit Short Description';	  
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	this.backText = ko.observable();	
	
  /* Edit Channel Display observable */	
	this.channelId = ko.observable();
	this.shortDescription = ko.observable();	
	this.errorMessage = ko.observable(false);	
	this.errorChannel = ko.observable();	
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();			
    });	
	};  
	
	this.clearForm = function () {
    that.shortDescription('');
		that.errorMessage(false);		
		that.errorChannel('');		
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
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));
			that.channelId(channelObject.channelId);
			that.shortDescription(channelObject.channelDescription);						
			$('textarea').keyup(function () {
				that.errorMessage(false);				
				that.errorChannel('');
			});
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13  && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'editShortDescriptionView') {
			that.shortDescriptionCommand();
		}
	});
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Edit Short Description', 'editShortDescriptionView', 'channelMenuView');		
  };	
	
	function successfulModify(args) {
		$.mobile.showPageLoadingMsg('a', 'Loading channel settings');
		ES.channelService.getChannel(that.channelId(), {success: successfulGetChannel, error: errorAPI});
  };
	
	function successfulGetChannel(data) {
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} else {
			var followers = data.followers +' followers';
		}		
		var channel = [];			
		channel.push({
			channelId: data.id, 
			channelName: data.name, 
			channelDescription: data.description,
			followerCount: followers
		});
		channel = channel[0];		
		localStorage.setItem('currentChannelData', JSON.stringify(channel));	
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
    goToView('channelSettingsView');					
	}

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
		that.errorMessage(true);			
		that.errorChannel('<span>SORRY:</span> '+response.message);
  };
	
  this.shortDescriptionCommand = function () {
		if (that.shortDescription() == '' || typeof that.shortDescription() == 'undefined') {
			that.errorMessage(true);			
      that.errorChannel('<span>SORRY:</span> Please enter short description');
    } else {
			var channelObject = {
				id: that.channelId(),
				description: that.shortDescription()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
	
	this.userSettings = function () {
		pushBackNav('Edit Short Description', 'editShortDescriptionView', 'escalationPlansView');		
  };

	this.composeCommand = function () {
		pushBackNav('Edit Short Description', 'editShortDescriptionView', 'sendMessageView');		
  };	
	
}