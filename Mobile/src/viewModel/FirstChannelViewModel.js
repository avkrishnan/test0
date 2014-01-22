function FirstChannelViewModel() {
	var self = this;
	self.template = 'firstChannelView';
	self.viewid = 'V-14';
	self.viewname = 'FollowFirstChannel';
	self.displayname = 'Follow First Channel';

	self.backText = ko.observable();
	
	self.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			self.backText('<em></em>'+backNavText[backNavText.length-1]);			
		}
	};
}

FirstChannelViewModel.prototype = new ENYM.ViewModel();
FirstChannelViewModel.prototype.constructor = FirstChannelViewModel;