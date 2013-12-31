function EscalationPlanSingleViewModel() {
	var self = this;	
	self.template = "escalationPlanSingleView";
	self.viewid = "V-081";
	self.viewname = "EscalationPlanSingle";
	self.displayname = "Escalation Plan Single";
	self.hasfooter = true;
	
	self.commethods = ko.observableArray([]);
	self.activeEscalationPlan = ko.observableArray([]);
	
  self.inputObs = [ 'baseUrl', 'backText', 'name', 'activeEscPlan', 'navText' ]; 
  //self.errorObs = [ 'currentpasswordClass', 'newpasswordClass', 'confirmpasswordClass', 'errorMessageCurrent', 'errorMessageNew', 'errorMessageConfirm' ];
  self.defineObservables();	
	
	self.pView = '';
	
	self.gotoView = function(pageView) {
		goToView('escalationPlanSingleView');
	};
	
	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		
		var currentBaseUrl = ENYM.ctx.getItem("baseUrl");
		var previousView = ENYM.ctx.getItem('previousView');
		console.log("previousView: " + previousView);
		var vm = ko.dataFor($("#" + previousView).get(0));
		console.log("previousView Model viewid: " + vm.displayname);
		self.navText(vm.displayname);
		self.pView = previousView;
		
		if (currentBaseUrl){
			self.baseUrl(currentBaseUrl);
		} else {
			var es = new EvernymService();
			self.baseUrl(es.getBaseUrl());
		}
		var _name = ENYM.ctx.getItem("UserFullName");
		self.activeEscalationPlan.removeAll()
		self.backText('<em></em>'+backNavText[backNavText.length-1]);		
		self.name(_name);
		self.activeEscPlan = ENYM.ctx.getItem("activeEscPlan");
		return self.getEscPlans().then(gotEscPlans);   
	};	
	
	self.getEscPlans = function() {
		var callbacks = {
			success: function(){
				//alert('succ');
			},
			error: function() {
				alert('error');
			}
		};		
		return ES.escplanService.getEscPlans(callbacks);
	};
	
	function gotEscPlans(data) {
		if(data.escPaths.length) {
			$.each(data.escPaths, function(indexEscPlans, valueEscPlans) {
				if((valueEscPlans.urgencyName).toLowerCase() == self.activeEscPlan) {
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
						self.activeEscalationPlan.push( // without push not working
							{comMethods:tempCommethods, delayText: varDelayText}
						);
						//alert(JSON.stringify(self.activeEscalationPlan));			
					});
				}
				//self.escalationplans.push( // without push not working
					//{ urgencyName: valueEscPlans.urgencyName.toLowerCase(), commethods: tempEscCommethods }
				//);
			});
		}
	};
	
	self.getCommethods = function() {
		var callbacks = {
			success: function(){
				//alert('succ');
			},
			error: function() {
				alert('error');
			}
		};		
		return ES.commethodService.getCommethods(callbacks);
	};
	
	self.gotoView = function(pageView) {
		//alert(JSON.stringify(pageView));
		goToView(pageView);
	};	

	self.showCommethods = function(data) {
		if(data.commethod.length > 0) {
			var tempCommethodClass = '', tempshowVerify = false;
			$.each(data.commethod, function(indexCommethods, valueCommethods) {
				//alert(valueCommethods.address);
				if (valueCommethods.verified == "N") {
					tempCommethodClass = "notverify";
					tempshowVerify = true;
				}
				self.commethods.push({ comMethodAddress: valueCommethods.address, comMethodClass: tempCommethodClass, comMethodVerify: tempshowVerify });
			});
		}
	};
}

EscalationPlanSingleViewModel.prototype = new ENYM.ViewModel();
EscalationPlanSingleViewModel.prototype.constructor = EscalationPlanSingleViewModel;