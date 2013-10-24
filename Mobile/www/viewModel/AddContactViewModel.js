/*globals ko*/
function AddContactViewModel() {
	
	this.template = "addContactView";
	this.viewid = "V-081";
	this.viewname = "AddEditContact";
	this.displayname = "Add/Edit Contact";
	this.hasfooter = true;
	this.deleteClass = "uima2";
	
	this.channels = ko.observableArray([]);
	this.commethods = ko.observableArray([]);
	this.baseUrl = ko.observable();
	this.accountName = ko.observable();
	this.name = ko.observable();
	
	//this.deleteClass = ko.observable();
	
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
	
	this.getCommethods = function() {
		var callbacks = {
			success: function(){
				//alert('succ');
			},
			error: function() {
				alert('error');
			}
		};		
		return ES.commethodService.getCommethods(callbacks);
	}
	
	this.gotoView = function(data) {
		localStorage.setItem("currentVerificationCommethod",data.comMethodAddress);
		localStorage.setItem("currentVerificationCommethodType",data.comMethodType);
		localStorage.setItem("currentVerificationCommethodID",data.comMethodID);
		localStorage.setItem("verificationStatus",false);
		goToView('verifyContactView');
	}	

	this.showCommethods = function(data) {
		if(data.commethod.length > 0) {
			var tempCommethodClass = '', tempshowVerify = false;
			$.each(data.commethod, function(indexCommethods, valueCommethods) {
				//alert(JSON.stringify(valueCommethods));
				if (valueCommethods.verified == "N") {
					tempCommethodClass = "notverify";
					tempshowVerify = true;
				}
				that.commethods.push({ comMethodID: valueCommethods.id, comMethodAddress: valueCommethods.address, comMethodClass: tempCommethodClass, comMethodVerify: tempshowVerify, comMethodType: valueCommethods.type});
			});
		}
	}	
    
	this.activate = function() {
		var _accountName = localStorage.getItem("accountName");
		var _name = localStorage.getItem("UserFullName");
		
		that.accountName(_accountName);
		that.name(_name);
		that.commethods.removeAll();
		//alert(localStorage.getItem('currentEscPlan'));
		//alert(JSON.stringify(localStorage.getItem('allEscPlans')));
		//$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return that.getCommethods().then(that.showCommethods);
		//return true;     
	};
	
	this.changeIcon = function(data, data2) {
		alert(JSON.stringify(data2));
		that.deleteClass('uima');
		this.deleteClass = 'see';
	}
}
