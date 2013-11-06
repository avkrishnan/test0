/*globals ko*/

function ChannelChangeNameStepFirstViewModel() {	
  var that = this;
	this.template = 'channelChangeNameStepFirstView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelChangeNameStepFirst';
	this.displayname = 'Channel Change Name Step First';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* New Channel Step First observable */
	this.channelChangeName = ko.observable('');	
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
		var _accountName = localStorage.getItem('accountName');
		that.accountName(_accountName);
		$('input').keyup(function () {
      that.message('');
			that.errorNewChannel('');
    });
		if (localStorage.getItem('signUpError') != null) {
			that.message('');
      that.errorNewChannel('<span>SORRY:</span> ' + localStorage.getItem('signUpError'));
      localStorage.removeItem('signUpError');
    }
	}
	this.clearForm = function () {
    that.channelChangeName('');
  };
  this.nextViewCommand = function () {
    if (that.channelChangeName() == '') {
      that.errorNewChannel('<span>SORRY:</span> Please enter channel name');
    } else {
			localStorage.setItem('channelChangeName', that.channelChangeName());
			that.message('<span>GREAT!</span> This name is available');
      $.mobile.changePage('#channelChangeNameStepSecondView', {
        transition: 'none'
      });
    }
  };
}