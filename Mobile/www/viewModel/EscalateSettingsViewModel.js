/*globals ko*/
/* To do - Pradeep Kumar */
function EscalateSettingsViewModel() {
  var that = this;
  this.template = 'escalateSettingsView';
  this.viewid = 'V-20c';
  this.viewname = 'Escalate Settings';
  this.displayname = 'Escalate Settings';
	this.accountName = ko.observable();	
	
	/* Escalate settings observable */
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
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));
			that.remindClass('');
			that.chaseClass('');
			that.houndClass('');
			if(localStorage.getItem('escLevel') == 'H') {
				that.houndClass('criticalicon');
				localStorage.setItem('escLevel', 'H');																														
			} else if(localStorage.getItem('escLevel') == 'C') {
				that.chaseClass('broadcasticon');
				localStorage.setItem('escLevel', 'C');															
			} else {
				that.remindClass('timesensitiveicon');
				localStorage.setItem('escLevel', 'R');															
			}
		}
	}	
	
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
	  popBackNav();					
  };						
	
}