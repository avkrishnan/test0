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
	this.escalationType = ko.observable();	
	this.escalateUntil = ko.observable();	
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
				that.escalationType('"Hound"');																													
			} else if(localStorage.getItem('escLevel') == 'C') {
				that.chaseClass('broadcasticon');
				localStorage.setItem('escLevel', 'C');															
				that.escalationType('"Chase"');				
			} else {
				that.remindClass('timesensitiveicon');
				localStorage.setItem('escLevel', 'R');															
				that.escalationType('"Remind"');				
			}
			if(localStorage.getItem('escDuration')) {
				var DateTime = localStorage.getItem('escDuration').split('/');
				var day = DateTime[2].split(' ');
				var time = day[1].split(':');						
				//that.month(DateTime[1]);			
				//that.day(day[0]);
				//that.year(DateTime[0]);			
				//that.hour(time[0]);			
				//that.minute(time[1]);			
				//that.meridiem(day[2]);
				that.escalateUntil(' until: '+DateTime[1]+' '+day[0]+', '+DateTime[0]+', '+time[0]+':'+time[1]+' '+day[2]);														
			} else {
				//that.month(monthNames[_getDate('getMonth')]);			
				//that.day(_getDate('getDate'));
				//that.year(_getDate('getFullYear'));
				var hours = _getDate('getHours');
				hours = (hours<10?'0':'')+(hours>12?hours-12:hours);			
				//that.hour(hours);
				var mins = _getDate('getMinutes');
				mins = ((mins+1<10?'0':'')+(mins+1));			
				//that.minute(mins);
				var meridiem = _getDate('getHours')>11?'PM':'AM';			
				//that.meridiem(meridiem);
				that.escalateUntil(' until: '+monthNames[_getDate('getMonth')]+' '+_getDate('getDate')+', '+_getDate('getFullYear')+', '+hours+':'+mins+' '+meridiem);														
			}						
		}
	}	
	
	this.remindActive = function () {
		that.remindClass('timesensitiveicon ');
		that.chaseClass('');
		that.houndClass('');
		localStorage.setItem('escLevel', 'R');
		that.escalationType('"Remind"');					
  };
	
	this.chaseActive = function () {
		that.remindClass('');
		that.chaseClass('broadcasticon');
		that.houndClass('');
		localStorage.setItem('escLevel', 'C');
		that.escalationType('"Chase"');							
  };
	
	this.houndActive = function () {		
		that.remindClass('');
		that.chaseClass('');
		that.houndClass('criticalicon');
		localStorage.setItem('escLevel', 'H');
		that.escalationType('"Hound"');							
  };
	
	this.saveCommand = function () {
		localStorage.setItem('escalate', 'yes');		
	  popBackNav();					
  };						
	
}