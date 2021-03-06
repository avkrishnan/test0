﻿function NameRequiredViewModel() {	
  var self = this;
	self.template = 'nameRequiredView';
	self.viewid = 'V-??';
	self.viewname = 'Name Required';
	self.displayname = 'Name Required';	

  self.inputObs = [ 'channelId', 'channelName', 'firstname', 'lastname']; 
  self.errorObs = [ 'errorFirstName', 'errorFirstLastName', 'firstnameClass', 'lastnameClass' ];
	
  self.defineObservables();			
	
  self.activate = function () {
		var action = JSON.parse(ENYM.ctx.getItem('action'));		
		if(action && action.follow_channel == 'Y' && action.SHARE_NAME == 'Y') {	
			$('input').keyup(function () {
				self.clearErrorObs();
			});
			var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));
			self.channelId(channel.id);		
			self.channelName(channel.name);
		}
		else {
			goToView('homeView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'nameRequiredView') {
			self.insertNameCommand();
		}
	});	
	
	self.insertNameCommand = function () {
    if (self.firstname() == '') {
      self.firstnameClass('validationerror');
      self.errorFirstName('<span>Sorry,</span> Please enter first name');
    } else if (self.firstname().length > 20) {
      self.firstnameClass('validationerror');
      self.errorFirstName('<span>Sorry,</span> Please enter name of max. 20 characters');
    } else if (self.lastname() == '') {
      self.lastnameClass('validationerror');
      self.errorFirstLastName('<span>Sorry,</span> Last name cannot be left empty');
    } else if (self.lastname().length > 20) {
      self.lastnameClass('validationerror');
      self.errorFirstLastName('<span>Sorry,</span> Please enter name of max. 20 characters');
    } else {
      $.mobile.showPageLoadingMsg('a', 'Saving settings');
      var account = modifyAccount();
      ES.loginService.accountModify(account, { success: successfulUpdate, error: errorAPI });
    }
  };
	
	function modifyAccount() {
    return {
      firstname: self.firstname(),
      lastname: self.lastname()
    };
  };

  function successfulUpdate() {
    $.mobile.hidePageLoadingMsg();
		var account = [];			
		account.push({
			accountname: self.accountName(),			
			firstname: self.firstname(), 
			lastname: self.lastname()
		});
		account = account[0];				
		ENYM.ctx.setItem('account', JSON.stringify(account));		
    if(ENYM.ctx.getItem('newusername')) {
			var callbacks = {
				success: function() {
					var toastobj = {redirect: 'tutorialView', type: '', text: 'Now following '+self.channelName()};
					showToast(toastobj);
					goToView('tutorialView');					
				},
				error: function(data, status, details) {
					var toastobj = {type: 'toast-error', text: details.message};
					showToast(toastobj);
				}
			};						
			ES.channelService.followChannel(self.channelId(), callbacks);
		}
		else {
			var callbacks = {
				success: function() {
					ENYM.ctx.removeItem('action');		
					var toastobj = {redirect: 'channelsFollowingListView', type: '', text: 'Now following '+self.channelName()};
					showToast(toastobj);
					goToView('channelsFollowingListView');										
				},
				error: function(data, status, details) {
					var toastobj = {type: 'toast-error', text: details.message};
					showToast(toastobj);
				}
			};						
			ES.channelService.followChannel(self.channelId(), callbacks);						
		}
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.firstnameClass('validationerror');		
		self.lastnameClass('validationerror');
		self.errorFirstLastName('<span>Sorry,</span> '+details.message);		
  };
	
	self.cancelRequest = function() {
    if(ENYM.ctx.getItem('newusername')) {
			ENYM.ctx.removeItem('action');
			var toastobj = {redirect: 'tutorialView', type: 'toast-info', text: 'Follow request cancelled'};
			showToast(toastobj);
			goToView('tutorialView');					
		}
		else {
			ENYM.ctx.removeItem('action');		
			var toastobj = {redirect: 'homeView', type: 'toast-info', text: 'Follow request cancelled'};
			showToast(toastobj);
			goToView('homeView');			
		}			
	};		
	
}

NameRequiredViewModel.prototype = new ENYM.ViewModel();
NameRequiredViewModel.prototype.constructor = NameRequiredViewModel;