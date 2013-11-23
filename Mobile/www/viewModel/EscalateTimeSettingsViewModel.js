/*globals ko*/
/* To do - Pradeep Kumar */
function EscalateTimeSettingsViewModel() {
  var that = this;
  this.template = 'escalateTimeSettingsView';
  this.viewid = 'V-20d';
  this.viewname = 'EscalateTimeSettings';
  this.displayname = 'Escalate time settings';
	this.accountName = ko.observable();	
	
	/* Privacy policy observable */
	this.toastText = ko.observable();			
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  

	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');					
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));									
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'channelMenuView');		
  };	
	
	this.saveCommand = function () {
			goToView('escalateSettingsView');					
  };				
	
	this.userSettings = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'escalationPlansView');
  };		
	
}