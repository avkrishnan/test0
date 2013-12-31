function EscalateSettingsViewModel() {
  var self = this;
  self.template = 'escalateSettingsView';
  self.viewid = 'V-20c';
  self.viewname = 'Escalate Settings';
  self.displayname = 'Escalate Settings';

	self.escType = ko.observable(false);
	
  self.inputObs = [ 'escalationType', 'escalateUntil', 'ecalateTime', 'remindClass', 'chaseClass', 'houndClass' ];
  self.defineObservables();		

	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		self.escType(false);
		self.escalateUntil('');						
		self.ecalateTime('Set Date and Time');
		self.remindClass('');
		self.chaseClass('');
		self.houndClass('');
		if(ENYM.ctx.getItem('escLevel') == 'H') {
			self.houndClass('criticalicon');
			ENYM.ctx.setItem('escLevel', 'H');
			self.escalationType('"Hound"');																													
		} else if(ENYM.ctx.getItem('escLevel') == 'C') {
			self.chaseClass('broadcasticon');
			ENYM.ctx.setItem('escLevel', 'C');															
			self.escalationType('"Chase"');				
		} else {
			self.remindClass('timesensitiveicon');
			ENYM.ctx.setItem('escLevel', 'R');															
			self.escalationType('"Remind"');				
		}
		if(ENYM.ctx.getItem('escDuration')) {
			var DateTime = ENYM.ctx.getItem('escDuration').split('/');
			var day = DateTime[2].split(' ');
			var time = day[1].split(':');
			//self.escalateUntil(' until: '+DateTime[1]+' '+day[0]+', '+DateTime[0]+', '+time[0]+':'+time[1]+' '+day[2]);
			self.escalateUntil(' until: ' + time[0] + ':' + time[1] + ' ' + day[2] + ', ' + DateTime[1] + '. ' + day[0] + ', ' + DateTime[0]);
			self.ecalateTime('Edit');
			self.escType(true);																						
		}
	};	
	
	self.remindActive = function () {
		self.remindClass('timesensitiveicon ');
		self.chaseClass('');
		self.houndClass('');
		ENYM.ctx.setItem('escLevel', 'R');
		self.escalationType('"Remind"');					
  };
	
	self.chaseActive = function () {
		self.remindClass('');
		self.chaseClass('broadcasticon');
		self.houndClass('');
		ENYM.ctx.setItem('escLevel', 'C');
		self.escalationType('"Chase"');							
  };
	
	self.houndActive = function () {		
		self.remindClass('');
		self.chaseClass('');
		self.houndClass('criticalicon');
		ENYM.ctx.setItem('escLevel', 'H');
		self.escalationType('"Hound"');							
  };
	
	self.saveCommand = function () {
		if(ENYM.ctx.getItem('escDuration')) {
			ENYM.ctx.setItem('escalate', 'yes');		
			popBackNav();					
		}
		else {
			var toastobj = {type: 'toast-error', text: 'Please set Date and time for escalation !'};
			showToast(toastobj);			
		}
  };
}

EscalateSettingsViewModel.prototype = new ENYM.ViewModel();
EscalateSettingsViewModel.prototype.constructor = EscalateSettingsViewModel;