/*globals ko*/
/* To do - Pradeep Kumar */
function InviteFollowersViewModel() {	
  var that = this;
	this.template = 'inviteFollowersView';
	this.viewid = 'V-27';
	this.viewname = 'InviteFollowers';
	this.displayname = 'Invite Followers';	
	this.accountName = ko.observable();	
	
  /* Invite Followers observable */
	this.channelName = ko.observable();	
	this.channelWebAddress = ko.observable();
	this.emailClass = ko.observable();
	this.errorEmail = ko.observable();		
	this.emailaddress = ko.observable();		
	this.messageClass = ko.observable();
	this.message = ko.observable();
	this.messageId = ko.observable('message');								
	this.errorMessage = ko.observable();		
		
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();				
      that.activate();
    });	
	};  
	
	this.clearForm = function () {
		that.emailaddress('');
		that.emailClass('');
		that.errorEmail('');				
		that.message('');
		that.messageClass('');
		that.errorMessage('');				
	};	
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));								
			that.channelName(channelObject.channelname);
			that.channelWebAddress(channelObject.channelname+'.evernym.dom');
			that.message('Add additional text here . . . ');			
			$('textarea').click(function () {
				if(that.message() == 'Add additional text here . . . ') {
					that.message('');											
				}
			});
			$('textarea').keyup(function () {
				if(that.message() == 'Add additional text here . . . ') {
					that.message('');											
				}
				that.messageClass('');
				that.errorMessage('');												
			});							
			$('input, textarea').keyup(function () {
				that.emailClass('');
				that.errorEmail('');									
			});			
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'inviteFollowersView') {
			that.sendInviteCommand();
		}
	});
	
	this.sendInviteCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		var messageData = $('#'+that.messageId()).val();
		if (that.emailaddress() == '' || !emailReg.test(that.emailaddress())) {
			that.emailClass('validationerror');
			that.errorEmail('<span>SORRY :</span> Please enter valid email');
    } else if (messageData == '') {
			that.messageClass('validationerror');
			that.errorMessage('<span>SORRY :</span> Please give message');
    } else {
			showMessage('Testing');			
    }
  };
	
}
