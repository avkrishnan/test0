function HeaderViewModel() {	
	this.backText = ko.observable();
	this.isBack = ko.observable(true);	
	this.newMessageCount = ko.observable('');
	this.newMessageClass = ko.observable();
	
	that = this;
	/* Methods */
	this.activate = function() {
		if($.mobile.activePage.attr('id') == 'homeView') {
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
		if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
			setTimeout(function() {
				if(typeof ES.systemService.MnsCacheData.data != 'undefined') {
					showNewMessagesCount(ES.systemService.MnsCacheData.data.unreadCount);
					overlayViewModel.showNewMessagesOverlay();
				}
			}, 1000);
		}
		var callbacks = {
			success: function(responseDataSmry) {
				if(responseDataSmry && responseDataSmry.unreadCount > 0) {
					ES.systemService.getMsgNotifs({
						success: function(responseData) {
							ENYM.ctx.removeItem('enymNotifications');
							ENYM.ctx.setItem('enymNotifications', JSON.stringify(responseData.messagealert));
							if(JSON.parse(ENYM.ctx.getItem('enymNotifications')).length > 0) {
								overlayViewModel.showNewMessagesOverlay();
								showNewMessagesCount(JSON.parse(ENYM.ctx.getItem('enymNotifications')).length);
							}
						},
						error: function(data, status, details) {
							//var toastobj = {type: 'toast-error', text: details.message};
							//showToast(toastobj);
						}
					});
				}
				else {
					showNewMessagesCount(0);
					ENYM.ctx.removeItem('enymNotifications');
				}
			},
			error: function(data, status, details) {
				//var toastobj = {type: 'toast-error', text: details.message};
				//showToast(toastobj);									
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
			headerViewModel.newMessageClass('');
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
					goToView('homeView');
				}
				else {
					popBackNav();
				}				
		}
  };

	/*To Do to show new feature coming soon*/
	this.comingSoon = function() {
		var toastobj = {type: 'toast-info', text: 'Feature coming soon!'};
		showToast(toastobj);
	}	
	
	this.newMessagesOverlayPopup = function() {
		if(ENYM.ctx.getItem('enymNotifications')) {
			if(JSON.parse(ENYM.ctx.getItem('enymNotifications')).length > 0) {
				$('#newMessages').popup().popup('open', {x: 10, y:10});
			}
		}
		else {
			var toastobj = {type: 'toast-info', text: 'You dont have any new messages!'};
			showToast(toastobj);			
		}
		if(this.newMessageClass() == '') {
			var toastobj = {type: 'toast-info', text: 'You dont have any new messages!'};
			showToast(toastobj);		
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
	
	this.activate = function() {
		//that.showNewMessagesOverlay();
	}

	this.showNewMessagesOverlay = function() {
		overlayViewModel.newMessagesDisplayList.removeAll();
		var screenSizeText = truncatedText();
		$.each(JSON.parse(ENYM.ctx.getItem('enymNotifications')), function(indexNotification, valueNotification) {

			valueNotification.createdLong = formatDate(valueNotification.created, 'long');
			valueNotification.created = formatDate(valueNotification.created, 'short', 'main');

			valueNotification.fullText = jQuery.trim(valueNotification.text);
			valueNotification.text = '<em>'+valueNotification.created+'</em>:&nbsp;'+valueNotification.text;
			if(valueNotification.escLevelId && valueNotification.escLevelId != 'N' && valueNotification.escLevelId != 'F') {
				valueNotification.escLevelId = "iconchannels icon-" + valueNotification.escLevelId.toLowerCase();
				var messageType = 'msg-icon';
			}
			else if (valueNotification.escLevelId == 'N' || valueNotification.escLevelId == 'F') {
				valueNotification.escLevelId = '';
				var messageType = 'onlymsg';					
			}			
			else {
				valueNotification.escLevelId = "iconchannels icon-d";
			}
			if(valueNotification.ackRequested == 'Y' && valueNotification.acknowledged == 'N' && valueNotification.dismissed == 'N') {
				var iGiClass = 'igibutton';
				var messageType = 'igi-msg';	
			}
			else if(valueNotification.acknowledged == 'Y' && valueNotification.dismissed == 'N') {
				var iGiClass = 'igibutton igisent';
				var messageType = 'igi-msg';										
			}
			else {
				var iGiClass = '';
			}
			if(iGiClass != '' && valueNotification.escLevelId != '') {
				var messageType = '';
			}
			valueNotification.iGiClass = iGiClass;
			valueNotification.messageType = messageType;
			valueNotification.readClass = "read-" + valueNotification.read.toLowerCase();
			//alert(JSON.stringify(valueNotification));					
			overlayViewModel.newMessagesDisplayList.push(valueNotification);
		});
	}
	
	this.closePopup = function() {
		$('#newMessages').popup('close');
	}
	
	this.iGiAckOverlay = function(data, event) {
		//alert(event.currentTarget.parentNode.getAttribute('id'));
		var callbacks = {
			success: function(data) {
				var toastobj = {type: '', text: 'iGi Acknowledgement sent !'};
				showToast(toastobj);							
				//goToView($.mobile.activePage.attr('id'));																	
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);					
			}
		};					
		$.mobile.showPageLoadingMsg('a', 'Sending Acknowledgement request !');
//
		if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
			setTimeout(function() {			
				ES.systemService.adjMnsCount(-1);
				$("#"+event.currentTarget.parentNode.getAttribute('id')).remove();
			}, 1000);
			if(ES.systemService.MnsCacheData.data.unreadCount == 1) {
				$('#newMessages').remove();
			}
		}
		var tempEnymNotifications = [];
		tempEnymNotifications = JSON.parse(ENYM.ctx.getItem('enymNotifications'));
		if(tempEnymNotifications.length > 0) {
			$.each(tempEnymNotifications, function(indexNotification, valueNotification) {
				if(typeof valueNotification != 'undefined' && valueNotification.msgId == data.msgId) {
					tempEnymNotifications.splice(indexNotification,1)
				}					
			});
			setTimeout(function() {
				showNewMessagesCount(ES.systemService.MnsCacheData.data.unreadCount);
			}, 1000);				
			ENYM.ctx.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
		}	
//		
		return ES.messageService.acknowledgeMsg(data.msgId, callbacks);
	}	
	
	this.showSingleMessage = function(data) {
		ENYM.ctx.setItem("overlayCurrentChannel",JSON.stringify(data));
		//$('#newMessages').popup('close');
		//that.closePopup();
		var backText = getCurrentViewModel().viewname;	
		viewNavigate(backText, $.mobile.activePage.attr('id'), 'channelSingleMessagesView');
	}
}
