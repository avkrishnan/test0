﻿function EscalationPlansViewModel() {
	var self = this;	
	self.template = "escalationPlansView";
	self.viewid = "V-081";
	self.viewname = "Settings";
	self.displayname = "Escalation Plans";
    
	self.channels = ko.observableArray([]);
	self.commethods = ko.observableArray([]);
	self.escalationplans = ko.observableArray([]);
	self.comMethodType = ko.observable("EMAIL");
	
  self.inputObs = [ 'baseUrl', 'firstname', 'lastname', 'newComMethod', 'newComMethodName', 'navText' ];
  self.defineObservables();	
	
	self.pView = '';
	self.defaultCommethods = '';
	
	self.getEscPlans = function() {
		return ES.escplanService.getEscPlans({success: successEscPlans, error: errorEscPlans});
	}
			
	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message	

		var currentBaseUrl = localStorage.getItem("baseUrl");
		var previousView = localStorage.getItem('previousView');
		
		console.log("previousView: " + previousView);
		var vm = ko.dataFor($("#" + previousView).get(0));
		console.log("previousView Model viewid: " + vm.displayname);
		self.navText(vm.displayname);
		self.pView = previousView;	
		
		if (currentBaseUrl){
			self.baseUrl(currentBaseUrl);
		} else{
			var es = new EvernymService();
			self.baseUrl(es.getBaseUrl());
		}
		self.escalationplans.removeAll();
		self.getCommethods().then(gotCommethods);
		$.mobile.showPageLoadingMsg("a", "Loading Escalation Plans");
		return self.getEscPlans().then(gotEscPlans);
	};	
	
	function gotEscPlans (data) {
		if(data.escPaths.length) {
			$.each(data.escPaths, function(indexEscPlans, valueEscPlans) {
				var tempEscCommethods = [], varDefaultCommethod;
				$.each(valueEscPlans.steps, function(indexSteps, valueSteps) {
					var tempRetries = 0, varDefaultCommethod = valueSteps.comMethodType;
					$.each(valueSteps.retries, function(indexRetries, valueRetries) {
						tempRetries += valueRetries.totalDuration/valueRetries.interval;
					});
					$.each(self.defaultCommethods, function(indexCommethods, valueCommethods) {
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
				self.escalationplans.push( // without push not working
					{ urgencyName: valueEscPlans.urgencyName.toLowerCase(), commethods: tempEscCommethods }
				);
			});
		}
	}

	function successEscPlans() {
		//alert('success');	
	}
	
	function errorEscPlans(data, status, details){
		//alert(details.message);
	};
	
	self.getCommethods = function(){
		$.mobile.showPageLoadingMsg("a", "Getting Communication Methods");
		var callbacks = {
			success: function(){
				//alert('succ');
			},
			error: function() {
				//alert('error');
			}
		};
		return ES.commethodService.getCommethods(callbacks);
	};
		
	function gotCommethods(data){
		self.defaultCommethods = data.commethod;
	}
	
	/* logout */
  self.logoutCommand = function() {
    var token = ES.evernymService.getAccessToken();
		if(token) {
			var callbacks = {
				success : logoutSuccess,
				error : logoutError
			};
			ES.loginService.accountLogout(callbacks);
			self.cleanApplication();
		}
  };
	
  function logoutSuccess() {
    ES.evernymService.clearAccessToken();
		localStorage.removeItem('newuseremail');
		localStorage.removeItem('newusername');
		localStorage.removeItem('newuserpassword');		
    localStorage.removeItem('signUpError');				
		goToView('loginView');
  }

  function logoutError() {
		//alert('error');
  }	
	
  self.cleanApplication = function() {
		ES.evernymService.clearAccessToken();
		localStorage.removeItem('login_nav');
		localStorage.removeItem('backNavText');	
		localStorage.removeItem('backNavView');				
		localStorage.removeItem('currentChannel');
		localStorage.removeItem('accountName');
		localStorage.removeItem('account');		
		localStorage.removeItem('name');		
		localStorage.removeItem('iGiStatus');		
		localStorage.removeItem('currentChannelData');
		localStorage.removeItem('enymNotifications');
		ES.systemService.MnsCacheData = {};
		ES.systemService.MnsLastUpdated = 0;
		sendMessageViewModel.clearForm();											
	};
}

EscalationPlansViewModel.prototype = new AppCtx.ViewModel();
EscalationPlansViewModel.prototype.constructor = EscalationPlansViewModel;