function EscalateTimeSettingsViewModel() {
  var self = this;
  self.template = 'escalateTimeSettingsView';
  self.viewid = 'V-20d';
  self.viewname = 'Escalate Time';
  self.displayname = 'Escalate time';
	
  self.inputObs = [ 'month', 'day', 'year', 'hour', 'minute', 'meridiem', 'pickerDate' ];
  self.defineObservables();	

	self.activate = function() {
		monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];		
		addExternalMarkup(self.template); // this is for header/overlay message		
		if(ENYM.ctx.getItem('escDuration')) {
			self.month(moment(ENYM.ctx.getItem('escDuration')).format('MMM'));		
			self.day(moment(ENYM.ctx.getItem('escDuration')).format('D'));
			self.year(moment(ENYM.ctx.getItem('escDuration')).format('YYYY'));			
			self.hour(moment(ENYM.ctx.getItem('escDuration')).format('h'));			
			self.minute(moment(ENYM.ctx.getItem('escDuration')).format('m'));			
			self.meridiem(moment(ENYM.ctx.getItem('escDuration')).format('A'));
			self.pickerDate('Escalate until: ' + moment(ENYM.ctx.getItem('escDuration')).format('h:m A, MMM. D, YYYY'));
		} else {
			self.month(monthNames[_getDate('getMonth')]);			
			self.day(_getDate('getDate'));
			self.year(_getDate('getFullYear'));
			var hours = _getDate('getHours');
			hours = (hours<10?'0':'')+(hours>12?hours-12:hours);			
			self.hour(hours);
			var mins = _getDate('getMinutes');
			mins = ((mins+1<10?'0':'')+(mins));			
			self.minute(mins);
			var meridiem = _getDate('getHours')>11?'PM':'AM';			
			self.meridiem(meridiem);
			self.pickerDate('Escalate until: ' + self.hour() + ':' + self.minute() + ' ' + self.meridiem() + ', ' + self.month() + '. ' + self.day() + ', ' + self.year());
		}
	};
	
	self.upArrow = function (data) {
		ENYM.ctx.setItem('setValue', data);
		self.setUp();			
  };
	
	self.downArrow = function (data) {
		ENYM.ctx.setItem('setValue', data);	
		self.setDown();			
  };
	
	self.setUp = function () {
		if(ENYM.ctx.getItem('setValue') == 'month') {
			if(self.month() == 'Dec') {
				self.month('Jan');
			} else {
				self.month(monthNames[$.inArray( self.month(), monthNames)+1]);		
			}			
		} else if(ENYM.ctx.getItem('setValue') == 'day') {
			if(self.day() == 31) {
				self.day(1);
			} else {
				var day = self.day();
				day == day++;					
				self.day(day);	
			}				
		} else if(ENYM.ctx.getItem('setValue') == 'year') {
			var year = self.year();
			year == year++;			
			self.year(year);				
		} else if(ENYM.ctx.getItem('setValue') == 'hour') {
			if(self.hour() == 12) {
				self.hour(1);
			} else {
				var hour = self.hour();
				hour == hour++;					
				self.hour(hour);		
			}				
		} else if(ENYM.ctx.getItem('setValue') == 'minute') {
			if(self.minute() == 59) {
				self.minute('00');
			} else {
				var minute = self.minute();
				minute == minute ++;				
				minute = ((minute<10?'0':'')+minute);					
				self.minute(minute);		
			}			
		} else if(ENYM.ctx.getItem('setValue') == 'meridiem') {
			if(self.meridiem() == 'PM') {
				self.meridiem('AM');
			} else {
				self.meridiem('PM');		
			}			
		}
		self.pickerDate('Escalate until: ' + self.hour() + ':' + self.minute() + ' ' + self.meridiem() + ', ' + self.month() + '. ' + self.day() + ', ' + self.year());
	};	
	
	self.setDown = function () {
		if(ENYM.ctx.getItem('setValue') == 'month') {
			if(self.month() == 'Jan') {
				self.month('Dec');
			} else {
				self.month(monthNames[$.inArray( self.month(), monthNames)-1]);		
			}				
		} else if(ENYM.ctx.getItem('setValue') == 'day') {
			if(self.day() == 1) {
				self.day(31);
			} else {
				var day = self.day();
				day == day--;					
				self.day(day);		
			}			
		} else if(ENYM.ctx.getItem('setValue') == 'year') {
			self.year(self.year()-1);							
		} else if(ENYM.ctx.getItem('setValue') == 'hour') {
			if(self.hour() == 1) {
				self.hour(12);
			} else {
				var hour = self.hour();
				hour == hour--;					
				self.hour(hour);					
			}
		} else if(ENYM.ctx.getItem('setValue') == 'minute') {
			if(self.minute() == 00) {
				self.minute(59);
			} else {
				var minute = self.minute();
				minute == minute --;
				minute = ((minute<10?'0':'')+minute);					
				self.minute(minute);									
			}						
		} else if(ENYM.ctx.getItem('setValue') == 'meridiem') {
			if(self.meridiem() == 'PM') {
				self.meridiem('AM');
			} else {
				self.meridiem('PM');		
			}			
		}
		self.pickerDate('Escalate until: ' + self.hour() + ':' + self.minute() + ' ' + self.meridiem() + ', ' + self.month() + '. ' + self.day() + ', ' + self.year());
	};					
	
	self.saveCommand = function () {
		
		var duration = self.year()+'/'+self.month()+'/'+self.day()+' '+self.hour()+':'+self.minute()+' '+self.meridiem();
		/*var CurrentDate = new Date();
		var CurrentDate = moment();
		alert(CurrentDate);
		var SelectedDate = moment();
		alert(SelectedDate);
		*/
//
var CurrentDate = moment();
var hours;
if(self.meridiem() == 'PM' && self.hour() < 12) {
	hours = parseInt(self.hour()) + parseInt(12);
}
var month = monthNames.indexOf(self.month());
//alert(month);
var minutes = parseInt(self.minute()) + parseInt(0);
var SelectedDate = moment([self.year(), month, self.day(), hours, minutes, 0, 0]);
var diff = SelectedDate.diff(CurrentDate, 'minutes');
//alert(diff);
//
		//if(SelectedDate >= CurrentDate){
		if(diff > 0 ){	
			ENYM.ctx.setItem('escDuration', SelectedDate);
			popBackNav();				
		}
		else {
			var toastobj = {type: 'toast-error', text: 'Please set date greater than current date !'};
			showToast(toastobj);			
		}
  };
}

EscalateTimeSettingsViewModel.prototype = new ENYM.ViewModel();
EscalateTimeSettingsViewModel.prototype.constructor = EscalateTimeSettingsViewModel;