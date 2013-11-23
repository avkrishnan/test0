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
	//this.startDate = ko.observable("@(Html.Raw(Model.Holiday.StartDate.ToString("dd/MM/yyyy")))");
	//this.endDate = ko.observable("@(Html.Raw(Model.Holiday.EndDate.ToString("dd/MM/yyyy")))");
	this.month = ko.observable('Oct');
	this.day = ko.observable('28');
	this.year = ko.observable('2013');
	this.hour = ko.observable('02');
	this.minute = ko.observable('28');
	this.meridiem = ko.observable('PM');			 	
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
	
	this.upArrow = function () {
		/*this.month();
		this.day();
		this.year();
		this.hour();
		this.minute();
		this.meridiem ();*/		
  };
	
	this.downArrow = function () {
		/*this.month();
		this.day();
		this.year();
		this.hour();
		this.minute();
		this.meridiem();*/		
  };			
	
	this.saveCommand = function () {
		localStorage.setItem('escDuration', that.year()+'/'+that.month()+'/'+that.day()+' '+that.hour()+':'+that.minute()+' '+that.meridiem());		
		goToView('escalateSettingsView');					
  };				
	
	this.userSettings = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'escalationPlansView');
  };		
	
}