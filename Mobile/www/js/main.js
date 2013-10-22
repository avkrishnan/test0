/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var baseUrl = 'https://api.evernym.com/api24/rest/';
var count = 0, countEmail=0;
var evernym_name = localStorage.getItem("accountName"), accesstokenvalue  = localStorage.getItem("accessToken"), urgencynameTxt = '';
var urgencyname = '', esc_plans, verification_com_method_id, verification_com_method, contact_details;
var registeredEmail = 'demo@demo.com';
$.support.cors = true;
var defaultCommethods = '';

/*
 * show/hide footer on keyboard show/hide'
*/
document.addEventListener("showkeyboard", function() {
   $("[data-role=footer]").hide();
}, false);

document.addEventListener("hidekeyboard", function() {
	$("[data-role=footer]").show();  
}, false);
/*
 * device back button functionality'
*/
document.addEventListener("backbutton", function(e){
    if($.mobile.activePage.is('#home')){
        e.preventDefault();				
        navigator.app.exitApp();
    }
    else {
        navigator.app.backHistory();
    }
}, false);
/*
 * This is to perform back button functionality'
*/
function backBtn(prevPage) {
	$('.back').off('click').on('click', function(event) {
		$.mobile.changePage(prevPage);
	});
}

//if (localStorage.getItem("defaultCommethods") === null) {
	//var escPlanDataService = new EvernymEscPlanService();
	//escPlanDataService.getCommethods({ success: function(data) {alert(data.commethod.length + ' success'); }, error: function(data) {alert('bad6');} });
//}
/*
 * This function returns escalation plan for specific action like 'Emergency'
 */
