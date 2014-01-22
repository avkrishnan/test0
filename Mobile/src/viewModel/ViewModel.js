/*
 * This is the prototype for all ViewModels
 * 
 * make sure we setup this ViewModel as the prototype, and set the constructor properly
 * Example: 
 *   LoginViewModel.prototype = new ENYM.ViewModel();
 *   LoginViewModel.prototype.constructor = LoginViewModel;
 * set up inputObs and errorObs
 * optionally override requiresAuth (defaults to true)
 * remove applyBindings
 * pull out unnecessary items from activate()
 *   note: applyBindings optionally calls authenticate, clears the form, calls activate, and sets accountName observable
 * 
 * 
 */

ENYM.ViewModel = function() {
  
  this.accountName = ko.observable();
  this.toastText = ko.observable();
  this.previousViewID = ko.observable();	//Pradeep - Require previous view id on channel tagline/descripton view for setting toast.

  this.inputObs = []; //default input observables; subclasses with input observables should override this default
  this.errorObs = []; //default error observables; subclasses with error observables should override this default

  this.requiresAuth = true; //default; subclasses can override
  
	this.defineObservables = function() {
	  var vm = this;
		$.each(this.allObs(), function(i,v) {
		  vm[v] = ko.observable();
		});
	};
	
	this.initializeObservables = function(value) {
	  var vm = this;
		$.each(this.initObs, function(i,v) {
		  vm[v] = ko.observable(value);
		});		
	};
	
  this.clearObs = function(obs) {
		var vm = this;
    $.each(obs, function(i,v) {vm[v]('');});
  };
  
  this.clearForm = function () {
    this.clearObs(this.allObs()); // Pradeep - added parentheses 'this.allObs()' because allObs is a function 
  };

  this.clearErrorObs = function() {
    this.clearObs(this.errorObs);
  };
	
  this.allObs = function() {
    return this.inputObs.concat(this.errorObs);
  };

  this.applyBindings = function () {
		var vm = this;
    $('#' + vm.template).on('pagebeforeshow', null, function (e, data) {
      if(!vm.requiresAuth || authenticate()) {
			  vm.clearForm();
			  vm.activate();
	      vm.accountName(ENYM.ctx.getItem("accountName"));
				vm.previousViewID(data.prevPage.attr('id'));
      }
    });
  };
	
	this.removelLocalStorage = function() {
		var vm = this;
		$.each(this.ENYM.ctx(), function(i,v) {
			ENYM.ctx.removeItem(vm[v]);
		});		
	};
	
	// TODO - This function shows toast message and it should take some parameters like (MESSAGE, TRUE/FALSE).  True/False if want to show toast or not
	this.showToast = function() {
	};
	
	//TODO - to show badge counts in header
	this.showBadgeCounts = function() {
	};
	
	//TODO - to show new/igi messages in overlay
	this.showOverlayMessages = function() {
	};
	
};

//Implemented in Login, AboutEvernym, ChangePassword, ChangePasswordSuccess, ChannelList (Home)