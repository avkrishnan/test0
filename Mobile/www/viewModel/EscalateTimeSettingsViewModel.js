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
	this.month = ko.observable();
	this.day = ko.observable();
	this.year = ko.observable();
	this.hour = ko.observable();
	this.minute = ko.observable();
	this.meridiem = ko.observable();			 	
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
			var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];			
			that.month(monthNames[_getDate('getMonth')]);			
			that.day(_getDate('getDate'));
			that.year(_getDate('getFullYear'));
			var hours = _getDate('getHours');
			hours = (hours<10?'0':'')+hours-12==0?'12':hours-12;			
			that.hour(hours);
			var mins = _getDate('getMinutes');
			mins = ((mins<10?'0':'')+mins);			
			that.minute(mins);
			var meridiem = _getDate('getHours')>12?'PM':'AM';			
			that.meridiem(meridiem);												
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'channelMenuView');		
  };
	
	this.upArrow = function (data) {
		localStorage.setItem('setValue', data);
		that.setUp();		
		/*this.month();
		this.day();
		this.year();
		this.hour();
		this.minute();
		this.meridiem ();*/		
  };
	
	this.downArrow = function (data) {
		localStorage.setItem('setValue', data);	
		that.setDown();		
		/*this.month();
		this.day();
		this.year();
		this.hour();
		this.minute();
		this.meridiem();*/		
  };
	
	this.setUp = function () {
		alert(localStorage.getItem('setValue'));
		if(localStorage.getItem('setValue') == 'month') {
			if(that.month() == 'Jan') {
				that.month('Dec');
			} else {
				that.month(monthNames[$.inArray( that.month(), monthNames)-1]);		
			}				
		} else if(localStorage.getItem('setValue') == 'day') {
			if(that.day() == 1) {
				that.day('31');
			} else {
				that.day(that.day()-1);		
			}			
		} else if(localStorage.getItem('setValue') == 'year') {
			that.year(that.year()-1);							
		} else if(localStorage.getItem('setValue') == 'hour') {
			if(that.hour() == 1) {
				that.hour('12');
			} else {
				that.hour(that.hour()-1);		
			}
		} else if(localStorage.getItem('setValue') == 'minute') {
			if(that.minute() == 1) {
				that.minute('60');
			} else {
				that.minute(that.minute()-1);		
			}						
		} else if(localStorage.getItem('setValue') == 'meridiem') {
			if(that.meridiem() == 1) {
				that.meridiem('31');
			} else {
				that.meridiem(that.meridiem()-1);		
			}			
		}
	};
	
	this.setDown = function () {
		alert(localStorage.getItem('setValue'));
		if(localStorage.getItem('setValue') == 'month') {
			if(that.month() == 'Dec') {
				that.month('Jan');
			} else {
				that.month(monthNames[$.inArray( that.month(), monthNames)+1]);		
			}			
		} else if(localStorage.getItem('setValue') == 'day') {
			if(that.day() == 31) {
				that.day('1');
			} else {
				that.day(that.day()+1);	
			}				
		} else if(localStorage.getItem('setValue') == 'year') {
			that.year(that.year()+1);				
		} else if(localStorage.getItem('setValue') == 'hour') {
			if(that.hour() == 12) {
				that.hour('1');
			} else {
				that.minute(that.minute()+1);		
			}				
		} else if(localStorage.getItem('setValue') == 'minute') {
			if(that.minute() == 60) {
				that.minute('1');
			} else {
				that.minute(that.minute()+1);		
			}			
		} else if(localStorage.getItem('setValue') == 'month') {
			if(that.day() == 1) {
				that.day('31');
			} else {
				that.day(that.day()-1);		
			}			
		}							
	};					
	
	this.saveCommand = function () {
		localStorage.setItem('escDuration', that.year()+'/'+that.month()+'/'+that.day()+' '+that.hour()+':'+that.minute()+' '+that.meridiem());		
		goToView('escalateSettingsView');					
  };				
	
	this.userSettings = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'escalationPlansView');
  };		
	
}