function esc_plans_settings( responseData, tagtobeFilled ) {
	$(tagtobeFilled).html( '' );
 	var EsettingsForText = [],EsettingsForEmail = [],delay,totalDuration,interval,vowels = "aeiou",isVowel;
	var delays = [], delaytext;
 	for(var pathcounter = 0; pathcounter < responseData.escPaths.length; pathcounter++) {
		var interval = 0, totalDuration = 0;	
	 	if(responseData.escPaths[pathcounter].urgencyName == urgencyname) {
			var prevalue;
			for( var pathcounter_steps = 0; pathcounter_steps < responseData.escPaths[pathcounter].steps.length; pathcounter_steps++ ) {
				if ( prevalue != responseData.escPaths[pathcounter].steps[pathcounter_steps].delay ){
					delays[pathcounter_steps] = responseData.escPaths[pathcounter].steps[pathcounter_steps].delay;				
				}
				prevalue = responseData.escPaths[pathcounter].steps[pathcounter_steps].delay;
			}
			delays = delays.sort();
			for ( delaycounter = 0; delaycounter < delays.length; delaycounter++ ) {
				switch( delays[delaycounter] ) {
					case 0 : 
						delaytext = '<strong class="details">Immediately ( 0 minute after arrival )</strong>';
						break;
					default:
						delay_in_mins = parseInt( delays[delaycounter] )/60;
						if ( delay_in_mins < 59 ) {
							delay_in_mins = delay_in_mins + ' minutes ';
						}
						else {
							delay_in_mins = (delay_in_mins / 60) + ' hours' ;
						}
						delaytext = '<strong class="details">'+delay_in_mins+' after arrival</strong>';
				}
				var retriesheading = '';
				var sequences = '';
				for( var pathcounter_steps = 0; pathcounter_steps < responseData.escPaths[pathcounter].steps.length; pathcounter_steps++ ) {
					if ( responseData.escPaths[pathcounter].steps[pathcounter_steps].delay == delays[delaycounter] ) {
						if( responseData.escPaths[pathcounter].steps[pathcounter_steps].comMethodType == 'EMAIL' ) {
							retriesheading = '<strong>FWD to '+registeredEmail+'</strong><span>RETRY :</span>';
						}
						else if ( responseData.escPaths[pathcounter].steps[pathcounter_steps].comMethodType == 'TEXT' ) { 
							retriesheading = '<strong>Send via TXT to blha blah (not set yet at server yet) </strong><span>RETRY :</span>';	
						}
						else  {
							retriesheading = '<strong>Send me via this app</strong><span>RETRY :</span>';
						}
						var retriestext = '';	
						var lengthcounter = 1;				
						for ( var pathcounter_steps_seq = 0; pathcounter_steps_seq < responseData.escPaths[pathcounter].steps[pathcounter_steps].retries.length; pathcounter_steps_seq++ ) {
							if ( typeof responseData.escPaths[pathcounter].steps[pathcounter_steps].retries[pathcounter_steps_seq].interval != 'undefined' ) {
								interval = parseInt(responseData.escPaths[pathcounter].steps[pathcounter_steps].retries[pathcounter_steps_seq].interval)/60;
								totalDuration = parseInt(responseData.escPaths[pathcounter].steps[pathcounter_steps].retries[pathcounter_steps_seq].totalDuration)/60;
								if ( totalDuration > 1) {
									if ( totalDuration > 59) {
										totalDuration = totalDuration/60;
										if ( totalDuration > 1) {
											totalDuration = totalDuration + ' hours ';
										} 
										else {
											totalDuration = totalDuration + ' hour ';
										}
									}
									else {
										totalDuration = totalDuration + ' minutes ';
									}
								}
								if(interval > 59) {
									var realmin = interval % 60;
									realmin = (realmin == 0)?'':realmin+' minutes ';
									var hours = Math.floor(interval / 60);
									if ( hours > 1) {	
										var intervaltime = hours+' hours '+realmin;
									}
									else {
										var intervaltime = hours+' hour '+realmin;
									}
								}
								else {
									if ( interval == 1) {
										intervaltime = interval+ ' minute ';
									}
									else {
										intervaltime = interval+ ' minutes ';
									}
								}													
								if (lengthcounter == responseData.escPaths[pathcounter].steps[pathcounter_steps].retries.length ) {
									retriestext = retriestext + '<li>every '+intervaltime+' for '+totalDuration+' </li>';
								}
								else {
									retriestext = retriestext + '<li>every '+intervaltime+' for '+totalDuration+' ;</li>';
								}
							}
							lengthcounter++;							
						}				
					}
					else {
						retriesheading = '';
						retriestext = '';						
					}
					if ( retriestext != '') {
						sequences = sequences + '<ul><li>'+retriesheading+'<ul class="uplode" id="TextEsettings">'+retriestext+'</ul></li></ul>';
					}					
				}			
			}
			isVowel = vowels.indexOf(urgencyname.charAt(0).toLowerCase()) >= 0 ? 'an' : 'a';
			$(tagtobeFilled).append('<div class="Emergencymsg ' +urgencyname.toLowerCase()+'inner">When '+isVowel+' '+urgencyname+' message arrives</div><a href="#" class="alldetails message-arrives">'+delaytext+sequences+'</a>');
		}
	}
}
function commonajax (url, method, data, accesstokenvalue) {	
	var resultdata;
	$.ajax({
		url: baseUrl+url,
		type: method,
		headers: { "Authorization": accesstokenvalue},
		data: JSON.stringify(data),
		contentType: 'application/json',
		dataType: 'json',	
		async: false,
		cache:false,
		success: function( responsedata ) {			
			resultdata = responsedata;
		},
		error: function( error ) {			
			resultdata = JSON.parse(error.responseText).message;
		}
	});
	return resultdata;
}
function common_ajax (url, method, accesstokenvalue) {	
	$.ajax({
		url: baseUrl+url,
		type: method,
		headers: { "Authorization": accesstokenvalue},
		contentType: 'application/json',
		dataType: 'json',		
		async: false,
		cache:false,
		success: function( responsdata) {			
			resultdata = responsdata;
		},
		error: function( error ) {
			resultdata = error;			  	
		}
	});
	return resultdata;
}
function changePageOnSuccess(url, method, accesstokenvalue) {
 $.ajax({
    url: baseUrl+url,
    type: method,
    headers: { "Authorization": accesstokenvalue},
    contentType: 'application/json',
    dataType: 'json',
		data:"{ blank:'blank' }",	
    async: false,
    cache:false,
    success: function(msg) {
			$.mobile.changePage("contact-info.html", { transition: "none"});					
    },
    error: function(error) {
    	$('.error-message').html('<span>ERROR : </span>Verification key not found');    
    }
	});
}

function successfulList(data){
	//$.mobile.hidePageLoadingMsg();
	//logger.log('success listing channels ' , null, 'dataservice', true);
	alert(JSON.stringify(data));
};

function errorListChannels(data, status, details){
/*	$.mobile.hidePageLoadingMsg();
	if (loginPageIfBadLogin(details.code)){
		//showMessage("Please log in or register to view channels.");
	}
	else {
		showError("Error listing my channels: " + details.message);
	}*/
	//logger.logError('error listing channels', null, 'dataservice', true);
	alert('Bad :(');
};
	
/*
 * This function returns all Escalation Plans
 */
