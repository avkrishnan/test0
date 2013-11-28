﻿/*globals ko*/
function HeaderViewModel() {	
	this.backText = ko.observable();
	this.isBack = ko.observable(true);	
	this.newMessageCount = ko.observable('');
	this.newMessageClass = ko.observable();
	this.toastText = ko.observable();		
	
	that = this;
	/* Methods */
	this.activate = function() {
		if($.mobile.activePage.attr('id') == 'channelListView') {
			this.isBack = ko.observable(false);			
		}
		if(typeof backNavText[0] == 'undefined') {
			that.backText('<em></em>Home');
		} else {		
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
		}		
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
			that.newMessageCount(tempCount);
		}
		else {
			that.newMessageCount('');
		}
	}
	
	this.backCommand = function () {
		if(typeof backNavText[0] == 'undefined') {
			goToView('channelListView');
		} else {		
			popBackNav();		
		}	
  };		
	
	this.newIGIOverlay = function() {
		that.toastText('Feature coming soon!');
		localStorage.setItem('toastData', that.toastText());
		goToView($.mobile.activePage.attr('id'));
	}
	
	this.newFollowersOverlay = function() {
		that.toastText('Feature coming soon!');
		localStorage.setItem('toastData', that.toastText());		
		goToView($.mobile.activePage.attr('id'));		
	}	
	
	this.newMessagesOverlay = function() {
		var tCount = JSON.parse(localStorage.getItem('enymNotifications')).length;
		if(tCount > 0) {
			$('#newMessages').popup().popup('open', {x: 10, y:10});	
		}
		else {
			that.toastText('You dont have any new messages!');
			localStorage.setItem('toastData', that.toastText());
			goToView($.mobile.activePage.attr('id'));
		}
	}
	
	this.menuCommand = function () {
		viewNavigate($.mobile.activePage.attr('id'), $.mobile.activePage.attr('id'), 'channelMenuView');		
  };
		
}
/* overlay messages*/
function OverlayViewModel() {
	that = this;
	this.newMessagesDisplay = ko.observableArray([]);
	this.toastText = ko.observable();		
	
	this.activate = function() {
		that.newMessagesOverlay();
	}

	this.newMessagesOverlay = function() {
		that.newMessagesDisplay.removeAll();
		//alert(JSON.parse(localStorage.getItem('enymNotifications')));
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
