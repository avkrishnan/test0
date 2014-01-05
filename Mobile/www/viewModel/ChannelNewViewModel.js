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
	this.newChannel = ko.observable();	
	this.channelClass = ko.observable();	
	this.message = ko.observable();	
	this.errorNewChannel = ko.observable();
	this.channelName = ko.observable();	
	this.channelWebAddress = ko.observable();							
	
	/* Methods */
	this.applyBindings = function() {
		//$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();					
    //});	
	};
	
	this.clearForm = function () {
		that.newChannel('');
		that.channelClass('');		
		that.message('');
		that.errorNewChannel('');			
  };
	  
	this.activate = function() {
		if(authenticate()) {
			//addExternalMarkup(that.template); // this is for header/overlay message					
            window["headerViewModel"].activate();
			that.accountName(localStorage.getItem('accountName'));
			that.sectionOne(true);
			that.sectionTwo(false);
			$('input').focus();							
			$('input').keyup(function () {
				that.message('');
				that.channelClass('');				
				that.errorNewChannel('');
			});							
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && allpages.querySelector('div').getAttribute('id') == 'channelNewView') {
			that.createChannelCommand();
		}
	});	

	this.createChannelCommand = function (e) {
    if (that.newChannel() == '') {
      that.errorNewChannel('<span>SORRY:</span> Please enter channel name');
    } else if (that.newChannel().match(/\s/)) {
			that.errorNewChannel('<span>SORRY:</span> Please choose a short name with no spaces');
		} else if(that.newChannel().length > 15) {
			that.errorNewChannel('<span>SORRY:</span> Please choose name of max. 15 characters');			
		} else {
			//$.mobile.showPageLoadingMsg('a', 'Checking channel name availability');
			ES.loginService.checkName(that.newChannel(), { success: successAvailable, error: errorAPI });			
    }
  };
	
	function successfulCreate(data) {
    //$.mobile.hidePageLoadingMsg();
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
			longDescription: data.longDescription,			
			followerCount: followers
		});
		channel = channel[0];		
		localStorage.setItem('currentChannelData', JSON.stringify(channel));					
		var toastobj = {type: '', text: 'Channel created'};
		showToast(toastobj);				
  };
	
	function successAvailable(data){
		if(data){
			that.channelClass('validationerror');
      that.errorNewChannel('<span>SORRY:</span> This channel name has already been taken');
		} else {
			//that.message('<span>GREAT! </span> This name is available');
			//$.mobile.showPageLoadingMsg('a', 'Creating Channel ');
			ES.channelService.createChannel({name: that.newChannel()}, {success: successfulCreate, error: errorAPI});			
			that.sectionOne(false);
			that.sectionTwo(true);							
			that.channelName(that.newChannel()+' is now LIVE!');			
			that.channelWebAddress(that.newChannel()+'.evernym.com');			
		}
	};
						
  function errorAPI(data, status, details) {
   // $.mobile.hidePageLoadingMsg();
    goToView('channelNameView');
		that.sectionOne(true);
		that.sectionTwo(false);
		that.message('');
    that.errorNewChannel('<span>SORRY:</span> ' + details.message);		
  };
	
  this.OkCommand = function () {
		sendMessageViewModel.clearForm();					
    goToView('channelsIOwnView');
  };		
	
}