function ChannelIntroViewModel() {
  var self = this;
  self.template = 'channelIntroView';
  self.viewid = 'V-??';
  self.viewname = 'Channel Intro';
  self.displayname = 'Channel Introduction';
	
	self.sectionOne = ko.observable(true);
	self.sectionTwo = ko.observable(false);
	
  self.inputObs = ['channelId', 'channelName', 'channelWebAddress', 'tagline', 'longDescription', 'moreText', 'taglineBtnText', 'descBtnText', 'clickType'];
  self.defineObservables();

	self.editing = ko.observable(false);
	self.editingTextarea = ko.observable(false);	
	self.less = ko.observable(true);		
	self.more = ko.observable(false);
	self.moreButton = ko.observable(false);
	self.lessButton = ko.observable(false);		
	
  self.activate = function() {
		self.sectionOne(true);
		self.sectionTwo(false);		
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
  		addExternalMarkup(self.template); // this is for header/overlay message	
		self.channelId(channelObject.channelId);
		self.channelName(channelObject.channelName);													
		self.channelWebAddress('This is your channel web page, now live at <em>'+self.channelName()+'.evernym.com</em>');
		self.tagline('(sample tagline for '+self.channelName()+')');		
		self.longDescription('This is the web page for '+self.channelName()+'.<br/>To follow '+self.channelName()+', click the "Follow" Button below.');
		self.taglineBtnText('Edit');
		self.descBtnText('Edit');
		self.editing(false);
		self.editingTextarea(false);				
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
				self.longDescription(logDesc);
				self.moreText(channelObject.longDescription.replace(/\n/g, '<br/>'));
				self.moreButton(true);							
			}
			else {
				self.longDescription(channelObject.longDescription.replace(/\n/g, '<br/>'));			
			}			
		}						
	};

	self.editTagline = function(data) {		
		self.clickType(data);
		if(self.taglineBtnText() == 'Save') {
			self.shortDescriptionCommand();
		}
		else {
			self.editing(true);
			self.taglineBtnText('Save');		
		}
	};
	
	self.editDescription = function(data) {
		self.clickType(data);
		if(self.descBtnText() == 'Save') {
			self.longDescriptionCommand();
		}
		else {
			self.longDescription(self.longDescription().replace(/<br\s*[\/]?>/gi,'\n'));
			self.editingTextarea(true);
			self.descBtnText('Save');		
			self.less(false);		
			self.more(false);				
		}
	};
	
  self.shortDescriptionCommand = function () {
		if (self.tagline() == '' || typeof self.tagline() == 'undefined') {
			var toastobj = {type: 'toast-error', text: 'Please enter channel tagline'};
			showToast(toastobj);
    } else {
			var channelObject = {
				id: self.channelId(),
				description: self.tagline()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
	
  self.longDescriptionCommand = function () {
		if (self.longDescription() == '' || typeof self.longDescription() == 'undefined') {
			var toastobj = {type: 'toast-error', text: 'Please enter long description'};
			showToast(toastobj);
    } else {
			var channelObject = {
				id: self.channelId(),
				longDescription: self.longDescription()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
	
	function successfulModify() {		
		$.mobile.showPageLoadingMsg('a', 'Loading channel Infomation');
		ES.channelService.getChannel(self.channelId(), {success: successfulGetChannel, error: errorAPI});		
  };		
	
	function successfulGetChannel(data) {	
		var channel = [];			
		channel.push({
			channelId: data.id, 
			channelName: data.name, 
			channelDescription: data.description,
			longDescription: data.longDescription,		
			followerCount: data.followers
		});
		channel = channel[0];		
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(channel));
		if(self.clickType() == 'tagline') {
			self.taglineBtnText('Edit');
			self.editing(false);
			var toastobj = {type: '', text: 'Channel Tagline updated'};
			showToast(toastobj);								
		}
		else {
			self.descBtnText('Edit');
			self.editingTextarea(false);
			self.less(true);
			var toastobj = {type: '', text: 'Description changed'};
			showToast(toastobj);	
			self.longDescription(self.longDescription().replace(/\n/g, "<br/>"));					
		}													
  };

  function errorAPI(data, status, details) {
		$.mobile.hidePageLoadingMsg();		
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
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
  	if(self.previousViewID() == 'channelNewView'){
			if(backNavView[backNavView.length-1] == 'channelsIOwnView') {
				backNavText.pop();
				backNavView.pop();
			}						
	    goToView('channelsIOwnView');
 	  } else{
    	goToView('channelSettingsView');
    }
  };
	
  self.exitPreview = function () {				
    goToView('channelIntroView');
  };		
		
}

ChannelIntroViewModel.prototype = new ENYM.ViewModel();
ChannelIntroViewModel.prototype.constructor = ChannelIntroViewModel;