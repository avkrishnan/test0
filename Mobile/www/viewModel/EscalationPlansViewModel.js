/*globals ko*/
function EscalationPlansViewModel() {
	var that = this;	
	this.template = "escalationPlansView";
	this.viewid = "V-081";
	this.viewname = "Settings";
	this.displayname = "Escalation Plans";
    
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
	this.toastText = ko.observable();	
	
	/*this.gotoView = function(pageView) {
		//alert(JSON.parse(JSON.stringify(pageView)).urgencyName);
		localStorage.setItem("activeEscPlan",JSON.parse(JSON.stringify(pageView)).urgencyName);
		goToView('escalationPlanSingleView');
	}*/
	
	this.getEscPlans = function() {
		return ES.escplanService.getEscPlans({success: successEscPlans, error: errorEscPlans});
	}
	
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
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}					
			var _accountName = localStorage.getItem("accountName");
			var _name = localStorage.getItem("UserFullName");
			
			that.accountName(_accountName);		
			that.name(_name);
			that.escalationplans.removeAll();
			that.getCommethods().then(gotCommethods);
			$.mobile.showPageLoadingMsg("a", "Loading Escalation Plans");
			return that.getEscPlans().then(gotEscPlans);
			//return true;
		}
	};
	
	this.menuCommand = function () {
		viewNavigate('Settings', 'escalationPlansView', 'channelMenuView');		
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
		//alert(details.message);
	};
	
	this.getCommethods = function(){
		$.mobile.showPageLoadingMsg("a", "Getting Communication Methods");
		var callbacks = {
			success: function(){
				//alert('succ');
			},
			error: function() {
				//alert('error');
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
	
	/* logout */
  this.logoutCommand = function() {
    var token = ES.evernymService.getAccessToken();
		if(token) {
			var callbacks = {
				success : logoutSuccess,
				error : logoutError
			};
			ES.loginService.accountLogout(callbacks);
			that.cleanApplication();
		}
  };
	
  function logoutSuccess() {
		//alert('success');
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
	
  this.cleanApplication = function() {
		//sendMessageViewModel.clearForm();
		//inviteFollowersViewModel.clearForm();
		ES.evernymService.clearAccessToken();
		localStorage.removeItem('login_nav');
		localStorage.removeItem('backNavText');	
		localStorage.removeItem('backNavView');				
		localStorage.removeItem('currentChannel');
		localStorage.removeItem('accountName');
		localStorage.removeItem('name');
		localStorage.removeItem('escDuration');		
		localStorage.removeItem('escLevel');
		localStorage.removeItem('currentChannelData');		
		//localStorage.setItem('currentChannel');				
		//channelListViewModel.clearForm();
		//notificationsViewModel.removeNotifications();
		//OVERLAY.removeNotifications();
	};
		
}
