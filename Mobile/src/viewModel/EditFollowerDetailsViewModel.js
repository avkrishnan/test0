function EditFollowerDetailsViewModel() {
  var self = this;
  self.template = 'editFollowerDetailsView';
  self.viewid = 'V-35';
  self.viewname = 'Edit Follower';
  self.displayname = 'Edit Follower Details';
	self.followerCommethods = ko.observable([]);	
	
  self.inputObs = [ 'channelName', 'followerName', 'emailaddress', 'smsPhone', 'followerID', 'previousEmail', 'previousPhone' ];
	self.errorObs = [ 'nameClass', 'errorName', 'emailClass', 'errorEmail', 'errorPhone', 'phoneClass' ];
  self.defineObservables();

	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
		var followerObject = JSON.parse(ENYM.ctx.getItem('currentfollowerData'));
		if(!channelObject) {
			goToView('followersListView');					
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.channelName(channelObject.channelName);
			self.followerID(followerObject.accountname);
			if(followerObject.visibleName == true) {
				if(typeof followerObject.followerName != 'undefined' || followerObject.followerName != '') {
					self.followerName(followerObject.followerName);
				} else {
					self.followerName();
				}
			}
		}
		self.followerCommethods([]);
		if(followerObject.accountname != '') {
			$.when(ES.commethodService.getCommethodsForProvis(followerObject.accountname)
				.then(function(data) {
					$.each(data.commethod, function(indexCommethod, valueCommethod) {
						if(valueCommethod.type == 'EMAIL') {
							self.emailaddress(valueCommethod.address);
							self.previousEmail(valueCommethod.address);
						} else {
							self.smsPhone(valueCommethod.address);
							self.previousPhone(valueCommethod.address);
						}
					});
					self.followerCommethods(data.commethod);
				})
			);
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
		var toastMessage = "Changes saved successfully";
		if(self.previousEmail() != self.emailaddress() || self.previousPhone() != self.smsPhone()) {
			toastMessage = "Changes saved, invitation sent";
		}
		$.when(ES.loginService.accountModifyOther(self.followerID(), editFollower))
		.then(function() {
			if(self.emailaddress() != '' || self.smsPhone() != '') {
				if(self.followerCommethods().length > 0) {
					var emailreplaced = false;
					var phonereplaced = false;
					$.each(self.followerCommethods(), function(indexCommethod, valueCommethod) {
						if(valueCommethod.type == 'EMAIL') {
							if(valueCommethod.address != self.emailaddress()) {
								$.when(ES.commethodService.deleteCommethodForProvis(self.followerID(), valueCommethod.id)
									.then(function() {
										ES.commethodService.addCommethodForProvis(self.followerID(), {type: 'EMAIL', address: self.emailaddress()});
									})
								);
							}
							emailreplaced = true;
						}
						if(valueCommethod.type == 'TEXT') {
							if(valueCommethod.address != self.smsPhone()) {
								$.when(ES.commethodService.deleteCommethodForProvis(self.followerID(), valueCommethod.id)
									.then(function() {
										ES.commethodService.addCommethodForProvis(self.followerID(), {type: 'TEXT', address: self.smsPhone()});
									})
								);
							}
							phonereplaced = true;
						}
					});
					if(self.emailaddress() != '' && emailreplaced == false) {
						ES.commethodService.addCommethodForProvis(self.followerID(), {type: 'EMAIL', address: self.emailaddress()});	
					}
					if(self.smsPhone() != '' && phonereplaced == false) {
						ES.commethodService.addCommethodForProvis(self.followerID(), {type: 'TEXT', address: self.smsPhone()});
					}						
				}
				else {
					if(self.emailaddress() != '') {
						ES.commethodService.addCommethodForProvis(self.followerID(), {type: 'EMAIL', address: self.emailaddress()});	
					}
					if(self.smsPhone() != '') {
						ES.commethodService.addCommethodForProvis(self.followerID(), {type: 'TEXT', address: self.smsPhone()});
					}
				}
			}
		})
		var toastobj = {redirect:'followersListView', type: '', text: toastMessage};
		showToast(toastobj);
		viewNavigate('Channels', 'channelsIOwnView', 'followersListView');
  };
	
	function generateProvisionalAccount() {
		var tempProvosional = {firstname:'', lastname:''};
		if(self.followerName() != '') {
			var fullName = self.followerName().trim().replace(/\s{2,}/g, ' ').split(' ');
			
			var firstName = fullName[0];
			var lastName = fullName[1];
			if(firstName != '') {
				tempProvosional.firstname = firstName;
			}
			if(typeof lastName != 'undefined' && lastName != '') {
				tempProvosional.lastname = lastName;
			}
		}
		return tempProvosional;
	};
	
	function editSuccessful(data) {
		viewNavigate('Channels', 'channelsIOwnView', 'followersListView');
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
	};	
}

EditFollowerDetailsViewModel.prototype = new ENYM.ViewModel();
EditFollowerDetailsViewModel.prototype.constructor = EditFollowerDetailsViewModel;