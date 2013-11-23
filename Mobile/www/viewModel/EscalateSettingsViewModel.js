/*globals ko*/
/* To do - Pradeep Kumar */
function EscalateSettingsViewModel() {
  var that = this;
  this.template = 'escalateSettingsView';
  this.viewid = 'V-20c';
  this.viewname = 'EscalateSettings';
  this.displayname = 'Escalate Settings';
	this.accountName = ko.observable();	
	
	/* Privacy policy observable */
	this.remindClass = ko.observable();
	this.chaseClass = ko.observable();
	this.houndClass = ko.observable();			
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
			that.remindClass();
			that.chaseClass();
			that.houndClass('criticalicon');												
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'channelMenuView');		
  };
	
	this.setDateTime = function () {
		goToView('escalateTimeSettingsView');					
	};	
	
	this.remindActive = function () {
		that.remindClass('timesensitiveicon ');
		that.chaseClass('');
		that.houndClass('');
		localStorage.setItem('escLevel', that.remindClass());					
  };
	
	this.chaseActive = function () {
		that.remindClass('');
		that.chaseClass('broadcasticon');
		that.houndClass('');
		localStorage.setItem('escLevel', that.chaseClass());					
  };
	
	this.houndActive = function () {
		that.remindClass('');
		that.chaseClass('');
		that.houndClass('criticalicon');
		localStorage.setItem('escLevel', that.houndClass());					
  };
	
	this.saveCommand = function () {
			pushBackNav('Escalate Settings', 'escalateSettingsView', 'sendMessageView');					
  };				
	
	this.userSettings = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'escalationPlansView');
  };		
	
}