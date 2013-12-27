/*globals ko*/
/* To do - Pradeep Kumar */
function EscalateTimeSettingsViewModel() {
  var that = this;
  this.template = 'escalateTimeSettingsView';
  this.viewid = 'V-20d';
  this.viewname = 'Escalate Time';
  this.displayname = 'Escalate time';
	this.accountName = ko.observable();	
	
	/* Escalate date and time observable */
	this.month = ko.observable();
	this.day = ko.observable();
	this.year = ko.observable();
	this.hour = ko.observable();
	this.minute = ko.observable();
	this.meridiem = ko.observable();
	this.pickerDate = ko.observable();				 				
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  

	this.activate = function() {
		monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];		
		if(authenticate()) {
			addExternalMarkup(that.template); // this is for header/overlay message					
			that.accountName(appCtx.getItem('accountName'));			
			if(appCtx.getItem('escDuration')) {
				var DateTime = appCtx.getItem('escDuration').split('/');
				var day = DateTime[2].split(' ');
				var time = day[1].split(':');						
				that.month(DateTime[1]);			
				that.day(day[0]);
				that.year(DateTime[0]);			
				that.hour(time[0]);			
				that.minute(time[1]);			
				that.meridiem(day[2]);
				//that.pickerDate('Escalate until: '+that.month()+' '+that.day()+', '+that.year()+', '+that.hour()+':'+that.minute()+' '+that.meridiem());
				that.pickerDate('Escalate until: ' + that.hour() + ':' + that.minute() + ' ' + that.meridiem() + ', ' + that.month() + '. ' + that.day() + ', ' + that.year());
			} else {
				that.month(monthNames[_getDate('getMonth')]);			
				that.day(_getDate('getDate'));
				that.year(_getDate('getFullYear'));
				var hours = _getDate('getHours');
				hours = (hours<10?'0':'')+(hours>12?hours-12:hours);			
				that.hour(hours);
				var mins = _getDate('getMinutes');
				mins = ((mins+1<10?'0':'')+(mins+1));			
				that.minute(mins);
				var meridiem = _getDate('getHours')>11?'PM':'AM';			
				that.meridiem(meridiem);
				//that.pickerDate('Escalate until: '+that.month()+' '+that.day()+', '+that.year()+', '+that.hour()+':'+that.minute()+' '+that.meridiem());
				that.pickerDate('Escalate until: ' + that.hour() + ':' + that.minute() + ' ' + that.meridiem() + ', ' + that.month() + '. ' + that.day() + ', ' + that.year());
			}
		}
	}
	
	this.upArrow = function (data) {
		appCtx.setItem('setValue', data);
		that.setUp();			
  };
	
	this.downArrow = function (data) {
		appCtx.setItem('setValue', data);	
		that.setDown();			
  };
	
	this.setUp = function () {
		if(appCtx.getItem('setValue') == 'month') {
			if(that.month() == 'Dec') {
				that.month('Jan');
			} else {
				that.month(monthNames[$.inArray( that.month(), monthNames)+1]);		
			}			
		} else if(appCtx.getItem('setValue') == 'day') {
			if(that.day() == 31) {
				that.day(1);
			} else {
				var day = that.day();
				day == day++;					
				that.day(day);	
			}				
		} else if(appCtx.getItem('setValue') == 'year') {
			var year = that.year();
			year == year++;			
			that.year(year);				
		} else if(appCtx.getItem('setValue') == 'hour') {
			if(that.hour() == 12) {
				that.hour(1);
			} else {
				var hour = that.hour();
				hour == hour++;					
				that.hour(hour);		
			}				
		} else if(appCtx.getItem('setValue') == 'minute') {
			if(that.minute() == 59) {
				that.minute('00');
			} else {
				var minute = that.minute();
				minute == minute ++;				
				minute = ((minute<10?'0':'')+minute);					
				that.minute(minute);		
			}			
		} else if(appCtx.getItem('setValue') == 'meridiem') {
			if(that.meridiem() == 'PM') {
				that.meridiem('AM');
			} else {
				that.meridiem('PM');		
			}			
		}
		//that.pickerDate('Escalate until: '+that.month()+' '+that.day()+', '+that.year()+', '+that.hour()+':'+that.minute()+' '+that.meridiem());
		that.pickerDate('Escalate until: ' + that.hour() + ':' + that.minute() + ' ' + that.meridiem() + ', ' + that.month() + '. ' + that.day() + ', ' + that.year());
	};	
	
	this.setDown = function () {
		if(appCtx.getItem('setValue') == 'month') {
			if(that.month() == 'Jan') {
				that.month('Dec');
			} else {
				that.month(monthNames[$.inArray( that.month(), monthNames)-1]);		
			}				
		} else if(appCtx.getItem('setValue') == 'day') {
			if(that.day() == 1) {
				that.day(31);
			} else {
				var day = that.day();
				day == day--;					
				that.day(day);		
			}			
		} else if(appCtx.getItem('setValue') == 'year') {
			that.year(that.year()-1);							
		} else if(appCtx.getItem('setValue') == 'hour') {
			if(that.hour() == 1) {
				that.hour(12);
			} else {
				var hour = that.hour();
				hour == hour--;					
				that.hour(hour);					
			}
		} else if(appCtx.getItem('setValue') == 'minute') {
			if(that.minute() == 00) {
				that.minute(59);
			} else {
				var minute = that.minute();
				minute == minute --;
				minute = ((minute<10?'0':'')+minute);					
				that.minute(minute);									
			}						
		} else if(appCtx.getItem('setValue') == 'meridiem') {
			if(that.meridiem() == 'PM') {
				that.meridiem('AM');
			} else {
				that.meridiem('PM');		
			}			
		}
		//that.pickerDate('Escalate until: '+that.month()+' '+that.day()+', '+that.year()+', '+that.hour()+':'+that.minute()+' '+that.meridiem());
		that.pickerDate('Escalate until: ' + that.hour() + ':' + that.minute() + ' ' + that.meridiem() + ', ' + that.month() + '. ' + that.day() + ', ' + that.year());
	};					
	
	this.saveCommand = function () {
		var duration = that.year()+'/'+that.month()+'/'+that.day()+' '+that.hour()+':'+that.minute()+' '+that.meridiem();
		var CurrentDate = new Date();
		var SelectedDate = new Date(duration);		
		if(SelectedDate >= CurrentDate){
			appCtx.setItem('escDuration', duration);		
			popBackNav();				
		}					
		else {	
			var toastobj = {type: 'toast-error', text: 'Please set date greater than current date !'};
			showToast(toastobj);						
		}
  };					
	
}