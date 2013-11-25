/*globals ko*/
function HeaderViewModel() {	
	this.newMessageCount = ko.observable();
	that = this;
	/* Methods */
	this.activate = function() {
		that.showNewMessages(localStorage.getItem('enymNotifications'));
	}
	
	/* New messages*/
	this.showNewMessages = function(data) {
		var tempCount = 0;
		var tempNotifications = JSON.parse(data);
		$.each(tempNotifications, function(indexNotification, valueNotification) {
			if(valueNotification.read == 'N') {
				tempCount = tempCount+1;
			}
		});
		that.newMessageCount(tempCount);
	}
	
	this.newMessagesOverlay = function() {
		$('#newMessages').popup('open');	
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
		//alert(localStorage.getItem('enymNotifications'));
		that.newMessagesDisplay.removeAll();
		$.each(JSON.parse(localStorage.getItem('enymNotifications')), function(indexNotification, valueNotification) {
			if(valueNotification.read == 'N') {
				valueNotification.created = time2TimeAgo(valueNotification.created);
				valueNotification.urgencyId = "icon-" + valueNotification.escLevelId.toLowerCase();
				that.newMessagesDisplay.push(valueNotification);
			}
		});
		//alert(JSON.stringify(that.newMessagesDisplay()));
	}
	
	this.closePopup = function() {
		$('#newMessages').popup('close');
	}
}
