/*globals ko*/
function HeaderViewModel() {	
	this.newMessageCount = ko.observable();
	that = this;
	/* Methods */
	this.activate = function() {
		showNewMessages(localStorage.getItem('enymNotifications'));
		//alert('2');
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
		that.newMessageCount(tempCount);
		//alert(that.newMessageCount());
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
		//alert(localStorage.getItem('enymNotifications'));
		that.newMessagesDisplay.removeAll();
		$.each(JSON.parse(localStorage.getItem('enymNotifications')), function(indexNotification, valueNotification) {
			if(valueNotification.read == 'N') {
				valueNotification.created = dateFormat2(valueNotification.created);
				valueNotification.type = "icon-" + valueNotification.type.toLowerCase();
				that.newMessagesDisplay.push(valueNotification);
			}
		});
		//alert(JSON.stringify(that.newMessagesDisplay()));
	}
	
	this.closePopup = function() {
		$('#newMessages').popup().popup('close');
	}
}
