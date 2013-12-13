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
		}
		else {
			that.backText('<em></em>'+backNavText[backNavText.length-1]);
		}
		//if($.isEmptyObject(ES.systemService.MnsCacheData)) {
			this.updateBadges();
		//}
	}
	
	/* This function changes badge count as per the new api*/
	this.updateBadges = function() {
		if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
			setTimeout(function() {
				showNewMessagesCount(ES.systemService.MnsCacheData.data.unreadCount);
				overlayViewModel.showNewMessagesOverlay();
			}, 1000);					
			//overlayViewModel.showNewMessagesOverlay();
		}
		var callbacks = {
			success: function(responseDataSmry) {
				if(responseDataSmry && responseDataSmry.unreadCount > 0) {
					ES.systemService.getMsgNotifs({
						success: function(responseData) {
							localStorage.removeItem('enymNotifications');
							localStorage.setItem('enymNotifications', JSON.stringify(responseData.messagealert));
							if(JSON.parse(localStorage.getItem('enymNotifications')).length > 0) {
								overlayViewModel.showNewMessagesOverlay();
								showNewMessagesCount(JSON.parse(localStorage.getItem('enymNotifications')).length);
							}						
						},
						error: function(data, status, details) {
							that.toastText(details.message);
							showToast();
						}
					});
				}
				else {
					showNewMessagesCount(0);
					localStorage.removeItem('enymNotifications');
				}
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				showToast();									
			}
		};
		ES.systemService.getMsgNotifsSmry_C(callbacks);
	}
	
	/* This Function shows Count of New Message in header badge*/
	showNewMessagesCount = function(badgeCountData) {
		if(badgeCountData > 0) {
			headerViewModel.newMessageClass('smsiconwhite');
			headerViewModel.newMessageCount(badgeCountData);
		}
		else {
			headerViewModel.newMessageCount('');
		}
	}
	
	/* This Function shows New Messages in overlay*/
	showNewMessagesList = function(badgeCountData) {
		if(badgeCountData > 0) {
			headerViewModel.newMessageClass('smsiconwhite');
			headerViewModel.newMessageCount(badgeCountData);
		}
		else {
			headerViewModel.newMessageCount('');
		}
	}	
	
	this.backCommand = function (data, event) {
		var activeViewModel = event.currentTarget.parentNode.parentNode.parentNode.getAttribute('id');
		//alert(activeViewModel);
		switch(activeViewModel) {
			case 'addContactView':
				if(addContactViewModel.showConfirm() == true) {
					addContactViewModel.showDelete(true);				
					addContactViewModel.showConfirm(false);
				}
				else if(addContactViewModel.showDelete() == true) {			
					addContactViewModel.showDelete(false);
					goToView('addContactView');	
				}
				else {
					popBackNav();
				}
				break;
			default:
				if(typeof backNavText[0] == 'undefined') {
					goToView('channelListView');
				}
				else {
					popBackNav();
				}				
		}
		//addContactView.currentDeleteCommethod();
		/*if(typeof backNavText[0] == 'undefined') {
			goToView('channelListView');
		}
		else {
			popBackNav();
		}*/
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
		if(localStorage.getItem('enymNotifications')) {
			if(JSON.parse(localStorage.getItem('enymNotifications')).length > 0) {
				$('#newMessages').popup().popup('open', {x: 10, y:10});	
			}
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
	this.toastClass = ko.observable();	
	
	this.activate = function() {
		//that.showNewMessagesOverlay();
	}

	this.showNewMessagesOverlay = function() {
		overlayViewModel.newMessagesDisplayList.removeAll();
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
			if(valueNotification.ackRequested == 'Y' && valueNotification.acknowledged == 'N' && valueNotification.dismissed == 'N') {
				var iGiClass = 'igibutton';		
			}
			else if(valueNotification.acknowledged == 'Y' && valueNotification.dismissed == 'N') {
				var iGiClass = 'igibutton igisent';										
			}
			else {
				var iGiClass = '';
			}
			valueNotification.iGiClass = iGiClass;								
			overlayViewModel.newMessagesDisplayList.push(valueNotification);
		});
	}
	
	this.closePopup = function() {
		$('#newMessages').popup('close');
	}
	
	this.iGiAckOverlay = function(data) {
		var callbacks = {
			success: function(data) {
				that.toastText('iGi Acknowledgement sent !');
				localStorage.setItem('toastData', that.toastText());			
				goToView($.mobile.activePage.attr('id'));																	
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				localStorage.setItem('toastData', that.toastText());
				goToView($.mobile.activePage.attr('id'));						
			}
		};					
		$.mobile.showPageLoadingMsg('a', 'Sending Acknowledgement request !');		
		return ES.messageService.acknowledgeMsg(data.msgId, callbacks);								
	}	
	
	this.showSingleMessage = function(data) {
		localStorage.setItem("overlayCurrentChannel",JSON.stringify(data));
		//$('#newMessages').popup('close');
		//that.closePopup();
		var backText = getCurrentViewModel().viewname;	
		viewNavigate(backText, $.mobile.activePage.attr('id'), 'channelSingleMessagesView');
	}
}
