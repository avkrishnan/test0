/*globals ko*/
/* To do - Pradeep Kumar */
function AddFollowersViewModel() {	
  var that = this;
	this.template = 'addFollowersView';
	this.viewid = 'V-28';
	this.viewname = 'AddFollowers';
	this.displayname = 'Add Followers';	
	this.accountName = ko.observable();
	
  /* Add Followers observable */
	this.channelId = ko.observable();		
	this.channelName = ko.observable();
	this.firstLastName = ko.observable();	
	this.nameClass = ko.observable();
	this.errorName = ko.observable();		
	this.emailaddress = ko.observable();
	this.emailClass = ko.observable();
	this.errorEmail = ko.observable();
	this.toastText = ko.observable();								
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();				
      that.activate();
    });	
	};
	
	this.clearForm = function () {
		that.firstLastName('');
		that.nameClass('');
		that.errorName('');			
		that.emailaddress('');
		that.emailClass('');
		that.errorEmail('');							
	};	  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));		
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));	
			that.channelId(channelObject.channelId);										
			that.channelName(channelObject.channelName);
			$('input').keyup(function () {
				that.nameClass('');
				that.errorName('');			
				that.emailClass('');
				that.errorEmail('');
			});						
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'addFollowersView') {
			that.addFollowersCommand();
		}
	});
	
	this.menuCommand = function () {
		pushBackNav('Add Followers', 'addFollowersView', 'channelMenuView');		
  };	
	
	this.addFollowersCommand = function () {		
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		if (that.firstLastName() == '') {
			that.nameClass('validationerror');
			that.errorName('<span>SORRY:</span> Please enter first and last name');
    } else if (that.emailaddress() == '' || !emailReg.test(that.emailaddress())) {
			that.emailClass('validationerror');
			that.errorEmail('<span>SORRY:</span> Please enter valid email');
    } else {
			$.mobile.showPageLoadingMsg("a", "Adding Follower");
			var provisional = generateProvisionalAccount();
			ES.channelService.provisionalEnroll(provisional, {success: successfulAdd, error: errorAPI});
		}
  };
	
	function generateProvisionalAccount() {
		var fullName = that.firstLastName().split(' ');
		var firstName = fullName[0];
		var lastName = fullName[1];		
		return {
			emailaddress: that.emailaddress(),
			smsPhone: that.smsPhone,
			firstname: firstName,
			lastname: lastName,
			channelid: that.channelId()
		};
	}
	
	function successfulAdd(data){
		showMessage('Follower added successfully');
		goToView('channelMainView');				
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		showError(details.message);
	};
	
	this.userSettings = function () {
		pushBackNav('Add Followers', 'addFollowersView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Add Followers', 'addFollowersView', 'sendMessageView');
  };	
	
}