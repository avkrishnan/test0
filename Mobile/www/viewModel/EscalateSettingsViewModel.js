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
	this.escType = ko.observable(false);		
	this.escalateUntil = ko.observable();
	this.ecalateTime = ko.observable();	
	this.remindClass = ko.observable();
	this.chaseClass = ko.observable();
	this.houndClass = ko.observable();							
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  

	this.activate = function() {
		if(authenticate()) {
			addExternalMarkup(that.template); // this is for header/overlay message						
			that.accountName(ENYM.ctx.getItem('accountName'));
			that.escType(false);
			that.escalateUntil('');						
			that.ecalateTime('Set Date and Time');
			that.remindClass('');
			that.chaseClass('');
			that.houndClass('');
			if(ENYM.ctx.getItem('escLevel') == 'H') {
				that.houndClass('criticalicon');
				ENYM.ctx.setItem('escLevel', 'H');
				that.escalationType('"Hound"');																													
			} else if(ENYM.ctx.getItem('escLevel') == 'C') {
				that.chaseClass('broadcasticon');
				ENYM.ctx.setItem('escLevel', 'C');															
				that.escalationType('"Chase"');				
			} else {
				that.remindClass('timesensitiveicon');
				ENYM.ctx.setItem('escLevel', 'R');															
				that.escalationType('"Remind"');				
			}
			if(ENYM.ctx.getItem('escDuration')) {
				var DateTime = ENYM.ctx.getItem('escDuration').split('/');
				var day = DateTime[2].split(' ');
				var time = day[1].split(':');
				//that.escalateUntil(' until: '+DateTime[1]+' '+day[0]+', '+DateTime[0]+', '+time[0]+':'+time[1]+' '+day[2]);
				that.escalateUntil(' until: ' + time[0] + ':' + time[1] + ' ' + day[2] + ', ' + DateTime[1] + '. ' + day[0] + ', ' + DateTime[0]);
				that.ecalateTime('Edit');
				that.escType(true);																						
			}						
		}
	}	
	
	this.remindActive = function () {
		that.remindClass('timesensitiveicon ');
		that.chaseClass('');
		that.houndClass('');
		ENYM.ctx.setItem('escLevel', 'R');
		that.escalationType('"Remind"');					
  };
	
	this.chaseActive = function () {
		that.remindClass('');
		that.chaseClass('broadcasticon');
		that.houndClass('');
		ENYM.ctx.setItem('escLevel', 'C');
		that.escalationType('"Chase"');							
  };
	
	this.houndActive = function () {		
		that.remindClass('');
		that.chaseClass('');
		that.houndClass('criticalicon');
		ENYM.ctx.setItem('escLevel', 'H');
		that.escalationType('"Hound"');							
  };
	
	this.saveCommand = function () {
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