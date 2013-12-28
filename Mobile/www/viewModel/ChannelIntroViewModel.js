function ChannelIntroViewModel() {
  var self = this;
  self.template = 'channelIntroView';
  self.viewid = 'V-??';
  self.viewname = 'Channel Intro';
  self.displayname = 'Channel Introduction';
	
	self.sectionOne = ko.observable(true);
	self.sectionTwo = ko.observable(false);
	
  self.inputObs = ['channelName', 'channelWebAddress', 'tagline', 'channelDescription' ];
  self.defineObservables()	
	
  self.activate = function() {
		self.sectionOne(true);
		self.sectionTwo(false);		
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
  	addExternalMarkup(self.template); // this is for header/overlay message	
		self.channelName(channelObject.channelName);													
		self.channelWebAddress('This is your channel web page, now live at '+self.channelName()+'.evernym.com');
		self.tagline('(sample tagline for '+self.channelName()+')');		
		self.channelDescription('This is the web page for '+self.channelName()+'.</br>To follow '+self.channelName()+', click the "Follow" Button below.');				
	};
	
	self.comingSoon = function() {
		headerViewModel.comingSoon();		
	};
	
  self.showPreview = function () {				
		self.sectionOne(false);
		self.sectionTwo(true);
  };
	
  self.okCommand = function () {				
    goToView('channelsIOwnView');
  };
	
  self.exitPreview = function () {				
    goToView('channelIntroView');
  };		
		
}

ChannelIntroViewModel.prototype = new ENYM.ViewModel();
ChannelIntroViewModel.prototype.constructor = ChannelIntroViewModel;