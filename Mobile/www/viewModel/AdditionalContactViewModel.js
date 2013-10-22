/*globals ko*/
function AdditionalContactViewModel() {
	
	this.template = "additionalContactView";
	this.viewid = "V-081";
	this.viewname = "AdditionalContact";
	this.displayname = "Additional Contact";
	this.hasfooter = true;
	//var  dataService = new EvernymCommethodService();
	//var  accountDataService = new EvernymLoginService();
	
	this.baseUrl = ko.observable();
	this.accountName = ko.observable();
	this.name = ko.observable();
	
	this.newComMethod = ko.observable();
	this.newComMethodName = ko.observable();
	this.comMethodName = ko.observable();
	this.comMethodType = ko.observable("EMAIL");
	
	this.navText = ko.observable();
	this.pView = '';
	this.errorMessage = ko.observable();
	this.errorMessageInput = ko.observable();
	
	var that = this;
		
	that.addCommethod = function() {
		//if() {
			that.errorMessage("<span>ERROR: </span>Please input commethod.");
			this.errorMessageInput('validationerror');
		//}
	}	
		
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
    
	this.activate = function() {
		var _accountName = localStorage.getItem("accountName");
		var _name = localStorage.getItem("UserFullName");
		that.accountName(_accountName);
		that.name(_name);
		//that.getCommethods().then(gotCommethods);
		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;     
	};
	
	this.addNewComMethod = function(){
		var commethod = that.newComMethod();
		var _newComMethodName = that.newComMethodName();
		var _comMethodType = that.comMethodType();
		var callbacks = {
			success: function(){ that.activate()},
			error: errorAddComMethod
		};
		var comobject = {
			name : _newComMethodName,
			type : _comMethodType,
			address : commethod
		};
		ES.escplanService.addCommethod(comobject, callbacks );
	};
	
	function errorChangingName(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showError("Error Changing Name: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'dataservice', true);
	};
	
	function errorAddComMethod(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showError("Error adding a com method: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'dataservice', true);
	};
}
