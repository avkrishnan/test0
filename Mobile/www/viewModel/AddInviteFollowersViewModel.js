/*globals ko*/
/* To do - Pradeep Kumar */
function AddInviteFollowersViewModel() {	
  var that = this;
	this.template = 'addInviteFollowersView';
	this.viewid = 'V-27';
	this.viewname = 'Add/Invite';
	this.displayname = 'Add/Invite Followers';	
	this.accountName = ko.observable();	
	
  /* Add/Invite Followers observable */
	this.channelName = ko.observable();	
	this.channelWebAddress = ko.observable();			
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		if(authenticate()) {
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
			if(!channelObject) {
				goToView('channelsIOwnView');			
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message						
				that.accountName(ENYM.ctx.getItem('accountName'));	
				var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
				if(ENYM.ctx.getItem('counter') == 1) {
					ENYM.ctx.setItem('counter', 2);
				} else if(ENYM.ctx.getItem('counter') == 2){		
					ENYM.ctx.setItem('counter', 3);
				}	else if(ENYM.ctx.getItem('counter') == 3){
					ENYM.ctx.setItem('counter', 4);
				}	else {
					ENYM.ctx.setItem('counter', 1);
				}										
				that.channelName(channelObject.channelName);
				that.channelWebAddress(channelObject.channelName+'.evernym.com');			
			}
		}
	}
	
	this.comingSoon = function(){
		headerViewModel.comingSoon();	
	};	
	
}