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
			if(localStorage.getItem('escLevel') == 'R') {
				that.remindClass('timesensitiveicon');
				localStorage.setItem('escLevel', 'R');															
			} else if(localStorage.getItem('escLevel') == 'C') {
				that.chaseClass('broadcasticon');
				localStorage.setItem('escLevel', 'C');															
			} else {
				that.houndClass('criticalicon');
				localStorage.setItem('escLevel', 'H');															
			}
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
		localStorage.setItem('escLevel', 'R');					
  };
	
	this.chaseActive = function () {
		that.remindClass('');
		that.chaseClass('broadcasticon');
		that.houndClass('');
		localStorage.setItem('escLevel', 'C');					
  };
	
	this.houndActive = function () {
		that.remindClass('');
		that.chaseClass('');
		that.houndClass('criticalicon');
		localStorage.setItem('escLevel', 'H');					
  };
	
	this.saveCommand = function () {
		localStorage.setItem('escalate', 'yes');		
	  goToView('sendMessageView');					
  };				
	
	this.userSettings = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'escalationPlansView');
  };		
	
}