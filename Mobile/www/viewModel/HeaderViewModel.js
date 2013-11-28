/*globals ko*/
function HeaderViewModel() {	
	this.backText = ko.observable();
	this.isBack = ko.observable(true);	
	this.newMessageCount = ko.observable('');
	this.newMessageClass = ko.observable('');
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
		that.showNewMessagesCount(localStorage.getItem('enymNotifications'));
	}
	
	/* This Function shows Count of New Message in header badge*/
	this.showNewMessagesCount = function(data) {
		if(JSON.parse(data).length > 0) {
			this.newMessageClass('smsiconwhite');
			this.newMessageCount(JSON.parse(data).length);
		}
		else {
			this.newMessageCount('');
		}
	}
	
	this.backCommand = function () {
		if(typeof backNavText[0] == 'undefined') {
			goToView('channelListView');
		} else {		
			popBackNav();		
		}	
  };		
	
	/*To Do to show new IGIs*/
	this.newIGIOverlay = function() {
		that.toastText('Feature coming soon!');
		localStorage.setItem('toastData', that.toastText());
		goToView($.mobile.activePage.attr('id'));
	}
	
	/*To Do to show new Followers*/
	this.newFollowersOverlay = function() {
		that.toastText('Feature coming soon!');
		localStorage.setItem('toastData', that.toastText());		
		goToView($.mobile.activePage.attr('id'));		
	}	
	
	this.newMessagesOverlayPopup = function() {
		//var tCount = JSON.parse(localStorage.getItem('enymNotifications')).length;
		if(JSON.parse(localStorage.getItem('enymNotifications')).length > 0) {
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
	this.newMessagesDisplayList = ko.observableArray([]);
	this.toastText = ko.observable();		
	
	this.activate = function() {
		that.showNewMessagesOverlay();
	}

	this.showNewMessagesOverlay = function() {
		that.newMessagesDisplayList.removeAll();
		$.each(JSON.parse(localStorage.getItem('enymNotifications')), function(indexNotification, valueNotification) {
			valueNotification.created = dateFormat2(valueNotification.created);
			if(valueNotification.escLevelId) {
				valueNotification.escLevelId = "icon-" + valueNotification.escLevelId.toLowerCase();
			}
			else {
				valueNotification.escLevelId = "icon-d";
			}
			that.newMessagesDisplayList.push(valueNotification);
		});
	}
	
	this.closePopup = function() {
		$('#newMessages').popup('close');
	}
	
	this.showSingleMessage = function(data) {
		localStorage.setItem("overlayCurrentChannel",JSON.stringify(data));
		//$('#newMessages').popup('close');
		//that.closePopup();
		goToView('channelSingleMessagesView');
	}
}
