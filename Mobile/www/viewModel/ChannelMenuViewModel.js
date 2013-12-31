function ChannelMenuViewModel() {
	var self = this;
	self.template = 'channelMenuView';
	self.viewid = 'V-04';
	self.viewname = 'ChannelMenu';
	self.displayname = 'Channel Menu';
	
	self.activate = function() {
		//self.backView(data.prevPage.attr('id'));
	};
	
	self.menuHide = function() {
		backNavText.pop();
		backNavView.pop();
		goToView(self.previousViewID());		
	};
}

ChannelMenuViewModel.prototype = new ENYM.ViewModel();
ChannelMenuViewModel.prototype.constructor = ChannelMenuViewModel;