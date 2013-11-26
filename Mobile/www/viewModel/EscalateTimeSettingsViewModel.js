/*globals ko*/
/* To do - Pradeep Kumar */
function EscalateTimeSettingsViewModel() {
  var that = this;
  this.template = 'escalateTimeSettingsView';
  this.viewid = 'V-20d';
  this.viewname = 'EscalateTimeSettings';
  this.displayname = 'Escalate time settings';
	this.accountName = ko.observable();	
	
	/* Escalate date and time observable */
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
		monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];		
		if(token == '' || token == null) {
			goToView('loginView');					
		} 
		else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}
			that.accountName(localStorage.getItem('accountName'));			
			if(localStorage.getItem('escDuration')) {
				var DateTime = localStorage.getItem('escDuration').split('/');
				var day = DateTime[2].split(' ');
				var time = day[1].split(':');						
				that.month(DateTime[1]);			
				that.day(day[0]);
				that.year(DateTime[0]);			
				that.hour(time[0]);			
				that.minute(time[1]);			
				that.meridiem(day[2]);										
			} else {
				that.month(monthNames[_getDate('getMonth')]);			
				that.day(_getDate('getDate'));
				that.year(_getDate('getFullYear'));
				var hours = _getDate('getHours');
				hours = (hours<10?'0':'')+(hours>12?hours-12:hours);			
				that.hour(hours);
				var mins = _getDate('getMinutes');
				mins = ((mins<10?'0':'')+mins);			
				that.minute(mins);
				var meridiem = _getDate('getHours')>12?'PM':'AM';			
				that.meridiem(meridiem);							
			}
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Escalate Settings', 'escalateSettingsView', 'channelMenuView');		
  };
	
	this.upArrow = function (data) {
		localStorage.setItem('setValue', data);
		that.setUp();	
  };
	
	this.downArrow = function (data) {
		localStorage.setItem('setValue', data);	
		that.setDown();			
  };
	
	this.setUp = function () {
		if(localStorage.getItem('setValue') == 'month') {
			if(that.month() == 'Jan') {
				that.month('Dec');
			} else {
				that.month(monthNames[$.inArray( that.month(), monthNames)-1]);		
			}				
		} else if(localStorage.getItem('setValue') == 'day') {
			if(that.day() == 1) {
				that.day(31);
			} else {
				var day = that.day();
				day == day--;					
				that.day(day);		
			}			
		} else if(localStorage.getItem('setValue') == 'year') {
			that.year(that.year()-1);							
		} else if(localStorage.getItem('setValue') == 'hour') {
			if(that.hour() == 1) {
				that.hour(12);
			} else {
				var hour = that.hour();
				hour == hour--;					
				that.hour(hour);					
			}
		} else if(localStorage.getItem('setValue') == 'minute') {
			if(that.minute() == 01) {
				that.minute(60);
			} else {
				var minute = that.minute();
				minute == minute --;
				minute = ((minute<10?'0':'')+minute);					
				that.minute(minute);									
			}						
		} else if(localStorage.getItem('setValue') == 'meridiem') {
			if(that.meridiem() == 'PM') {
				that.meridiem('AM');
			} else {
				that.meridiem('PM');		
			}			
		}
	};
	
	this.setDown = function () {
		if(localStorage.getItem('setValue') == 'month') {
			if(that.month() == 'Dec') {
				that.month('Jan');
			} else {
				that.month(monthNames[$.inArray( that.month(), monthNames)+1]);		
			}			
		} else if(localStorage.getItem('setValue') == 'day') {
			if(that.day() == 31) {
				that.day(1);
			} else {
				var day = that.day();
				day == day++;					
				that.day(day);	
			}				
		} else if(localStorage.getItem('setValue') == 'year') {
			var year = that.year();
			year == year++;			
			that.year(year);				
		} else if(localStorage.getItem('setValue') == 'hour') {
			if(that.hour() == 12) {
				that.hour(1);
			} else {
				var hour = that.hour();
				hour == hour++;					
				that.hour(hour);		
			}				
		} else if(localStorage.getItem('setValue') == 'minute') {
			if(that.minute() == 60) {
				that.minute('01');
			} else {
				var minute = that.minute();
				minute == minute ++;				
				minute = ((minute<10?'0':'')+minute);					
				that.minute(minute);		
			}			
		} else if(localStorage.getItem('setValue') == 'meridiem') {
			if(that.meridiem() == 'PM') {
				that.meridiem('AM');
			} else {
				that.meridiem('PM');		
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