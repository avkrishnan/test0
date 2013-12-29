function EditNameViewModel() {	
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
		var account = JSON.parse(ENYM.ctx.getItem('account'));
		self.firstname(account.firstname);
		self.lastname(account.lastname);					
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'editNameView') {
			self.editNameCommand();
		}
	});	
	
	self.editNameCommand = function () {
    if (self.firstname() == '') {
      self.firstnameClass('validationerror');
      self.errorFirstName('<span>SORRY:</span> Please enter first name');
    } else if (self.firstname().length > 20) {
      self.firstnameClass('validationerror');
      self.errorFirstName('<span>SORRY:</span> Please enter name of max. 20 characters');
    } else if (self.lastname() == '') {
      self.lastnameClass('validationerror');
      self.errorFirstLastName('<span>SORRY:</span> Last name cannot be left empty');
    } else if (self.lastname().length > 20) {
      self.lastnameClass('validationerror');
      self.errorFirstLastName('<span>SORRY:</span> Please enter name of max. 20 characters');
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
		var toastobj = {redirect: 'escalationPlansView', type: '', text: 'Name updated successfully !'};
		showToast(toastobj);						
		backNavText.pop();
		backNavView.pop();		
		goToView('escalationPlansView');
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.firstnameClass('validationerror');		
		self.lastnameClass('validationerror');
		self.errorFirstLastName('<span>SORRY:</span> '+details.message);		
  };	
	
}

EditNameViewModel.prototype = new ENYM.ViewModel();
EditNameViewModel.prototype.constructor = EditNameViewModel;