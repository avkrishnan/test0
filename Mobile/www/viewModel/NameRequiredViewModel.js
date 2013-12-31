function NameRequiredViewModel() {	
  var self = this;
	self.template = 'nameRequiredView';
	self.viewid = 'V-??';
	self.viewname = 'Name Required';
	self.displayname = 'Name Required';	

  self.inputObs = [ 'channelId', 'channelName', 'firstname', 'lastname']; 
  self.errorObs = [ 'errorFirstName', 'errorFirstLastName', 'firstnameClass', 'lastnameClass' ];
	
  self.defineObservables();			
	
  self.activate = function () {
		addExternalMarkup(self.template); // this is for header/overlay message			
		$('input').keyup(function () {
		  self.clearErrorObs();
		});
		var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));
		self.channelId(channel.id);		
		self.channelName(channel.name);
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'nameRequiredView') {
			self.insertNameCommand();
		}
	});	
	
	self.insertNameCommand = function () {
    if (self.firstname() == '') {
      self.firstnameClass('validationerror');
      self.errorFirstName('<span>SORRY:</span> Please enter first name');
    } else if (self.firstname().length > 20) {
      self.firstnameClass('validationerror');
      self.errorFirstName('<span>SORRY:</span> Please enter name of max. 20 characters');
    } else if (self.lastname() == '') {
      self.lastnameClass('validationerror');
      self.errorFirstLastName('<span>SORRY:</span> Last name cannot be left empty');
    } else if (self.lastname().length > 20) {
      self.lastnameClass('validationerror');
      self.errorFirstLastName('<span>SORRY:</span> Please enter name of max. 20 characters');
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
    if(ENYM.ctx.getItem('action') == 'follow_channel' && ENYM.ctx.getItem('newusername')) {
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
			ENYM.ctx.removeItem('action');		
			var toastobj = {redirect: 'channelMessagesView', type: '', text: 'Now following '+self.channelName()};
			showToast(toastobj);
			goToView('channelMessagesView');			
		}
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.firstnameClass('validationerror');		
		self.lastnameClass('validationerror');
		self.errorFirstLastName('<span>SORRY:</span> '+details.message);		
  };
	
	self.cancelRequest = function() {
    if(ENYM.ctx.getItem('action') == 'follow_channel' && ENYM.ctx.getItem('newusername')) {
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