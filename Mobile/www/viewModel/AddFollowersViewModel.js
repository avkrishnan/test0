function AddFollowersViewModel() {
  var self = this;
	self.template = 'addFollowersView';
	self.viewid = 'V-28';
	self.viewname = 'AddFollowers';
	self.displayname = 'Add Followers';
	self.showInvite = ko.observable();
	
  self.inputObs = [ 'channelId', 'channelName', 'firstLastName', 'nameClass', 'errorName', 'emailaddress', 'emailClass', 'errorEmail', 'smsPhone', 'phoneClass', 'errorPhone' ];
  self.defineObservables();
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
		self.showInvite(true);
		if(!channelObject) {
			goToView('channelsIOwnView');
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);
			$('input').keyup(function() {
				self.emailaddress('');
				self.nameClass('');
				self.errorName('');
				self.emailClass('');
				self.errorEmail('');
				self.errorPhone('');
				self.phoneClass('');
			});
		}
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'addFollowersView') {
			self.addFollowersCommand();
		}
	});
	
	self.addFollowersCommand = function () {
    /*
		var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		if (self.emailaddress() == '' || !emailReg.test(self.emailaddress())) {
			self.emailClass('validationerror');
			self.errorEmail('<span>Sorry,</span> Please enter valid email.');
		}
		*/
		var emailObject = validateEmail(self.emailaddress());
		alert(emailObject.type);
		if(emailObject.type == 'Error') {
			self.errorEmail(emailObject.text);
			self.emailClass('validationerror');
			return false;			
		}
		var phoneObject = validateUSAPhone(self.smsPhone());
		if(phoneObject.type == 'Error') {
			self.errorPhone(phoneObject.text);
			self.phoneClass('validationerror');
			return false;
		} else {
			self.smsPhone(phoneObject.text);
		}
		$.mobile.showPageLoadingMsg("a", "Adding Provisional Follower");
		var provisional = generateProvisionalAccount();
		ES.channelService.invite(self.channelId(), provisional, {success: successfulAdd, error: errorAPI});
  };
	
	function generateProvisionalAccount() {
		if(self.firstLastName() != '') {
			var fullName = self.firstLastName().split(' ');
			var firstName = fullName[0];
			var lastName = fullName[1];		
		} else {
			firstName = '';
			lastName = '';
		}
		return {
			emailaddress: self.emailaddress(),
			smsPhone: self.smsPhone,
			firstname: firstName,
			lastname: lastName
		};
	};
	
	function successfulAdd(data) {
		self.showInvite(false);
		//goToView('channelMainView');
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
	};
}

AddFollowersViewModel.prototype = new ENYM.ViewModel();
AddFollowersViewModel.prototype.constructor = AddFollowersViewModel;