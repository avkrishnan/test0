function ChannelIntroViewModel() {
  var self = this;
  self.template = 'channelIntroView';
  self.viewid = 'V-??';
  self.viewname = 'Channel Intro';
  self.displayname = 'Channel Introduction';
	
	self.sectionOne = ko.observable(true);
	self.sectionTwo = ko.observable(false);
	
  self.inputObs = ['channelName', 'channelWebAddress', 'tagline', 'longdescription', 'moreText' ];
  self.defineObservables();

	self.less = ko.observable(true);		
	self.more = ko.observable(false);
	self.moreButton = ko.observable(false);
	self.lessButton = ko.observable(false);		
	
  self.activate = function() {
		self.sectionOne(true);
		self.sectionTwo(false);		
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
  	addExternalMarkup(self.template); // this is for header/overlay message	
		self.channelName(channelObject.channelName);													
		self.channelWebAddress('This is your channel web page, now live at '+self.channelName()+'.evernym.com');
		self.tagline('(sample tagline for '+self.channelName()+')');		
		self.longdescription('This is the web page for '+self.channelName()+'.</br>To follow '+self.channelName()+', click the "Follow" Button below.');
		self.less(true);		
		self.more(false);				
		self.moreButton(false);
		self.lessButton(false);		
		if(typeof channelObject.channelDescription != 'undefined') {
			self.tagline(channelObject.channelDescription);
		}
		if(typeof channelObject.longDescription != 'undefined') {
			if(channelObject.longDescription.length > truncatedTextScreen()*12) {
				var logDesc = ($.trim(channelObject.longDescription).substring(0, truncatedTextScreen()*7).split(' ').slice(0, -1).join(' ') + '...').replace(/\n/g, '<br/>');
				self.longdescription(logDesc);
				self.moreText(channelObject.longDescription.replace(/\n/g, '<br/>'));
				self.moreButton(true);							
			}
			else {
				self.longdescription(channelObject.longDescription.replace(/\n/g, '<br/>'));			
			}			
		}						
	};
	
	self.comingSoon = function() {
		headerViewModel.comingSoon();		
	};
	
	self.showMore = function(){
		self.less(false);		
		self.more(true);
		self.moreButton(false);	
		self.lessButton(true);															
	};
	
	self.showLess = function(){
		self.less(true);		
		self.more(false);
		self.moreButton(true);
		self.lessButton(false);															
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