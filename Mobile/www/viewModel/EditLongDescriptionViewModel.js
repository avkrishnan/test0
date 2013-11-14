/*globals ko*/
/* To do - Pradeep Kumar */
function EditLongDescriptionViewModel() {	
  var that = this;
	this.template = 'editLongDescriptionView';
	this.viewid = 'V-67';
	this.viewname = 'EditLongDescription';
	this.displayname = 'Edit Long Description';	  
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Edit Channel Display observable */
	this.channelId = ko.observable();
	this.longDescription = ko.observable();	
	this.message = ko.observable();	
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
		that.message('');
		that.errorChannel('');		
  };
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));
			that.channelId(channelObject.channelId);			
			$('input').keyup(function () {
				that.message('');
				that.errorChannel('');
			});
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13  && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'editLongDescriptionView') {
			that.longDescriptionCommand();
		}
	});
	
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelSettingsView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('longDescriptionView');
		that.message('');
		that.errorChannel('<span>SORRY :</span> '+response.message);
  };
	
  this.longDescriptionCommand = function () {
		if (that.longDescription() == '') {
      that.errorChannel('<span>SORRY :</span> Please enter long description');
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