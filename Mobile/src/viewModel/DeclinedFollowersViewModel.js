﻿function DeclinedFollowersViewModel() {
  var self = this;
	self.template = 'declinedFollowersView';
	self.viewid = 'V-??';
	self.viewname = 'Declined Invites';
	self.displayname = 'Declined Invites';
	
	self.evernymIcon = ko.observable(false);	
  self.inputObs = [ 'channelId', 'channelName', 'declinesCount'];
	self.defineObservables();	
  self.followers = ko.observableArray([]);
	  
	self.activate = function() {			
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));				
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {				
			addExternalMarkup(self.template); // this is for header/overlay message
			self.evernymIcon(false);
			self.followers.removeAll();
			self.declinesCount('');																										
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);																						
			$.mobile.showPageLoadingMsg('a', 'Loading Declined Followers');		
			return ES.channelService.getFollowers(self.channelId(), { success: successfulList, error: errorAPI });
		}
	};
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		name = fullnameClass = '';
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(valueFollower.relationship == 'D') {
				var visibleName = true;
				var evernymIcon = false;
				if(valueFollower.managed == 'N') {
					var nameClass = 'normalfollowers';
					var evernym = true
					var evernymIcon = true;
				}
				else {						
					var nameClass = 'provisionalicon noname';
					var evernym = false																			
				}
				if(typeof valueFollower.firstname == 'undefined' && typeof valueFollower.lastname == 'undefined') {
					if(valueFollower.managed == 'Y') {
						name = valueFollower.comMethods[0].address;
					}
					else {
						name = '';
						nameClass = nameClass+' noname';
					}
					visibleName = false;
					fullnameClass = '';
				} 
				else if(typeof valueFollower.firstname == 'undefined') {
					name = valueFollower.lastname;
					fullnameClass = 'name';				
				}
				else if(typeof valueFollower.lastname == 'undefined') {
					name = valueFollower.firstname;
					fullnameClass = 'name';		
				} else if(valueFollower.firstname == '' && valueFollower.lastname == '') {
					if(valueFollower.managed == 'Y') {
						name = valueFollower.comMethods[0].address;
					} else {
						name = '';
						nameClass = nameClass+' noname';
					}
					visibleName = false;
					fullnameClass = '';				
				} else {
					name = valueFollower.firstname +' '+ valueFollower.lastname;
					fullnameClass = 'name';
				}
				var evernymIconClass = (evernymIcon == false)?'normalinvitation':'';
				self.followers.push({
					followerId: valueFollower.id,
					nameClass: nameClass,
					visibleName: visibleName,
					followerName: name,
					fullnameClass: fullnameClass,
					accountname: valueFollower.accountname,
					reachable: valueFollower.accountname,				
					evernym: evernym,					
					evernymIcon: evernymIcon,
					evernymIconClass: evernymIconClass,
					type: valueFollower.managed
				});
				self.declinesCount(self.followers().length);
				ENYM.ctx.setItem('lastStatus', self.followers().length);
			}
		});
	}; 
	
  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);		
  };
	
	self.followerDetails = function (data) {
		ENYM.ctx.setItem('currentfollowerData', JSON.stringify(data));		
		viewNavigate('Declined Invites', 'declinedFollowersView', 'followerDetailsView');
  };
}

DeclinedFollowersViewModel.prototype = new ENYM.ViewModel();
DeclinedFollowersViewModel.prototype.constructor = DeclinedFollowersViewModel;