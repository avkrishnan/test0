/* To do - Pradeep Kumar */
function ChannelListViewModel() {
  var self = this;
  self.template = 'channelListView';
  self.viewid = 'V-40';
  self.viewname = 'Home';
  self.displayname = 'Home';
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message									
		localStorage.setItem('counter', 0);
	};
}

ChannelListViewModel.prototype = new AppCtx.ViewModel();
ChannelListViewModel.prototype.constructor = ChannelListViewModel;