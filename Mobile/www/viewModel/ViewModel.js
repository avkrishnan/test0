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

};

//AppCtx.ViewModelProto = new AppCtx.ViewModel();