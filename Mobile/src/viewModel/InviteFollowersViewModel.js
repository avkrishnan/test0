function InviteFollowersViewModel() {	
  var self = this;
	self.template = 'inviteFollowersView';
	self.viewid = 'V-27a';
	self.viewname = 'InviteFollowers';
	self.displayname = 'Invite Followers';	

	self.textId = ko.observable('message');								
	self.error = ko.observable(false);
	
  self.inputObs = [ 'channelName', 'channelWebAddress', 'emailClass', 'errorEmail', 'emailaddress', 'textClass', 'text', 'errorText' ];
  self.defineObservables();
	
	self.activate = function() {
		self.error(false);
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));								
			self.channelName(channelObject.channelName);
			self.channelWebAddress(channelObject.channelName+'.evernym.dom');		
			$('textarea').keyup(function () {
				self.textClass('');
				self.error(false);				
				self.errorText('');												
			});							
			$('input, textarea').keyup(function () {
				self.emailClass('');
				self.errorEmail('');									
			});			
		}
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'inviteFollowersView') {
			self.sendInviteCommand();
		}
	});	
	
	self.sendInviteCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		var textData = $('#'+self.textId()).val();
		if (self.emailaddress() == '' || !emailReg.test(self.emailaddress())) {
			self.emailClass('validationerror');
			self.errorEmail('<span>Sorry,</span> Please enter valid email');
    } else if (textData == '') {
			self.textClass('validationerror');
			self.error(true);			
			self.errorText('<span>Sorry,</span> Please give message');
    } else {
			showMessage('Testing');			
    }
  };
}

InviteFollowersViewModel.prototype = new ENYM.ViewModel();
InviteFollowersViewModel.prototype.constructor = InviteFollowersViewModel;