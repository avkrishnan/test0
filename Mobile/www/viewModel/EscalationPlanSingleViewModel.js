/*globals ko*/
function EscalationPlanSingleViewModel() {
	
	this.template = "escalationPlanSingleView";
	this.viewid = "V-081";
	this.viewname = "EscalationPlanSingle";
	this.displayname = "Escalation Plan Single";
	this.hasfooter = true;
	
	this.commethods = ko.observableArray([]);
	this.activeEscalationPlan = ko.observableArray([]);
	
	this.baseUrl = ko.observable();
	this.accountName = ko.observable();
	this.backText = ko.observable();	
	this.name = ko.observable();
	
	this.activeEscPlan = ko.observable();
	
	this.navText = ko.observable();
	this.pView = '';
	
	var that = this;
	
	this.gotoView = function(pageView) {
		goToView('escalationPlanSingleView');
	}	
	
	this.getEscPlans = function() {
		var callbacks = {
			success: function(){
				//alert('succ');
			},
			error: function() {
				alert('error');
			}
		};		
		return ES.escplanService.getEscPlans(callbacks);
	}
	
	function gotEscPlans(data) {
		if(data.escPaths.length) {
			$.each(data.escPaths, function(indexEscPlans, valueEscPlans) {
				if((valueEscPlans.urgencyName).toLowerCase() == that.activeEscPlan) {
					delays = new Array(), arrCounter = 0;;
					$.each(valueEscPlans.steps, function(indexSteps, valueSteps) {
						var prevalue;
						if ($.inArray(valueSteps.delay, delays ) == -1){
							delays[arrCounter] = valueSteps.delay;
						}
						arrCounter++;
					});
					delays = delays.sort();
					$.each(delays, function(indexDelay, valueDelay) {
						switch(valueDelay) {
							case 0 : 
								varDelayText = 'Immediately ( 0 minute after arrival )';
								break;
							default:
								varDelay = valueDelay/60;
								if ( varDelay < 59 ) {
									varDelay = varDelay + ' minutes ';
								}
								else {
									varDelay = (varDelay / 60) + ' hours' ;
								}
								varDelayText = varDelay + ' after arrival';
						}
						var tempCommethods = [];
						$.each(valueEscPlans.steps, function(indexSteps, valueSteps) {
							if(valueSteps.delay == valueDelay) {
								var tempCommethodRetries = [];
								$.each(valueSteps.retries, function(indexRetries, valueRetries) {
									varRetriesInternal = valueRetries.interval/60;
									if ( varRetriesInternal < 59 ) {
										varRetriesInternal = varRetriesInternal + ' minutes ';
									}
									else {
										varRetriesInternal = (varRetriesInternal / 60) + ' hours' ;
									}
									varRetriesDuration = valueRetries.totalDuration/60;
									if ( varRetriesDuration < 59 ) {
										varRetriesDuration = varRetriesDuration + ' minutes ';
									}
									else {
										varRetriesDuration = (varRetriesDuration / 60) + ' hours' ;
									}																
									tempCommethodRetries.push({comInterval: varRetriesInternal, comDuration: varRetriesDuration});
								});
								if((valueSteps.comMethodType == 'PUSH') && (valueSteps.retries.length < 1)) {
									tempCommethodRetries.push({comInterval: '0 mins.', comDuration: '0 mins.'});
								}		
								//alert(JSON.stringify(tempCommethodRetries));						
								tempCommethods.push({comMethodName : valueSteps.comMethodType, comMethodRetries:tempCommethodRetries});
								//alert(JSON.stringify(tempCommethods));
							}
						});
						that.activeEscalationPlan.push( // without push not working
							{comMethods:tempCommethods, delayText: varDelayText}
						);
						//alert(JSON.stringify(that.activeEscalationPlan));			
					});
				}
				//that.escalationplans.push( // without push not working
					//{ urgencyName: valueEscPlans.urgencyName.toLowerCase(), commethods: tempEscCommethods }
				//);
			});
		}
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
	
	this.gotoView = function(pageView) {
		alert(JSON.stringify(pageView));
		goToView(pageView);
	}	

	this.showCommethods = function(data) {
		if(data.commethod.length > 0) {
			var tempCommethodClass = '', tempshowVerify = false;
			$.each(data.commethod, function(indexCommethods, valueCommethods) {
				//alert(valueCommethods.address);
				if (valueCommethods.verified == "N") {
					tempCommethodClass = "notverify";
					tempshowVerify = true;
				}
				that.commethods.push({ comMethodAddress: valueCommethods.address, comMethodClass: tempCommethodClass, comMethodVerify: tempshowVerify });
			});
		}
	}	
    
	this.activate = function() {
		addExternalMarkup(that.template); // this is for header/overlay message
		var _accountName = localStorage.getItem("accountName");
		var _name = localStorage.getItem("UserFullName");
		that.activeEscalationPlan.removeAll()
		that.accountName(_accountName);
		that.backText('<em></em>'+backNavText[backNavText.length-1]);		
		that.name(_name);
		that.activeEscPlan = localStorage.getItem("activeEscPlan");
		return that.getEscPlans().then(gotEscPlans);   
	};
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		viewNavigate('SettingsSingle', 'escalationPlanSingleView', 'channelMenuView');		
  };
	
	this.userSettings = function () {
		viewNavigate('SettingsSingle', 'escalationPlanSingleView', 'escalationPlansView');				
  };	

	this.composeCommand = function () {
		viewNavigate('SettingsSingle', 'escalationPlanSingleView', 'sendMessageView');				
  };	
	
}
