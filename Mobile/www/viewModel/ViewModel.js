AppCtx.ViewModel = function() {
  this.accountName = ko.observable();
  
  this.clearObs = function(obs) {
    $.each(obs, function(i,v) {this[v]('');});
  };
  
  this.clearForm = function () {
    this.clearObs(this.allObs);
  };

  this.clearErrorObs = function() {
    this.clearObs(this.errorObs);
  };
  
  this.applyBindings = function () {
    $('#' + this.template).on('pagebeforeshow', null, function (e, data) {
      this.activate();
    });
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