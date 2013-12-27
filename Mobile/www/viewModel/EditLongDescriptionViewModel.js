/*globals ko*/
/* To do - Pradeep Kumar */
function EditLongDescriptionViewModel() {	
  var that = this;
	this.template = 'editLongDescriptionView';
	this.viewid = 'V-67';
	this.viewname = 'Edit Long Desc';
	this.displayname = 'Edit Long Desc';	  
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Edit Channel Display observable */
	this.channelId = ko.observable();
	this.channelName = ko.observable();	
	this.longDescription = ko.observable();	
	this.errorMessage = ko.observable(false);	
	this.errorChannel = ko.observable();
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();			
    });	
	};  
	
	this.clearForm = function () {
    that.longDescription('');
		that.errorMessage(false);		
		that.errorChannel('');		
  };
	
	this.activate = function() {		
		if(authenticate()) {
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));			
			if(!channelObject) {
				goToView('channelsIOwnView');			
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message					
				that.accountName(ENYM.ctx.getItem('accountName'));		
				that.channelId(channelObject.channelId);
				that.channelName(channelObject.channelName);			
				that.longDescription(channelObject.longDescription);						
				$('textarea').keyup(function () {
					that.errorMessage(false);				
					that.errorChannel('');
				});
			}
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13  && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'editLongDescriptionView') {
			that.longDescriptionCommand();
		}
	});	
	
	function successfulModify(args) {		
		$.mobile.showPageLoadingMsg('a', 'Loading channel settings');
		ES.channelService.getChannel(that.channelId(), {success: successfulGetChannel, error: errorAPI});		
  };
	
	function successfulGetChannel(data) {
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} else {
			var followers = data.followers +' followers';
		}		
		var channel = [];			
		channel.push({
			channelId: data.id, 
			channelName: data.name, 
			channelDescription: data.description,
			longDescription: data.longDescription,			
			followerCount: followers
		});
		channel = channel[0];		
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(channel));
		var toastobj = {redirect: 'channelSettingsView', type: '', text: 'Description changed'};
		showToast(toastobj);		
		backNavText.pop();
		backNavView.pop();		
		goToView('channelSettingsView');								
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.errorMessage(true);	
		that.errorChannel('<span>SORRY:</span> '+details.message);
  };
	
  this.longDescriptionCommand = function () {
		if (that.longDescription() == '' || typeof that.longDescription() == 'undefined') {
			that.errorMessage(true);						
      that.errorChannel('<span>SORRY:</span> Please enter long description');
    } else {
			var channelObject = {
				id: that.channelId(),
				longDescription: that.longDescription()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };	
	
}