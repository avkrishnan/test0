/*globals ko*/
/* To do - Pradeep Kumar */
function EditNameViewModel() {	
  var that = this;
	this.template = 'editNameView';
	this.viewid = 'V-11';
	this.viewname = 'Edit Name';
	this.displayname = 'Edit Name';	
	this.accountName = ko.observable();		
	
	/* Edit Name observable */
	this.accountName = ko.observable();	
  this.firstname = ko.observable();
  this.lastname = ko.observable();
  this.errorFirstLastName = ko.observable();
  this.firstnameClass = ko.observable();
  this.lastnameClass = ko.observable();
	this.toastText = ko.observable();		
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();
    });
  };
	
	this.clearForm = function () {
    that.firstname('');
    that.lastname('');
		that.firstnameClass('');
		that.lastnameClass('');		
		that.errorFirstLastName('');
  };

  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');			
		} 
		else {
			addExternalMarkup(that.template); // this is for header/overlay message	
			var account = JSON.parse(localStorage.getItem('account'));					
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			$('input').keyup(function () {
				that.firstnameClass('');
				that.lastnameClass('');
				that.errorFirstLastName('');				
			});
			that.accountName(localStorage.getItem('accountName'));						
			that.firstname(account.firstname);
			that.lastname(account.lastname);;						
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'editNameView') {
			that.editNameCommand();
		}
	});	
	
	this.editNameCommand = function () {
    if (that.firstname() == '') {
      that.firstnameClass('validationerror');
      that.errorFirstLastName('<span>SORRY:</span> Please enter first name');
    } else if (that.lastname() == '') {
      that.lastnameClass('validationerror');
      that.errorFirstLastName('<span>SORRY:</span> Last name cannot be left empty');
    } else {
      $.mobile.showPageLoadingMsg('a', 'Updating Name');
      var account = modifyAccount();
      ES.loginService.accountModify(account, { success: successfulUpdate, error: errorAPI });
    }
  };
	
	function modifyAccount() {
    return {
      firstname: that.firstname(),
      lastname: that.lastname()
    };
  };

  function successfulUpdate(args) {
    $.mobile.hidePageLoadingMsg();
		that.toastText('Name updated successfully !');		
		localStorage.setItem('toastData', that.toastText());
		var account = [];			
		account.push({
			accountname: that.accountName(),			
			firstname: that.firstname(), 
			lastname: that.lastname()
		});
		account = account[0];				
		localStorage.setItem('account', JSON.stringify(account));				
		popBackNav();
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.firstnameClass('validationerror');		
		that.lastnameClass('validationerror');
		that.errorFirstLastName('<span>SORRY:</span> '+details.message);		
  };	
	
}