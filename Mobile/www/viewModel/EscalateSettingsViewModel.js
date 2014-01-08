function EscalateSettingsViewModel() {
  var self = this;
  self.template = 'escalateSettingsView';
  self.viewid = 'V-20c';
  self.viewname = 'Escalate Settings';
  self.displayname = 'Escalate Settings';

	self.escType = ko.observable(false);
	
  self.inputObs = [ 'escalationColor', 'escalationType', 'escalateUntil', 'ecalateTime', 'remindClass', 'chaseClass', 'houndClass', 'remindColor', 'chaseColor', 'houndColor' ];
  self.defineObservables();		

	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		self.escType(false);
		self.escalateUntil('');						
		self.ecalateTime('Set Date and Time');
		self.remindColor('');
		self.chaseColor('');
		self.houndColor('');		
		self.remindClass('');
		self.chaseClass('');
		self.houndClass('');
		if(ENYM.ctx.getItem('escLevel') == 'H') {
			self.escalationColor('houndcolor');
			self.houndColor('houndcolor');
			self.houndClass('criticalicon');
			ENYM.ctx.setItem('escLevel', 'H');
			self.escalationType('"Hound"');																													
		} else if(ENYM.ctx.getItem('escLevel') == 'C') {
			self.escalationColor('chasecolor');
			self.chaseColor('chasecolor');
			self.chaseClass('broadcasticon');
			ENYM.ctx.setItem('escLevel', 'C');															
			self.escalationType('"Chase"');
		} else {
			self.escalationColor('remindcolor');
			self.remindColor('remindcolor');
			self.remindClass('timesensitiveicon');
			ENYM.ctx.setItem('escLevel', 'R');															
			self.escalationType('"Remind"');				
		}
		//alert(JSON.stringify(ENYM.ctx.getItem('escDuration')));
		if(ENYM.ctx.getItem('escDuration')) {
			//var DateTime = ENYM.ctx.getItem('escDuration').split('/');
			//var day = DateTime[2].split(' ');
			//var time = day[1].split(':');
			//self.escalateUntil(' until: '+DateTime[1]+' '+day[0]+', '+DateTime[0]+', '+time[0]+':'+time[1]+' '+day[2]);
			//self.escalateUntil(' until: ' + time[0] + ':' + time[1] + ' ' + day[2] + ', ' + DateTime[1] + '. ' + day[0] + ', ' + DateTime[0]);
			self.escalateUntil(' until: ' + moment(ENYM.ctx.getItem('escDuration')).format('h:m A, MMM. D, YYYY'));
			self.ecalateTime('Edit');
			self.escType(true);																						
		}
	};	
	
	self.remindActive = function () {
		self.remindColor('remindcolor ');
		self.chaseColor('');
		self.houndColor('');		
		self.remindClass('timesensitiveicon ');
		self.chaseClass('');
		self.houndClass('');
		ENYM.ctx.setItem('escLevel', 'R');
		self.escalationColor('remindcolor ');
		self.escalationType('"Remind"');					
  };
	
	self.chaseActive = function () {
		self.remindColor('');
		self.chaseColor('chasecolor');
		self.houndColor('');		
		self.remindClass('');
		self.chaseClass('broadcasticon');
		self.houndClass('');
		ENYM.ctx.setItem('escLevel', 'C');
		self.escalationColor('chasecolor');
		self.escalationType('"Chase"');							
  };
	
	self.houndActive = function () {
		self.remindColor('');
		self.chaseColor('');
		self.houndColor('houndcolor');				
		self.remindClass('');
		self.chaseClass('');
		self.houndClass('criticalicon');
		ENYM.ctx.setItem('escLevel', 'H');
		self.escalationColor('houndcolor');
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