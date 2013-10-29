/*globals ko*/

function ChannelNewStepFirstViewModel() {	
  var that = this;
	this.template = 'channelNewStepFirstView';
	this.viewid = 'V-13';
	this.viewname = 'CreateAnotherChannelStepFirst';
	this.displayname = 'Create Channel Step First';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* New Channel Step First observable */
	this.newChannel = ko.observable('');	
	this.message = ko.observable();	
	this.errorNewChannel = ko.observable();				
	
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.a) {
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }
      that.activate();
    });	
	};  
	this.activate = function() {
		alert('here');
		var _accountName = localStorage.getItem('accountName');
		that.accountName(_accountName);
		$('input').keyup(function () {
      that.message('');
			that.errorNewChannel('');
    });
		if (localStorage.getItem('signUpError') != null) {
			that.message('');
      that.errorNewChannel('<span>SORRY:</span>'+localStorage.getItem('signUpError'));
      localStorage.removeItem('signUpError');
    }
	}
	this.clearForm = function () {
    that.newChannel('');
  };
  this.nextViewCommand = function () {
    if (that.newChannel() == '') {
      that.errorNewChannel('<span>SORRY:</span> Please enter channel name');
    } else {
			localStorage.setItem('newChannel', that.newChannel());
			that.message('<span>GREAT!</span> This name is available');
      $.mobile.changePage('#channelNewStepSecondView', {
        transition: 'none'
      });
    }
  };
}