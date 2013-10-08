(function() {
	QUnit.config.testTimeout = 90000;
	QUnit.config.reorder = false;

	var api = new EvernymAPI();
	var hlpr = new ApiTestHelper(api);

	var SCEN_A = {};

	asyncTest('A enrolls', hlpr.enroll(SCEN_A));
	asyncTest('A logs in', hlpr.login(SCEN_A));

	asyncTest('A retrieves escalation plan', function() {
		$.when(api.fetchEscPlan(SCEN_A.accessToken))
		.then(api.CHECK.success)
		.then(function(data) {
			SCEN_A.ep = data; 
			console.log(data);
		})
		.then(start);
	});

	function findEP(scenario, urgId) {
		var epList = $.grep(scenario.ep.escPaths, function(ep) { 
			return ep.urgencyId === urgId;
		});
		if (epList.length < 1)
			throw "no results found";
		else if (epList.length > 1)
			throw "too many results found";
		else
			return epList[0];
	}
	
	asyncTest('A clones escalation plan', function() {
		var ts = findEP(SCEN_A, "TS");
		$.when(api.cloneEscPlan(SCEN_A.accessToken, ts.id))
		.then(api.CHECK.created)
		.then(function(data) {SCEN_A.newTS = data; console.log(data);})
		.then(start);
	});

	function createStep(scenario, step, checkFunc) {
		return function() {
			$.when(api.createEscStep(scenario.accessToken, scenario.newTS, step))
			.then(checkFunc)
			.then(function(data) {console.log(data);})
			.then(start);
		};
	}
	
	function createRetry(scenario, stepId, retry, checkFunc) {
		return function() {
			$.when(api.createEscRetry(scenario.accessToken, scenario.newTS, stepId, retry))
			.then(checkFunc)
			.then(function(data) {console.log(data);})
			.then(start);
		};
	}

	function updateStep(scenario, stepId, step, checkFunc) {
		return function() {
			$.when(api.updateEscStep(scenario.accessToken, scenario.newTS, stepId, step))
			.then(checkFunc)
			.then(function(data) {console.log(data);})
			.then(start);
		};
	}
	
	function deleteStep(scenario, stepId, checkFunc) {
		return function() {
			$.when(api.deleteEscStep(scenario.accessToken, scenario.newTS, stepId))
			.then(checkFunc)
			.then(function(data) {console.log(data);})
			.then(start);
		};
	}
	
	function modifyRetry(scenario, stepId, seq, retry, checkFunc) {
		return function() {
			$.when(api.updateEscRetry(scenario.accessToken, scenario.newTS, stepId, seq, retry))
			.then(checkFunc)
			.then(function(data) {console.log(data);})
			.then(start);
		};
	}

	function deleteRetry(scenario, stepId, seq, checkFunc) {
		return function() {
			$.when(api.deleteEscRetry(scenario.accessToken, scenario.newTS, stepId, seq))
			.then(checkFunc)
			.then(function(data) {console.log(data);})
			.then(start);
		};
	}

	asyncTest(
			'A adds an escalation plan step with dup step id', 
			createStep(
					SCEN_A, 
					{stepId: 1, comMethodType: 'EMAIL', delay: 60}, 
					api.CHECK.badRequest));
	
	asyncTest(
			'A adds an escalation plan step', 
			createStep(
					SCEN_A, 
					{stepId: 4, comMethodType: 'EMAIL', delay: 60}, 
					api.CHECK.created));
	
	asyncTest(
			'A modifies escalation plan step', 
			updateStep(
					SCEN_A,
					4,
					{delay: 40}, 
					api.CHECK.successNoContent));

	asyncTest(
			'A deletes escalation plan step', 
			deleteStep(
					SCEN_A,
					4, 
					api.CHECK.successNoContent));

	asyncTest(
			'A adds an escalation plan step again', 
			createStep(
					SCEN_A, 
					{stepId: 4, comMethodType: 'EMAIL', delay: 60}, 
					api.CHECK.created));

	var seq = 1;
	var retry = {interval: 5400, seq: seq, totalDuration: 21600};

	asyncTest('A adds a retry rule', createRetry(SCEN_A, 4, retry, api.CHECK.created));
	
	asyncTest('A adds the same retry rule', createRetry(SCEN_A, 4, retry, api.CHECK.badRequest));

	asyncTest('A modifies the retry rule', modifyRetry( SCEN_A, 4, seq, {interval: 5399}, api.CHECK.successNoContent));

	asyncTest('A deletes the retry rule', deleteRetry( SCEN_A, 4, seq, api.CHECK.successNoContent));

})();
