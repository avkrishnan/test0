/*globals ko*/
function FirstChannelViewModel() {

	this.template = "firstChannelView";
	this.viewid = "V-014";
	this.viewname = "FollowFirstChannel";
	this.displayname = "Follow First Channel";
	this.hasfooter = true;
	
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
}
