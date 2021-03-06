﻿function EditNameViewModel() {	
  var self = this;
	self.template = 'editNameView';
	self.viewid = 'V-11';
	self.viewname = 'Edit Name';
	self.displayname = 'Edit Name';	

  self.inputObs = [ 'firstname', 'lastname']; 
  self.errorObs = [ 'errorFirstName', 'errorFirstLastName', 'firstnameClass', 'lastnameClass' ];
	
  self.defineObservables();			
	
  self.activate = function () {
		addExternalMarkup(self.template); // this is for header/overlay message			
		$('input').keyup(function () {
		  self.clearErrorObs();
		});
		if(ENYM.ctx.getItem('account')) {
			var account = JSON.parse(ENYM.ctx.getItem('account'));
			self.firstname(account.firstname);
			self.lastname(account.lastname);					
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'editNameView') {
			self.editNameCommand();
		}
	});	
	
	self.editNameCommand = function () {
    if (self.firstname() == '' && self.lastname() == '') {
      $.mobile.showPageLoadingMsg('a', 'Removing Name');
      var account = modifyAccount();
      ES.loginService.accountModify(account, { success: successfulUpdate, error: errorAPI });
    } else if (self.firstname().length > 20) {
      self.firstnameClass('validationerror');
      self.errorFirstName('<span>Sorry,</span> Please enter name of max. 20 characters');
    } else if (self.lastname().length > 20) {
      self.lastnameClass('validationerror');
      self.errorFirstLastName('<span>Sorry,</span> Please enter name of max. 20 characters');
    } else {
      $.mobile.showPageLoadingMsg('a', 'Updating Name');
      var account = modifyAccount();
      ES.loginService.accountModify(account, { success: successfulUpdate, error: errorAPI });
    }
  };
	
	function modifyAccount() {
    return {
      firstname: self.firstname(),
      lastname: self.lastname()
    };
  };

  function successfulUpdate(args) {
    $.mobile.hidePageLoadingMsg();
		var account = [];			
		account.push({
			accountname: self.accountName(),			
			firstname: self.firstname(), 
			lastname: self.lastname()
		});
		account = account[0];	
		ENYM.ctx.setItem('account', JSON.stringify(account));
		if(self.firstname() == '' && self.lastname() == '') { 
			var toastobj = {redirect: 'userSettingsView', type: '', text: 'Name removed successfully !'};
		} else {
			var toastobj = {redirect: 'userSettingsView', type: '', text: 'Name updated successfully !'};
		}	
		showToast(toastobj);						
		backNavText.pop();
		backNavView.pop();		
		goToView('userSettingsView');
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.firstnameClass('validationerror');		
		self.lastnameClass('validationerror');
		self.errorFirstLastName('<span>Sorry,</span> '+details.message);		
  };	
	
}

EditNameViewModel.prototype = new ENYM.ViewModel();
EditNameViewModel.prototype.constructor = EditNameViewModel;