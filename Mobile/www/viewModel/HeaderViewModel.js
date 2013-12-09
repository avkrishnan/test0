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
		} 
		else {
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
		}
		this.updateBadges();	
	}
	
	/* This function changes badge count as per the new api*/
	this.updateBadges = function() {
		ES.systemService.getMsgNotifsSmry({
			success: function(responseData) {
				if(responseData.unreadCount > 0) {
					headerViewModel.newMessageCount(responseData.unreadCount)
					ES.systemService.getMsgNotifs({
						success: function(responseData) {
							localStorage.removeItem('enymNotifications');
							localStorage.setItem('enymNotifications', JSON.stringify(responseData.messagealert));
							if(JSON.parse(localStorage.getItem('enymNotifications')).length > 0) {
								overlayViewModel.showNewMessagesOverlay();
							}			
						},
						error: function(data, status, details) {
							that.toastText(details.message);
							localStorage.setItem('toastData', that.toastText());
						}
					});			
				}
				else {
					headerViewModel.newMessageCount('');
					headerViewModel.newMessageClass('');			
				}
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				localStorage.setItem('toastData', that.toastText());				
			}
		});		
	}
	
	/* This Function shows Count of New Message in header badge*/
	this.showNewMessagesCount = function(data) {
		//alert(JSON.parse(data).length);
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
		} 
		else {		
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
		var backText = getCurrentViewModel().viewname;	
		viewNavigate(backText, $.mobile.activePage.attr('id'), 'channelMenuView');		
  };
		
}
/* overlay messages*/
function OverlayViewModel() {
	that = this;
	this.newMessagesDisplayList = ko.observableArray([]);
	this.toastText = ko.observable();
	
	this.activate = function() {
		//that.showNewMessagesOverlay();
	}

	this.showNewMessagesOverlay = function() {
		that.newMessagesDisplayList.removeAll();
		var screenSizeText = truncatedText();
		$.each(JSON.parse(localStorage.getItem('enymNotifications')), function(indexNotification, valueNotification) {
			valueNotification.created = shortFormat(valueNotification.created);
			valueNotification.fullText = jQuery.trim(valueNotification.text);
			if(valueNotification.text.length > screenSizeText) {
				valueNotification.text = jQuery.trim(valueNotification.text).substring(0, screenSizeText).split(" ").slice(0, -1).join(" ") + "...";
			}
			if(valueNotification.escLevelId && valueNotification.escLevelId != 'N' && valueNotification.escLevelId != 'F') {
				valueNotification.escLevelId = "iconchannels icon-" + valueNotification.escLevelId.toLowerCase();
			}
			else if (valueNotification.escLevelId == 'N' || valueNotification.escLevelId == 'F') {
				valueNotification.escLevelId = '';						
			}			
			else {
				valueNotification.escLevelId = "iconchannels icon-d";
			}
			if(valueNotification.ackRequested == 'Y' && valueNotification.acknowledged == 'N') {
				var iGiClass = 'igibutton';
				valueNotification.iGiClass = 'igibutton';			
			}
			else if(valueNotification.acknowledged == 'Y') {
				var iGiClass = 'igibutton igisent';
				valueNotification.iGiClass = 'igibutton igisent';										
			}
			else {
				var iGiClass = '';
				valueNotification.iGiClass = '';										
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
		if($.mobile.activePage.attr('id') == 'channelSingleMessagesView') {
			popBackNav();			
		}		
		var backText = getCurrentViewModel().viewname;	
		viewNavigate(backText, $.mobile.activePage.attr('id'), 'channelSingleMessagesView');
	}
}