function escPlan(msg,tagtobeFilled,accesstokenvalue) {
	var callbacks = {
		success: function(data) {
			console.log(JSON.stringify(data));
			defaultCommethods = data;
			//alert(JSON.stringify(data));
		},
		error: function() { 
			alert("Bad, bad!"); 
		}
	};	
	$(tagtobeFilled).html(''); 
	var plan = [], retries;
	if ( msg.escPaths.length > 0 ) {
		var escPlanDataService = new EvernymEscPlanService();
		escPlanDataService.getCommethods(callbacks);
		for(var pathcounter = 0; pathcounter < msg.escPaths.length; pathcounter++) {
			var ultext = '', emaillitext = '', phonelitext = '';
			for( var pathcounter_steps = 0; pathcounter_steps < msg.escPaths[pathcounter].steps.length; pathcounter_steps++ ) {
				retries = 0;
				for ( var pathcounter_steps_seq = 0; pathcounter_steps_seq < msg.escPaths[pathcounter].steps[pathcounter_steps].retries.length; pathcounter_steps_seq++ ) {
					retries = retries + parseInt(msg.escPaths[pathcounter].steps[pathcounter_steps].retries[pathcounter_steps_seq].totalDuration)/parseInt(msg.escPaths[pathcounter].steps[pathcounter_steps].retries[pathcounter_steps_seq].interval); 
				}
				if( msg.escPaths[pathcounter].steps[pathcounter_steps].comMethodType == 'EMAIL') {
					retries = isNaN(retries)?'Needed':retries+' retries ';
					for ( var i = 0; i < defaultCommethods.commethod.length; i++) {
						//if((defaultCommethods.commethod[i].type == "EMAIL") && (defaultCommethods.commethod[i].dflt == "Y")) {
						if(defaultCommethods.commethod[i].type == "EMAIL") {
							if (defaultCommethods.commethod[i].dflt == "N") {
								emaillitext += '<li class="mail"><strong>'+defaultCommethods.commethod[i].address+'</strong><span>Needed</span></li>';
							}
							else {
								emaillitext += '<li class="mail"><strong>'+defaultCommethods.commethod[i].address+'</strong><span>'+retries+'</span></li>';
							}
						}
					}
				}
				else {
					retries = isNaN(retries)?'Needed':retries+' retries ';
					for ( var i = 0; i < defaultCommethods.commethod.length; i++) {
						//if((defaultCommethods.commethod[i].type == "TXT") && (defaultCommethods.commethod[i].dflt == "Y")) {
						if(defaultCommethods.commethod[i].type == "TXT") {
							if (defaultCommethods.commethod[i].dflt == "N") {
								phonelitext += '<li class="mail"><strong>'+defaultCommethods.commethod[i].address+'</strong><span>Needed</span></li>';
							}
							else {
								phonelitext += '<li class="mail"><strong>'+defaultCommethods.commethod[i].address+'</strong><span>'+retries+'</span></li>';
							}
						}
					}					
					//phonelitext = '<li><strong>phone number (TXT)</strong><span>Needed</span></li>';
				}
			}
			ultext =  phonelitext + emaillitext;
			plan.push('<a class="alldetails" href="#" id="'+msg.escPaths[pathcounter].urgencyName+'"><span class="emergency ' +msg.escPaths[pathcounter].urgencyName.toLowerCase()+'"></span><strong class="details">'+msg.escPaths[pathcounter].urgencyName+'</strong><ul>'+ultext+'</ul></div></a>');	
		}
	}
	$(tagtobeFilled).append(plan);	
	$('a.alldetails').off('click').on('click',function(event) {		
		//$.mobile.loading('show');
		urgencyname = $(this).attr('id');
		goToView('escalationPlanSingleView');
		urgencynameTxt = urgencyname.toLowerCase();
		urgencynameTxt =  urgencyname.replace(/([^ -])([^ -]*)/gi,function(v,v1,v2){ return v1.toUpperCase()+v2; });
	});
}
/*
 * 
 */
