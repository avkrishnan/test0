function ChannelChangeNameViewModel() {	
  var self = this;
	self.template = 'channelChangeNameView';
	self.viewid = 'V-16';
	self.viewname = 'Change Chan';
	self.displayname = 'Change Channel Name';	

	self.sectionOne = ko.observable(true);
	self.sectionTwo = ko.observable(false);

  self.inputObs = [ 'channelId', 'channelChangeName', 'channelClass', 'message', 'errorChannel', 'channelWebAddress' ];
	self.defineObservables();		
	  
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message							
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
			self.channelId(channelObject.channelId);	
			self.channelChangeName(channelObject.channelName);						
			$('input').keyup(function () {
				self.message('');
				self.errorChannel('');
				self.channelClass('');
			});	
		}
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'channelChangeNameView') {
			self.nextViewCommand();
		}
	});		
	
  self.nextViewCommand = function () {
		headerViewModel.comingSoon();
  };
	
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    popBackNav();
  };
	
	function successAvailable(data){
		if(data){
			self.channelClass('validationerror');
      self.errorChannel('<span>Sorry,</span> This channel name has already been taken');
		} else {
			self.sectionOne(false);
			self.sectionTwo(true);						
			self.channelWebAddress(self.channelChangeName()+'.evernym.com');				
		}
	};	

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelChangeNameView');
		self.sectionOne(true);
		self.sectionTwo(false);
		self.message('');
    self.errorChannel('<span>Sorry,</span> '+details.message);		
  };
	
  self.confirmChannelChangeNameCommand = function () {		
		var channelObject = {
			id: self.channelId(),
			name: self.channelChangeName()
		};
	};
}

ChannelChangeNameViewModel.prototype = new ENYM.ViewModel();
ChannelChangeNameViewModel.prototype.constructor = ChannelChangeNameViewModel;