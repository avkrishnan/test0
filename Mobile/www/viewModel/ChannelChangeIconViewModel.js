/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelChangeIconViewModel() {	
  var that = this;
	this.template = 'channelChangeIconView';
	this.viewid = 'V-16';
	this.viewname = 'Change Icon';
	this.displayname = 'Channel Chage Icon Image';	   
	this.accountName = ko.observable();	
	
  /* Channel Icon Image observable */
	this.channelId = ko.observable();	
	this.picId = ko.observable();
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	this.activate = function() {
		if(authenticate()) {
		var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));		
			if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message			
			that.accountName(appCtx.getItem('accountName'));			
			var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));
			that.channelId(channelObject.channelId);			
			}
		}
	}	
	
	function successfulModify(args) {
    goToView('channelSettingsView');
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
  };
	
  this.changeChannelIconCommand = function () {
		var channelObject = {
			id: that.channelId(),
			picId: that.picId()
		};
		$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
		ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
  };	
	
}