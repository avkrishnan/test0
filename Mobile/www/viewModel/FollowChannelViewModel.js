function FollowChannelViewModel() {
  var self = this;
	self.template = 'followChannelView';
	self.viewid = 'V-??';
	self.viewname = 'Follow Channel';
	self.displayname = 'Follow Channel';	
	
  self.inputObs = [ 'channelValue'];
	self.errorObs = [ 'findClass', 'errorFind'];
  self.defineObservables();	
	
	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		ENYM.ctx.removeItem("currentChannel");
		$('input').keyup(function () {
			self.clearErrorObs();
		});			
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'followChannelView') {		
			self.findChannel();
		}
	});	
	
	self.findChannel = function() {
    if (self.channelValue() == '') {
			self.findClass('validationerror');
      self.errorFind('<span>Sorry,</span> Please enter channel name');
		}
		else {		
			$.mobile.showPageLoadingMsg('a', 'Searching channel');
			ES.loginService.checkName(self.channelValue(), { success: successAvailable, error: errorAPI });	
		}
	};
	
	function successAvailable(data){
		if(data){
			return ES.channelService.getChannel(self.channelValue(), {success: successfulGetChannel, error: errorAPI});				
		} else {
			self.findClass('validationerror');
      self.errorFind('<span>Sorry,</span> channel not found.');			
		}							
	};
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
		ENYM.ctx.setItem("currentChannel", JSON.stringify(data));						
		viewNavigate('Follow Channel', 'followChannelView', 'channelView');					
  };	
						
  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.findClass('validationerror');
    self.errorFind('<span>Sorry,</span> ' + details.message);		
  };	
		
};

FollowChannelViewModel.prototype = new ENYM.ViewModel();
FollowChannelViewModel.prototype.constructor = FollowChannelViewModel;