/*globals ko*/
function FirstChannelViewModel() {
	var that = this;
	this.template = 'firstChannelView';
	this.viewid = 'V-14';
	this.viewname = 'FollowFirstChannel';
	this.displayname = 'Follow First Channel';
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
		}
	};
}

/* To do - to be removed when first channel view is complete

this.channels = ko.observableArray([]);
	this.commethods = ko.observableArray([]);
	this.baseUrl = ko.observable();
	this.accountName = ko.observable();
	
	this.navText = ko.observable();
	this.pView = '';
	
	var that = this;

	this.applyBindings = function(){
		$("#" + that.template).on("pagebeforeshow", null, function (e, data) {
			var currentBaseUrl = localStorage.getItem("baseUrl");
			var previousView = localStorage.getItem('previousView');
			console.log("previousView: " + previousView);
			var vm = ko.dataFor($("#" + previousView).get(0));
			console.log("previousView Model viewid: " + vm.displayname);
			that.navText(vm.displayname);
			that.pView = previousView;
			
			if (currentBaseUrl){
				that.baseUrl(currentBaseUrl);
			}
			else {
				var es = new EvernymService();
				that.baseUrl(es.getBaseUrl());
			}
			that.activate();
		});
	};
	
	this.gotoView = function(data) {
		goToView('verifyContactView');
	}
    
	this.activate = function() {
		var _accountName = localStorage.getItem("accountName");
		that.accountName(_accountName);
		//return that.getCommethods().then(that.showCommethods);
		return true;   
	};
*/