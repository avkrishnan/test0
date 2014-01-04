function AddFollowersViewModel() {	
  var self = this;
	self.template = 'addFollowersView';
	self.viewid = 'V-28';
	self.viewname = 'AddFollowers';
	self.displayname = 'Add Followers';
	
  self.inputObs = [ 'channelId', 'channelName', 'firstLastName', 'nameClass', 'errorName', 'emailaddress', 'emailClass', 'errorEmail' ];
  self.defineObservables();
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {	
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));	
			self.channelId(channelObject.channelId);										
			self.channelName(channelObject.channelName);
			$('input').keyup(function() {
				self.nameClass('');
				self.errorName('');			
				self.emailClass('');
				self.errorEmail('');
			});						
		}
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'addFollowersView') {
			self.addFollowersCommand();
		}
	});	
	
	self.addFollowersCommand = function () {		
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		if (self.firstLastName() == '') {
			self.nameClass('validationerror');
			self.errorName('<span>Sorry,</span> Please enter first and last name');
    } else if (self.emailaddress() == '' || !emailReg.test(self.emailaddress())) {
			self.emailClass('validationerror');
			self.errorEmail('<span>Sorry,</span> Please enter valid email');
    } else {
			$.mobile.showPageLoadingMsg("a", "Adding Follower");
			var provisional = generateProvisionalAccount();
			ES.channelService.provisionalEnroll(provisional, {success: successfulAdd, error: errorAPI});
		}
  };
	
	function generateProvisionalAccount() {
		var fullName = self.firstLastName().split(' ');
		var firstName = fullName[0];
		var lastName = fullName[1];		
		return {
			emailaddress: self.emailaddress(),
			smsPhone: self.smsPhone,
			firstname: firstName,
			lastname: lastName,
			channelid: self.channelId()
		};
	};
	
	function successfulAdd(data){			
		goToView('channelMainView');				
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();		
	};
}

AddFollowersViewModel.prototype = new ENYM.ViewModel();
AddFollowersViewModel.prototype.constructor = AddFollowersViewModel;