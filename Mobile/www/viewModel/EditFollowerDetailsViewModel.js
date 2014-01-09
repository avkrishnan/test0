function EditFollowerDetailsViewModel() {
  var self = this;
  self.template = 'editFollowerDetailsView';
  self.viewid = 'V-35';
  self.viewname = 'Edit Follower Details';
  self.displayname = 'Edit Follower Details';
	
  self.inputObs = [ 'channelName', 'followerName', 'emailaddress', 'smsPhone', 'followerID' ];
	self.errorObs = [ 'nameClass', 'errorName', 'emailClass', 'errorEmail', 'errorPhone', 'phoneClass' ];
  self.defineObservables();

	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
		var followerObject = JSON.parse(ENYM.ctx.getItem('currentfollowerData'));
		//alert(JSON.stringify(followerObject));
		if(!channelObject) {
			goToView('followersListView');							
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.channelName(channelObject.channelName);
			self.followerID(followerObject.accountname);
			if(typeof followerObject.followerName != 'undefined' || followerObject.followerName != '') {
				self.followerName(followerObject.followerName);
			}
			/*
			if(typeof followerObject.accountname != 'undefined' || followerObject.accountname != '') {
				self.followerEmail(followerObject.accountname);
			}
			if(typeof followerObject.followerName != 'undefined' || followerObject.followerName != '') {
				self.followerPhone(followerObject.followerName);
			}	
			*/																								
		}
		$('input').keyup(function() {
			self.clearErrorObs();
		});		
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'editFollowerDetailsView') {
			self.editFollowerDetails();
		}
	});
		
	self.editFollowerDetails = function () {
		if(self.emailaddress() == '' && self.smsPhone() == '') {
			self.errorPhone("<span>Sorry, </span> A phone number or email address are required.");
			self.phoneClass('validationerror');
			self.emailClass('validationerror');
			return false;
		} else {
			if(self.smsPhone() == '') {
				var emailObject = validateEmail(self.emailaddress());
				if(emailObject.type == 'Error') {
					self.errorEmail(emailObject.text);
					self.emailClass('validationerror');
					return false;			
				}				
			} else if(self.emailaddress() == '') {
				var phoneObject = validateUSAPhone(self.smsPhone());
				if(phoneObject.type == 'Error') {
					self.errorPhone(phoneObject.text);
					self.phoneClass('validationerror');
					return false;
				} else {
					self.smsPhone(phoneObject.text);
				}
			} else {
				var emailObject = validateEmail(self.emailaddress());
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
			}
		}
		$.mobile.showPageLoadingMsg("a", "Editing Follower details.");
		var editFollower = generateProvisionalAccount();
		//alert(JSON.stringify(editFollower));
		ES.loginService.accountModifyOther(self.followerID(), editFollower, { success: editSuccessful, error: errorAPI });
  };
	
	function generateProvisionalAccount() {
		var tempProvosional = {};
		if(self.followerName() != '') {
			var fullName = self.followerName().split(' ');
			var firstName = fullName[0];
			var lastName = fullName[1];
			if(firstName != '') {
				tempProvosional.firstname = firstName;
			}
			if(lastName != '') {
				tempProvosional.lastname = lastName;
			}
		}
		if(self.emailaddress() != '') {
			//tempProvosional.emailaddress = self.emailaddress();
		}
		if(self.smsPhone() != '') {
			//tempProvosional.phonenumber = self.smsPhone();
		}
		return tempProvosional;
	};
	
	function editSuccessful(data) {
		//alert('Success');
		viewNavigate('Channels', 'channelsIOwnView', 'followersListView');
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		//alert('Error');
	};	
}

EditFollowerDetailsViewModel.prototype = new ENYM.ViewModel();
EditFollowerDetailsViewModel.prototype.constructor = EditFollowerDetailsViewModel;