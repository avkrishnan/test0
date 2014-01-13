function EditFollowerDetailsViewModel() {
  var self = this;
  self.template = 'editFollowerDetailsView';
  self.viewid = 'V-35';
  self.viewname = 'Edit Follower Details';
  self.displayname = 'Edit Follower Details';
	self.followerCommethods = ko.observable([]);	
	
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
		}
		self.followerCommethods([]);
		if(followerObject.accountname != '') {
			$.when(ES.commethodService.getCommethodsForProvis(followerObject.accountname)
				.then(function(data) {
					$.each(data.commethod, function(indexCommethod, valueCommethod) {
						if(valueCommethod.type == 'EMAIL') {
							self.emailaddress(valueCommethod.address);
						} else {
							self.smsPhone(valueCommethod.address);
						}
					});
					self.followerCommethods(data.commethod);
					//alert(JSON.stringify(data.commethod));
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
		$.when(ES.loginService.accountModifyOther(self.followerID(), editFollower)
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
		);
		viewNavigate('Channels', 'channelsIOwnView', 'followersListView');
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