function deletion(msg,tagtobeFilled,accesstokenvalue) {	
	var details;
	$(tagtobeFilled).html('');
	for(var i = 0;i<msg.commethod.length;i++) {
		details =('<div class="addnewno"><em class="remove-msg-no"></em><span>'+msg.commethod[i].address+'</span><a class="deleteemail" href="#" id="'+msg.commethod[i].id+'">delete</a></div>');
		$(tagtobeFilled).append(details);		
	}
	$('em.remove-msg-no').off('click').on('click', function() {		
		if($(this).hasClass('remove-msg-no')) {
			$(this).removeClass('remove-msg-no').addClass('remove-delete');
			$(this).parent().children('a.deleteemail').css('display','block');		
		}
		else { 
			$(this).addClass('remove-msg-no').removeClass('remove-delete');
			$(this).parent().children('a.deleteemail').css('display','none');
		}		
	});
	$('a.deleteemail').off('click').on('click', function(event) {		
		//$.mobile.loading('show');
		$(this).parent().remove();			
		var delid = $(this).attr('id');		
		ajaxCallforDel(delid,accesstokenvalue);
	});
	/*setTimeout(function(){
		$.mobile.loading('hide');
	}, 1000);	*/		
}
function AddedEmail( msg, tagtobeFilled ) {
	var emailids,flag = false,tab;
	$(tagtobeFilled).html('');
	if( msg.commethod.length == 0) { 
 		$('#default_page').css('display','block');
		$('#pageHavingContent').css('display','none');
		$.mobile.loading('hide');			
	}
	else if ( msg.commethod.length > 0 ) {	
 		for(var i = 0;i<msg.commethod.length;i++) {	
			if(msg.commethod[i].type == "TEXT" ) {
				  $('#addTXT').css('display','none');
    			flag = true;
			}
			tab = (msg.commethod[i].type == "EMAIL")?('<div class="addnewno notverify">'):('<div class="addnewno notverify txtphoneimage">');		
			if((msg.commethod[i].type == "EMAIL") && (msg.commethod[i].verified == 'Y')) {
				verifytab = ('<div class="addnewno">'); 
			}
			else if((msg.commethod[i].type == "TEXT") && (msg.commethod[i].verified == 'Y')){ 
				verifytab = ('<div class="addnewno txtphoneimage">');
			}
			if((msg.commethod[i].verified == 'N') ) {
			 emailids = (tab+'<em></em><span>'+msg.commethod[i].address+'</span><a class="addbtn verify" href="#" title="'+msg.commethod[i].address+'" id="'+msg.commethod[i].id+'">VERIFY</a></div>');
			}
			else {			 
			 emailids = (verifytab+'<em></em><span>'+msg.commethod[i].address+'</span></div>');
			}	
			$(tagtobeFilled).append(emailids);										
			$('.verify').off('click').on('click', function(event) {						
				verification_com_method_id = $(this).attr('id');				
				verification_com_method = $(this).attr('title');					
				//$.mobile.changePage("verification.html",{transition:"none"});	
				goToView('verifyContactView'); 	
			});			
		}
	}
	if(flag == false) {
		$('#addTXT').css('display','block');	
	}	
}
var app = {
	// Application Constructor
	initialize: function() {
			this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
			document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady: function() {
			//setTimeout(function() {navigator.splashscreen.hide();}, 1000);
	},
	ajaxcall : function(url, functionToBeCalled) {
		var data = {"accountname":"demo","password":"demo","appToken":"sNQO8tXmVkfQpyd3WoNA6_3y2Og="};
		$.ajax({
			url:baseUrl+url,
			type:'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			dataType : "JSON",		
			async:false,			
			cache:false,			
			success: function(data) {			
				eval(functionToBeCalled + '(data)');
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {			
				alert(errorThrown);
			}
		});
 	},
/*Access contactlist  from server*/
ajaxcallemailid : function(url,functionToBeCalled, tagtobeFilled, accesstokenvalue) { 
  contact_details = common_ajax(url, 'GET', accesstokenvalue);
  eval(functionToBeCalled + '( contact_details, tagtobeFilled )');
 },
ajaxcall_create_com_method : function(url,phoneoremail,accesstokenvalue, type) {
	var addemail  = { "name":"demo","type":type,"address":phoneoremail };
	return commonajax(url, 'POST', addemail, accesstokenvalue);
},

ajaxcallForSendingemailVerificationCode : function(url, RecentlyaddedEmailid,accesstokenvalue) {
	var urlforsendverificationcode = url+RecentlyaddedEmailid+'/verification';	
	var responseData = common_ajax(urlforsendverificationcode, 'POST', accesstokenvalue);	
	/*setTimeout(function(){
		$.mobile.loading('hide');
	}, 1000);*/	
},
/* Urgency*/
ajaxescplan : function(url,functionToBeCalled, tagtobeFilled,accesstokenvalue) {
	esc_plans = common_ajax(url, 'GET', accesstokenvalue);
  eval(functionToBeCalled + '(esc_plans,tagtobeFilled,accesstokenvalue)');
},
ajaxcall_com_method_Verification : function(url,digitCode,accesstokenvalue) {	
	var email_verify = url+digitCode;
  var responseData = changePageOnSuccess(email_verify, 'PUT', accesstokenvalue);
	/*setTimeout(function(){
		$.mobile.loading('hide');
	}, 1000);*/		
 },
};
function ajaxCallforDel(comMethod,accesstokenvalue) {
	var response = common_ajax('commethod/'+comMethod, 'DELETE', accesstokenvalue);
	/*setTimeout(function(){
		$.mobile.loading('hide');
	}, 1000);	*/	
}
function showhideerror () {
	$('.error-message').html( '' );
}