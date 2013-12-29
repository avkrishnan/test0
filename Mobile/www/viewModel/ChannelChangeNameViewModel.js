/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelChangeNameViewModel() {	
  var that = this;
	this.template = 'channelChangeNameView';
	this.viewid = 'V-16';
	this.viewname = 'Change Chan';
	this.displayname = 'Change Channel Name';	
	this.accountName = ko.observable();	
	
  /* Channel changet name observable */
	this.sectionOne = ko.observable(true);
	this.sectionTwo = ko.observable(false);
	this.channelId = ko.observable();		
	this.channelChangeName = ko.observable('');
	this.channelClass = ko.observable();		
	this.message = ko.observable();	
	this.errorChannel = ko.observable();	
	this.channelWebAddress = ko.observable();								
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();      
			that.activate();			
    });	
	};
	
	this.clearForm = function () {
    that.channelChangeName('');
		that.channelClass('');			
		that.message('');
		that.errorChannel('');	
  };
	  
	this.activate = function() {
		if(authenticate()) {
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
			if(!channelObject) {
				goToView('channelsIOwnView');			
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message						
				that.accountName(ENYM.ctx.getItem('accountName'));		
				var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
				that.channelId(channelObject.channelId);	
				that.channelChangeName(channelObject.channelName);						
				$('input').keyup(function () {
					that.message('');
					that.errorChannel('');
					that.channelClass('');
				});	
			}
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'channelChangeNameView') {
			that.nextViewCommand();
		}
	});		
	
  this.nextViewCommand = function () {
		headerViewModel.comingSoon();
		// commented for temparary basis		
    /*if (that.channelChangeName() == '') {
      that.errorChannel('<span>SORRY:</span> Please enter channel name');
		} else if (that.channelChangeName().match(/\s/)) {
			 that.errorChannel('<span>SORRY:</span> Please choose a short name with no spaces');
		} else if(that.channelChangeName().length > 15) {
			that.errorChannel('<span>SORRY:</span> Please choose name of max. 15 characters');			 
    } else {
			$.mobile.showPageLoadingMsg('a', 'Checking channel name availability');
			ES.loginService.checkName(that.channelChangeName(), { success: successAvailable, error: errorAPI });					
    }*/
  };
	
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    popBackNav();
  };
	
	function successAvailable(data){
		if(data){
			that.channelClass('validationerror');
      that.errorChannel('<span>SORRY:</span> This channel name has already been taken');
		} else {
			//that.message('<span>GREAT! </span> This name is available');
			that.sectionOne(false);
			that.sectionTwo(true);						
			that.channelWebAddress(that.channelChangeName()+'.evernym.com');				
		}
	};	

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelChangeNameView');
		that.sectionOne(true);
		that.sectionTwo(false);
		that.message('');
    that.errorChannel('<span>SORRY:</span> '+details.message);		
  };
	
  this.confirmChannelChangeNameCommand = function () {		
		var channelObject = {
			id: that.channelId(),
			name: that.channelChangeName()
		};	
		//$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
		//ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
	};	
	
}