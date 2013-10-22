/*globals ko*/
function EscalationPlansViewModel() {
	
	this.template = "escalationPlansView";
	this.viewid = "V-081";
	this.viewname = "EscalationPlans";
	this.displayname = "Escalation Plans";
	this.hasfooter = true;
	
	//var dataService = new EvernymCommethodService();
	//var escPlanDataService = new EvernymEscPlanService();
	//var accountDataService = new EvernymLoginService();
    
	this.channels = ko.observableArray([]);
	this.commethods = ko.observableArray([]);
	this.escalationplans = ko.observableArray([]);
	
	this.baseUrl = ko.observable();
	this.accountName = ko.observable();
	this.name = ko.observable();
	
	this.firstname = ko.observable();
	this.lastname = ko.observable();
	
	this.newComMethod = ko.observable();
	this.newComMethodName = ko.observable();
	this.comMethodType = ko.observable("EMAIL");
	
	this.navText = ko.observable();
	this.pView = '';
	
	this.defaultCommethods = '';
	
	this.gotoView = function(pageView) {
		//alert(JSON.parse(JSON.stringify(pageView)).urgencyName);
		localStorage.setItem("activeEscPlan",JSON.parse(JSON.stringify(pageView)).urgencyName);
		goToView('escalationPlanSingleView');
	}	
	
	this.getEscPlans = function() {
		return ES.escplanService.getEscPlans({success: successEscPlans, error: errorEscPlans});
	}
	
	var that = this;
	
	//console.log(this.escalationplans);
  
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
		that.escalationplans.removeAll();
		that.getCommethods().then(gotCommethods);
		$.mobile.showPageLoadingMsg("a", "Loading Escalation Plans");
		return that.getEscPlans().then(gotEscPlans);
		//return true;     
	};
	
	function gotEscPlans (data) {
		//localStorage.setItem('allEscPlans',JSON.stringify(data));
		if(data.escPaths.length) {
			$.each(data.escPaths, function(indexEscPlans, valueEscPlans) {
				var tempEscCommethods = [], varDefaultCommethod;
				$.each(valueEscPlans.steps, function(indexSteps, valueSteps) {
					var tempRetries = 0, varDefaultCommethod = valueSteps.comMethodType;
					$.each(valueSteps.retries, function(indexRetries, valueRetries) {
						tempRetries += valueRetries.totalDuration/valueRetries.interval;
					});
					$.each(that.defaultCommethods, function(indexCommethods, valueCommethods) {
						if((valueCommethods.type == valueSteps.comMethodType) && (valueCommethods.dflt == 'Y')) {
							varDefaultCommethod = valueCommethods.address;
							if(valueCommethods.verified == 'Y') {
								//tempEscCommethods.push({ comMethodName: valueCommethods.address, comMethodRetries: tempRetries + ' Retries' });
							}
							else {
								//tempEscCommethods.push({ comMethodName: valueCommethods.address, comMethodRetries: ' UNVERIFIED' });
							}
						}	
					});
					tempEscCommethods.push({ comMethodName: varDefaultCommethod, comMethodRetries: tempRetries + ' Retries' });
				});
				that.escalationplans.push( // without push not working
					{ urgencyName: valueEscPlans.urgencyName.toLowerCase(), commethods: tempEscCommethods }
				);
			});
		}
	}

	function successEscPlans() {
		//alert('success');	
	}
	
	function errorEscPlans(data, status, details){
		alert(details.message);
	};
	
	this.getCommethods = function(){
		$.mobile.showPageLoadingMsg("a", "Getting Communication Methods");
		var callbacks = {
			success: function(){
				//alert('succ');
			},
			error: function() {
				alert('error');
			}
		};
		//return dataService.getCommethods(callbacks);
		return ES.commethodService.getCommethods(callbacks);
	};
		
	function gotCommethods(data){
		//alert(JSON.stringify(data));
		//console.log(JSON.stringify(data));
		//localStorage.setItem('currentCommethods',JSON.stringify(data));
		that.defaultCommethods = data.commethod;
		//console.log(that.defaultCommethods);
		//$(window).resize();
	}
}
