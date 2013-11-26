/*globals ko*/
function HeaderViewModel() {	
	this.newMessageCount = ko.observable();
	this.newMessageClass = ko.observable();
	
	that = this;
	/* Methods */
	this.activate = function() {
		showNewMessages(localStorage.getItem('enymNotifications'));
	}
	
	/* New messages*/
	showNewMessages = function(data) {
		var tempCount = 0;
		var tempNotifications = JSON.parse(data);
		$.each(tempNotifications, function(indexNotification, valueNotification) {
			if(valueNotification.read == 'N') {
				tempCount = tempCount+1;
			}
		});
		if(tempCount > 0) {
			that.newMessageClass('smsiconwhite');	
		}
		that.newMessageCount(tempCount);
	}
	
	this.newIGIOverlay = function() {
		alert('Coming soon...');
	}
	
	this.newFollowersOverlay = function() {
		alert('Coming soon...');	
	}	
	
	this.newMessagesOverlay = function() {
		$('#newMessages').popup().popup('open');
	}
}
/* overlay messages*/
function OverlayViewModel() {
	that = this;
	this.newMessagesDisplay = ko.observableArray([]);
	
	this.activate = function() {
		that.newMessagesOverlay();
	}

	this.newMessagesOverlay = function() {
		that.newMessagesDisplay.removeAll();
		$.each(JSON.parse(localStorage.getItem('enymNotifications')), function(indexNotification, valueNotification) {
			if(valueNotification.read == 'N') {
				valueNotification.created = dateFormat2(valueNotification.created);
				valueNotification.escLevelId = "icon-" + valueNotification.escLevelId.toLowerCase();
				that.newMessagesDisplay.push(valueNotification);
			}
		});
	}
	
	this.closePopup = function() {
		$('#newMessages').popup('close');
	}
	
	this.showSingleMessage = function(data) {
		localStorage.setItem("overlayCurrentChannel",JSON.stringify(data));
		//alert(localStorage.getItem("overlayCurrentChannel"));
		//$('#newMessages').popup('close');
		goToView('channelSingleMessagesView');
	}
}
