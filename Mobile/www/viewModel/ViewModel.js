AppCtx.ViewModel = function() {
  
  this.accountName = ko.observable();
  this.toastText = ko.observable();

  this.inputObs = []; //default input observables; subclasses with input observables should override this default
  this.errorObs = []; //default error observables; subclasses with error observables should override this default
  
  this.applyBindings = function() {
    var vm = this;
    $("#" + self.template).on("pagebeforeshow", null, function(e, data) {
      vm.clearForm();
      vm.activate();
    });
  };

	this.defineObservables = function() {
	  var vm = this;
		$.each(this.allObs(), function(i,v) { 
		  vm[v] = ko.observable(); 
		});
	};
	
  this.clearObs = function(obs) {
		var vm = this;
    $.each(obs, function(i,v) {vm[v]('');});
  };
  
  this.clearForm = function () {
    this.clearObs(this.allObs);
  };

  this.clearErrorObs = function() {
    this.clearObs(this.errorObs);
  };
  
  this.allObs = function() {
    return this.inputObs.concat(this.errorObs);
  };
	
	// TODO - This function shows toast message and it should take some parameters like (MESSAGE, TRUE/FALSE).  True/False if want to show toast or not
	this.showToast = function() {
	}
	
	//TODO - to show badge counts in header
	this.showBadgeCounts = function() {
	}
	
	//TODO - to show new/igi messages in overlay
	this.showOverlayMessages = function() {
	}
	
};

//AppCtx.ViewModelProto = new AppCtx.ViewModel();