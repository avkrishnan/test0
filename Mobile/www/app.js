var ES = {
	evernymService: new EvernymService()
};
ES.evernymService = new EvernymService();
ES.channelService = new EvernymChannelService(ES.evernymService);
ES.commethodService = new EvernymCommethodService(ES.evernymService);
ES.loginService = new EvernymLoginService(ES.evernymService);
ES.systemService = new EvernymSystemService(ES.evernymService);
ES.messageService = new EvernymMessageService(ES.evernymService);
ES.escplanService = new EvernymEscPlanService(ES.evernymService);

ES.evernymService.doAfterDone = function(){
    $.mobile.hidePageLoadingMsg();
};    

ES.evernymService.doAfterFail = function(ajaxParams, jqXHR, textStatus, errorThrown, details){
    $.mobile.hidePageLoadingMsg();
		if(jqXHR.responseJSON.code == '100201' || jqXHR.responseJSON.code == '100202' || jqXHR.responseJSON.code == '100203') {
			ES.evernymService.clearAccessToken();
			authenticate();
			var toastobj = {type: 'toast-error', text: jqXHR.responseJSON.message};
			showToast(toastobj);
		}
		else {
			var hash = $.mobile.urlHistory.getActive().hash;
			if (isBadLogin(details.code) && hash.indexOf("loginView") == -1){
			
			ENYM.ctx.setItem("login_nav", JSON.stringify({'hash': hash, 'params': ajaxParams}));
			
			}
		}
};

function goToView(view) {
	$.mobile.changePage( "#" + view, {allowSamePageTransition: true});
}

function goToChannel(select) {
	startBroadcast(select.value);
}

ko.virtualElements.allowedBindings.updateListviewOnChange = true;

ko.bindingHandlers.updateListviewOnChange = {
update: function (element, valueAccessor) {
    
    ko.utils.unwrapObservable(valueAccessor());  //grab dependency
    
    var listview = $(element).parents()
    .andSelf()
    .filter("[data-role='listview']");
    
    if (listview) {
        try {
            $(listview).listview('refresh');
        } catch (e) {
            // if the list view is not initialized, the above call with throw an exception
            // there doe snot appear to be any way to easily test for this state, so
            // we just swallow the exception here.
        }
    }
}
};





function inviteFollowers(){
    
    var channelCount = channelListViewModel.channels().length;
    var cvm  = getCurrentViewModel();
    
    
    if (!channelCount){
        showError('First create a channel, then you can invite followers to it.<br/> <button onclick="goToView(\'channelNewView\');closeError();">create channel</button><br/>');
    }
    else if (channelCount == 1){
        ENYM.ctx.setItem("currentChannel", JSON.stringify(channelListViewModel.channels()[0]));
        $.mobile.changePage( "#inviteFollowersView" , {allowSamePageTransition: true});
        
    }
    else if (cvm.isChannelView){
    
        $.mobile.changePage( "#inviteFollowersView" , {allowSamePageTransition: true});
        
                             
        
    }
    else {
    
        $.mobile.changePage( "#channelListView" , {allowSamePageTransition: true});
    
    }
    
    
}


function initiateBroadcast(){

    var channelCount = channelListViewModel.channels().length;
    var cvm  = getCurrentViewModel();
    
    
    if (!channelCount){
        showError('First create a channel, then you can send an alert to it.<br/> <button onclick="goToView(\'channelNewView\');closeError();">create channel</button><br/>');
    }
    else if (channelCount == 1){
    
        
        startBroadcast( channelListViewModel.channels()[0].normName );
        
    }
    else if (cvm.isChannelView){
    
        var currentChannel = ENYM.ctx.getItem("currentChannel");
        var lchannel = JSON.parse(currentChannel);
               
        startBroadcast(lchannel.normName);                     
        
    }
    else {
        $.mobile.changePage( "#channelListView" , {allowSamePageTransition: true});
    }
    
    

}

var messages = 0;
var activePage = '';
var openPanel = false;

function startBroadcast(channel){
    $.mobile.activePage.find('#mypanel').panel("close");
    $.mobile.changePage("#" + channelMenuViewModel.template );
    channelMenuViewModel.activate({id:channel}, 'newbroadcast');
}

function showMessage(msg){
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
	.css({ display: "block",
         opacity: 0.90,
         position: "fixed",
         padding: "7px",
         "text-align": "center",
         width: "270px",
         left: ($(window).width() - 284)/2,
         top: $(window).height()/2 })
	.appendTo( $.mobile.pageContainer ).delay( 1500 )
	.fadeOut( 400, function(){
             $(this).remove();
             });
}

function closeError(){
    $("#errordiv").fadeOut( 400, function(){
                              $(this).remove();
                              });
    
}

function showError(msg){
    
    var existingdiv = $("#errordiv").get(0);
    
    // TODO: add some code to append the message to the box, instead of just ignoring and throwing it away if there is already
    // an existing error message.
    
    
    if (!existingdiv){
        
        $("<div id='errordiv' class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg +
          "<br/><button onclick='closeError();' style='font-size:16pt;'>ok</button></h3></div>")
        .css({ display: "block",
             opacity: 0.90,
             position: "fixed",
             padding: "7px",
             "text-align": "center",
             width: "270px",
             left: ($(window).width() - 284)/2,
             top: $(window).height()/2 })
        .appendTo( $.mobile.pageContainer ).delay( 1500 )
        ;
        
    }
}



function closeFeedback(){
    
    $("#feedbackdiv").fadeOut( 400, function(){
                  $(this).remove();
                  });
}

function submitFeedback(){
    
    var vm = getCurrentViewModel();
    var viewid = vm.viewid;
    var viewname = vm.viewname;
    function sentFeedback(data){
        $("#feedbackdiv").fadeOut( 400, function(){
                                  $(this).remove();
                                  showMessage("Thanks. Your feedback has been submitted for the page: " + viewid + " " + viewname);
                                  });
    }
    function errorSendingFeedback(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (loginPageIfBadLogin(details.code)){
            showError("Please log in or register to view this channel.");
		}
        else {
		    showError("Error Sending Feedback: " + ((status==500)?"Internal Server Error":details.message));
		}
	}
    var callbacks = {
        success: sentFeedback,
        error: errorSendingFeedback
    };
    var feedback_comments = $("#feedbacktextarea").val();
    var feedbackObject = {
        comments: feedback_comments,
        context: viewid + " " + viewname
    };
    ES.systemService.sendFeedback(feedbackObject, callbacks);
}


function getCurrentViewModel(){
    var vm = ko.dataFor($.mobile.activePage.get(0));
    return vm;
}

function showFeedback(){
    
    var existingdiv = $("#feedbackdiv").get(0);
    
    if (!existingdiv){
    
	$("<div id='feedbackdiv' class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'>" +
      "<textarea id='feedbacktextarea' style='width:250px;height:70px;resize:none;'></textarea><br/>" +
      "<button onclick='submitFeedback();'>Submit</button>&nbsp;&nbsp;" +
      "<button onclick='closeFeedback();'>Cancel</button><br/>" +
      "</div>")
	.css({ display: "block",
         opacity: 0.90,
         position: "fixed",
         padding: "7px",
         "text-align": "center",
         width: "270px",
         left: ($(window).width() - 284)/2,
         top: "20px" /* $(window).height()/2 - 145 */ })
	.appendTo( $.mobile.pageContainer ).delay( 1500 )
	;
    }
    
    
}


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, this.length + fromIndex);
        }
        for (var i = fromIndex, j = this.length; i < j; i++) {
            if (this[i] === obj)
                return i;
        }
        return -1;
    };
}


function convDate(d){
    
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep', 'Oct', 'Nov', 'Dec'];
    
    var date = new Date();
    var offset = date.getTimezoneOffset();
    var d = new Date(d  + offset);
    
    var month = d.getMonth();
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    
    var output =   months[month] + ' ' +
     day + ', ' + 
    d.getFullYear() + 
    ', ' +
    ((hour == 0|| hour == 12 )?12:hour%12) + ':' +
    ((''+minute).length<2 ? '0' :'') + minute + ' ' +
    (hour < 12? 'am' : 'pm');
    
    
    return output;
}


function isBadLogin(code){
    
    var loginBadCodes = [100110, 100201, 100202, 100203, 100400];
    var rval = false;
    if(loginBadCodes.indexOf(code) != -1){
        rval = true;
    }
    
    return rval;
    
}

function loginPageIfBadLogin(code){
    var isbad = isBadLogin(code);
    if (isbad){
        $.mobile.changePage("#" + loginViewModel.template);
    }
    return isbad;
}


function getClassName(classobject) {
    return classobject.constructor.name;
}



// create the various view models

/* Jared's Code to be activated when required */
//unsubscribeModel = new UnsubscribeModel(),
//selectIconViewModel = new SelectIconViewModel(),
//followChannelViewModel = new FollowChannelViewModel()
//channelBroadcastsViewModel = new ChannelBroadcastsViewModel(),
//followerViewModel = new FollowerViewModel(),
//userSettingsModel = new UserSettingsViewModel(),
//devSettingsModel = new DevSettingsViewModel(),
//panelHelpViewModel = new PanelHelpViewModel(),
//notificationsViewModel = new NotificationsViewModel(),
//panelHelpViewModel = new PanelHelpViewModel(),

var
loginViewModel = new LoginViewModel(),
homeViewModel = new HomeViewModel(),
channelsFollowingListViewModel = new ChannelsFollowingListViewModel(),
channelViewModel = new ChannelViewModel(),

channelMenuViewModel = new ChannelMenuViewModel(),
channelSettingsViewModel = new ChannelSettingsViewModel(),
channelNewViewModel = new ChannelNewViewModel(),

sendMessageViewModel = new SendMessageViewModel(),
followersListViewModel = new FollowersListViewModel(),
inviteFollowersViewModel = new InviteFollowersViewModel(),
forgotPasswordViewModel = new ForgotPasswordViewModel(),
resetPasswordViewModel = new ResetPasswordViewModel(),

/*By Devedner*/
userSettingsViewModel = new UserSettingsViewModel(),
escalationPlanSingleViewModel = new EscalationPlanSingleViewModel(),
addContactViewModel = new AddContactViewModel(),
additionalContactViewModel = new AdditionalContactViewModel(),
verifyContactViewModel = new VerifyContactViewModel(),
channelMessagesViewModel = new ChannelMessagesViewModel(),
channelSingleMessagesViewModel = new ChannelSingleMessagesViewModel(),
channelViewUnfollowModel = new ChannelViewUnfollowModel(),
changePasswordViewModel = new ChangePasswordViewModel(),
/* end*/

tutorialViewModel = new TutorialViewModel(),
signupStepFirstViewModel = new SignupStepFirstViewModel(),
signupStepSecondViewModel = new SignupStepSecondViewModel(),
channelsIOwnViewModel = new ChannelsIOwnViewModel(),
helpViewModel = new HelpViewModel(),
aboutEvernymViewModel = new AboutEvernymViewModel(),
feedbackViewModel = new FeedbackViewModel(),
administratorViewModel = new AdministratorViewModel(),
sendFeedbackViewModel = new SendFeedbackViewModel(),
privacyPolicyViewModel = new PrivacyPolicyViewModel(),
administratorFeedbackViewModel = new AdministratorFeedbackViewModel(),
singleFeedbackViewModel = new SingleFeedbackViewModel(),

/* By Pradeep */
channelMainViewModel = new ChannelMainViewModel(),
channelChangeNameViewModel = new ChannelChangeNameViewModel(),
editShortDescriptionViewModel = new EditShortDescriptionViewModel(),
channelDeleteViewModel = new ChannelDeleteViewModel(),

channelChangeIconViewModel = new ChannelChangeIconViewModel(),
firstChannelViewModel = new FirstChannelViewModel(),
registrationVerifyViewModel = new RegistrationVerifyViewModel(),
singleMessageFullTextViewModel = new SingleMessageFullTextViewModel(),

singleMessageRepliesViewModel = new SingleMessageRepliesViewModel(),
replyDetailViewModel = new ReplyDetailViewModel(),
addInviteFollowersViewModel = new AddInviteFollowersViewModel(),
addFollowersViewModel = new AddFollowersViewModel(),

editNameViewModel = new EditNameViewModel(),
editLongDescriptionViewModel = new EditLongDescriptionViewModel(),
requestiGiHelpViewModel = new RequestiGiHelpViewModel(),

escalateHelpViewModel = new EscalateHelpViewModel(),
escalateSettingsViewModel = new EscalateSettingsViewModel(),
escalateTimeSettingsViewModel = new EscalateTimeSettingsViewModel(),
followerDetailsViewModel = new FollowerDetailsViewModel(),

editFollowerDetailsViewModel = new EditFollowerDetailsViewModel(),
removeFollowerViewModel = new RemoveFollowerViewModel(),
notGotItViewModel = new NotGotItViewModel(),
whoGotItViewModel = new WhoGotItViewModel(),
recipientDetailsViewModel = new RecipientDetailsViewModel(),

singleMessageViewModel = new SingleMessageViewModel(),
userGuideViewModel = new UserGuideViewModel(),
plusMenuViewModel = new PlusMenuViewModel(),
channelIntroViewModel = new ChannelIntroViewModel(),

nameRequiredViewModel = new NameRequiredViewModel(),
forgotEvernymViewModel = new ForgotEvernymViewModel(),
messageLengthWarningViewModel = new MessageLengthWarningViewModel(),
newFollowersSettingsViewModel = new NewFollowersSettingsViewModel(),

followChannelViewModel = new FollowChannelViewModel(),
invitedFollowersViewModel = new InvitedFollowersViewModel(),
declinedFollowersViewModel = new DeclinedFollowersViewModel(),
unreachableFollowersViewModel = new UnreachableFollowersViewModel(),

afterLoginVerifyViewModel = new AfterLoginVerifyViewModel()
/* end */
;

// load the stored state (recent searches)

$.mobile.defaultPageTransition = ""; //"slide";

var models = [
							/* Jared's Code to be activated when required */
              //unsubscribeModel,
              //selectIconViewModel,
              //followChannelViewModel,
              //channelBroadcastsViewModel,
              //followerViewModel,
              //userSettingsModel, 
              //devSettingsModel, 
              //notificationsViewModel,
              //panelHelpViewModel, 
              //messageViewModel,																												
              loginViewModel,
              homeViewModel,
              channelsFollowingListViewModel,
              channelViewModel,
              channelMenuViewModel,
              channelSettingsViewModel,
              channelNewViewModel,            
              sendMessageViewModel,
              followersListViewModel,
              inviteFollowersViewModel, 
              forgotPasswordViewModel,
              resetPasswordViewModel,
              singleMessageViewModel,
              userSettingsViewModel,
              escalationPlanSingleViewModel,
              addContactViewModel,
              additionalContactViewModel,
              verifyContactViewModel,
							signupStepFirstViewModel,
							signupStepSecondViewModel,
							tutorialViewModel,
							channelsIOwnViewModel,
							helpViewModel,
							aboutEvernymViewModel,
							feedbackViewModel,
							sendFeedbackViewModel,
							privacyPolicyViewModel,
							channelMainViewModel,
							channelChangeNameViewModel,
							editShortDescriptionViewModel,
							channelDeleteViewModel,
							channelChangeIconViewModel,
							firstChannelViewModel,
							channelMessagesViewModel,
							registrationVerifyViewModel,
							singleMessageFullTextViewModel,							
							channelViewUnfollowModel,
							singleMessageRepliesViewModel,
							replyDetailViewModel,
							channelSingleMessagesViewModel,
							addInviteFollowersViewModel,
							addFollowersViewModel,
							editNameViewModel,							
							editLongDescriptionViewModel,
							changePasswordViewModel,
							requestiGiHelpViewModel,
							escalateHelpViewModel,
							escalateSettingsViewModel,
							escalateTimeSettingsViewModel,
							followerDetailsViewModel,
							removeFollowerViewModel,
							notGotItViewModel,
							whoGotItViewModel,
							recipientDetailsViewModel	,
							userGuideViewModel,
							plusMenuViewModel,
							channelIntroViewModel,
							nameRequiredViewModel,
							administratorViewModel, 
							administratorFeedbackViewModel,
							singleFeedbackViewModel,
							forgotEvernymViewModel,
							messageLengthWarningViewModel,
							newFollowersSettingsViewModel,
							followChannelViewModel,	
							editFollowerDetailsViewModel,
							invitedFollowersViewModel,
							declinedFollowersViewModel,
							unreachableFollowersViewModel,
							afterLoginVerifyViewModel
            ];

function getHTMLName(viewModel){
    var name = getClassName(viewModel).replace("Model","");
    return name.charAt(0).toUpperCase() + name.slice(1) + ".html";
}


function getViewName(viewModel){
    var name = getClassName(viewModel);
    return name.charAt(0).toLowerCase() + name.slice(1).replace("Model","");
}


                  /**
 * Determine whether the file loaded from PhoneGap or not
 */
/*function isPhoneGap() {
    return (cordova || PhoneGap || phonegap) 
    && /^file:\/{3}[^\/]/i.test(window.location.href) 
    && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}*/





function loadAllPages() {
    
  var getarray = [], i, len;
  for (i = 0, len = models.length; i < len; i += 1) {
    var page = getHTMLName(models[i]);
    console.log("loading page: " + page);
    var promise = $.mobile.loadPage( "views/" + page, {pageContainer: $('#allpages'), allowSamePageTransition: true} );
    getarray.push( promise );
  };
  return $.when.apply($, getarray).done(function () {
    for (i = 0, len = models.length; i < len; i += 1) {
      var name = getClassName(models[i]);
      var model = models[i];
      var view = getViewName(model);
      console.log("binding ko: " + view);
      ko.applyBindings(model, document.getElementById(view));
      if (model.applyBindings){
        model.applyBindings();
      }
    }
  });
};

	$(document).ready(function () {
		// bind each view model to a jQueryMobile page
		console.log("document ready");
		var token = ENYM.ctx.getItem("accessToken");
		if (document.location.hash == ""){
			if (token) {
				//document.location.hash = "#channelListView";
				document.location.hash = "#channelsIOwnView";
			}
			else {
				document.location.hash = "#loginView";
			}
		}
		console.log('hash: ' + document.location.hash);
		$.mobile.activeBtnClass = '';
		//$("#channelListView").page("destroy").page();
		//var currentUrl = $.mobile.path.parseUrl(window.location.href);
		//console.log("currentUrl: " + currentUrl.hash);
		ENYM.ctx.removeItem('baseUrl');
		loadAllPages().done(function() {
			console.log('done loading all pages.');
			console.log("INITIALIZE PAGE");
			$.mobile.initializePage();
			/*if (token){
				function gotChannels(data){
					channelListViewModel.channels.removeAll();
					channelListViewModel.channels(data.channel);
				}
				channelListViewModel.listMyChannelsCommand().then(gotChannels);
				channelMenuViewModel.getUrgencySettings();
			}*/
		});
	});


$(document).on('pagebeforecreate', '[data-role="page"]', function(e,a){
               
               console.log("creating " + $(this).attr('id'));
               
               $(this).find('#gpanel').append($("#globalpanel #mypanel").clone());
               $(this).find('#gpaneldots').append($("#globalpaneldots #mypaneldots").clone());
               $(this).find('#gfooter').after($("#globalfooter #thefooter").clone());
               
               $(this).page({ domCache: true });
               
               });



$(document).on('pagebeforehide', '[data-role="page"]', function(e,a){
               
               console.log("hiding page: " + $(this).attr('id'));
               ENYM.ctx.setItem('previousView', $(this).attr('id') );
               
               });


$(document).on('pagebeforeshow', '[data-role="page"]', function(e,a) {
	console.log("showing page: " + $(this).attr('id'));
	var vm = ko.dataFor(this);
	var token = ENYM.ctx.getItem("accessToken");
	document.title = vm.displayname;	
	
	if ( vm && vm.hasfooter && token){
		// The reason the footer is appended on the pagebeforeshow instead of pagebeforecreate is because it relies on the viewmodel for some information to build it.
		var viewid = vm.viewid;
		var viewname = vm.viewname;
		
		/*
		if (! $(this).find("#thefooter").length ){
		$(this).append($("#globalfooter #thefooter").clone());
		}
		*/
		var name = ENYM.ctx.getItem('accountName');
		$(this).find('#thefooter #footer-gear').html(name);
		$(this).find('#thefooter #viewid').html(viewid + " " + viewname);
	}
	else {
		$(this).find("#thefooter").remove();
	}
	//$(this).page();
	/*
	//if( panelHelpViewModel.isDirty($(this).attr('id'))){
	var panelhtml = $("#globalpanel").find('#mypanel').html();
	$(this).find('#mypanel').html(panelhtml);
	$(this).find('#mypanel').panel();
	$(this).find('#mypanel').trigger('create');
	var panelhtml = $("#globalpaneldots").find('#mypaneldots').html();
	$(this).find('#mypaneldots').html(panelhtml);
	$(this).find('#mypaneldots').panel();
	$(this).find('#mypaneldots').trigger('create');
	*/
	/*
	var panel = $(this).find('#mypanel').get(0);
	if (panel){
	myScroll = new iScroll(panel);
	}
	*/
	//}
});



/*
$(document).on('swiperight', '[data-role="page"]', function(e,a){
               if (!openPanel)
               $(this).find('#mypanel').panel("open");
               
               });

*/

$(document).on('swipeleft', '[data-role="page"]', function(e,a){
               if (!openPanel)
               $(this).find('#mypanel').panel("open");
               
               
               });



$(document).on('expand', '[data-role="collapsible"]', function(e,a){
               
               $(this).find('span.ui-btn-inner').css({
                                                     'background':'#D1D3D4',
                                                     'border-top':'#F1F2F2',
                                                     'border-bottom':'#A7A9AC'
                                                     
                                                     })
               
               ;
               
               $(window).resize();
               
               
               });


$(document).on('collapse', '[data-role="collapsible"]', function(e,a){
               
               $(this).find('span.ui-btn-inner').css({
                                                     'background':'',
                                                     'border-top':'',
                                                     'border-bottom':''
                                                     
                                                     })
               
               ;
               $(window).resize();
               
               
               
               });


$(document).bind('pagebeforechange', function (event, data) {
                 
                 
                 //$.mobile.activePage.attr('id')
                 
                 //alert(data.toPage);
                 
                 $.mobile.pageData = (data && data.options && data.options.pageData)
                 ? data.options.pageData
                 : null;
                 });



$(document).bind('panelclose', function(e, data) {
                 
                 openPanel = false;
                 });

$(document).bind('panelopen', function(e, data) {
                 
                 openPanel = true;//e.target.id;
                 });

$(document).bind('panelbeforeclose', function(e, data) {
                 
                 
                 $(".ui-panel").scrollTop(0);
                 });

$(document).bind('panelbeforeopen', function(e, data) {
                 
                 
                 top_pos = $(document).scrollTop();
                 $(".ui-panel").css("top", top_pos);
                 
                 
                 
                 });
								 
/* By pradeep kumar */
/* Back navigation functions and variables used
 *
 * backtext - text which is diplayed in back button
 * backView - view page id (when click back button it, redirect to this id)
 * targetView - view page id (when click it, redirect to this id)
 *
*/
if(!ENYM.ctx.getItem('backNavText') || !ENYM.ctx.getItem('backNavView')) {
	var backNavText = [];
	var backNavView = [];
} else {
	var backNavText = JSON.parse(ENYM.ctx.getItem('backNavText'));
	var backNavView = JSON.parse(ENYM.ctx.getItem('backNavView'));
}

function viewNavigate(backText, backView, targetView) {
	if($.mobile.activePage.attr('id') != targetView) {
		if(backNavView[backNavView.length-1] != backView) {
			backNavText.push(backText);
			ENYM.ctx.setItem('backNavText', JSON.stringify(backNavText));	
			backNavView.push(backView);
			ENYM.ctx.setItem('backNavView', JSON.stringify(backNavView));
		}
	}
	$('#'+$.mobile.activePage.attr('id')+' .toast-notification').html('');	
	$.mobile.changePage( "#" + targetView, {allowSamePageTransition: true});		
}		

function popBackNav() {
	backNavText.pop();
	ENYM.ctx.removeItem('backNavText');	
	ENYM.ctx.setItem('backNavText', JSON.stringify(backNavText));				
	var targetView = goToView(backNavView.pop());
	ENYM.ctx.removeItem('backNavView');		
	ENYM.ctx.setItem('backNavView', JSON.stringify(backNavView));
	$.mobile.changePage( "#" + targetView, {allowSamePageTransition: true});			
}

/* Toast messages function */
function showToast(toastobj) {
	if(toastobj.redirect) {	
		$('#'+toastobj.redirect+' .toast-notification').html('<div class="toast-text '+toastobj.type+'">'+toastobj.text+'</div>');			
	}
	else {
		$('#'+$.mobile.activePage.attr('id')+' .toast-notification').html('<div class="toast-text '+toastobj.type+'">'+toastobj.text+'</div>');				
	}
	$('.toast-notification').delay(500).slideDown(500, function() {
		$('.toast-notification').show();
	}).delay(1800).slideUp(700, function() {
		$('#'+$.mobile.activePage.attr('id')+' .toast-notification').html('');
	});
}

/* Get current date/time values */
function _getDate(functionName) {
	var _date = new Date();
	return _date[functionName]();	
}
/* This function converts passed date into a desired format*/
function formatDate(date, format, source) {
	if(typeof(date) === 'undefined') {
		date = new Date();
	}
	if(typeof(format) === 'undefined') {
		format = 'short';
	}
	if(typeof(source) === 'undefined') {
		source = '';
	}	
	var newDate = new Date(moment(date)); // TO DO (DEVENDER) replace this js code with Moment library
	var shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep', 'Oct', 'Nov', 'Dec'];
	var longMonths  = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
	var longDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var year 	= newDate.getFullYear();
	var month 	= newDate.getMonth();
	var day			= newDate.getDate();
	var weekDay	= newDate.getDay();
	var hour 		= newDate.getHours();
	var minute 	= newDate.getMinutes();
	var todaysDay = new Date().getDate();
	var todaysYear = new Date().getFullYear();
	//var output 	= months[month] + ' ' + day + ', ' + newDate.getFullYear() +  ', ' +((hour == 0|| hour == 12 )?12:hour%12) + ':' +((''+minute).length<2 ? '0' :'') + minute + ' ' + (hour < 12? 'am' : 'pm');
	var output;
	switch(format) {
		case 'short' :
			if(day == todaysDay) {
				if(source == 'follow' || source == 'main') {
					output 	= 'TODAY, ' + ((hour == 0|| hour == 12 ) ? 12 : hour % 12) + ':' + (('' + minute).length<2 ? '0' :'') + minute + ' ' + (hour < 12? 'AM' : 'PM');
				}
				else {
					output 	= ((hour == 0|| hour == 12 ) ? 12 : hour % 12) + ':' + (('' + minute).length<2 ? '0' :'') + minute + ' ' + (hour < 12? 'AM' : 'PM');
				}
			}
			else if(year > todaysYear) {
				if(source == 'follow' || source == 'main') {
					output 	= month + '/' + day + '/' + year;	
				}
				else {
					output 	= month + '/' + day + '/' + year + ((hour == 0|| hour == 12 ) ? 12 : hour % 12) + ':' + (('' + minute).length<2 ? '0' :'') + minute + ' ' + (hour < 12? 'AM' : 'PM');
				}
			}
			else {
				if(source == 'follow' || source == 'main') {
					output 	= shortMonths[month] + '. ' + day + ', ' +  ((hour == 0|| hour == 12 ) ? 12 : hour % 12) + ':' + (('' + minute).length<2 ? '0' :'') + minute + ' ' + (hour < 12? 'AM' : 'PM');
				}
				else {
					output 	= shortMonths[month] + '. ' + day;
				}
			}
			break;
		case 'long':
			//output 	= newDate.toLocaleString();
			output = longDays[weekDay] + ' ' + shortMonths[month] + '. ' + day + ', ' + year + ' ' +  ((hour == 0|| hour == 12 ) ? 12 : hour % 12) + ':' + (('' + minute).length<2 ? '0' :'') + minute + ' ' + (hour < 12? 'AM' : 'PM');
			break;
	}
	return output;
}

/* Hide footer on mobile keypad */
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  var initialScreenSize = window.innerHeight;
  window.addEventListener("resize", function() {
    if(window.innerHeight < initialScreenSize) {
      $('.footer').hide();
    } else {
      $('.footer').show();
    }
  });
}

//feedbackType = ''; // For setting feedback type

/* Validate user via access token */
function authenticate() {
	var token = ES.evernymService.getAccessToken();
	if(token == '' || token == null) {
		sendMessageViewModel.clearForm();		
		goToView('loginView');
		return false;
	}
	return true;
}

/* pradeep kumar end */

/* Time conversion into time ago*/
function time2TimeAgo(ts) {
	endDate = new Date();
	startDate = new Date(ts);
	var diff = startDate - endDate;
	var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
	startDate.setHours(0,0,0,1);  // Start just after midnight
	endDate.setHours(23,59,59,999);  // End just before midnight
	var diff = endDate - startDate;  // Milliseconds between datetime objects    
	var days = Math.ceil(diff / millisecondsPerDay);
	days = days-1;
	if(days == 1) {
		return ' yesterday';
	}	
	else if(days > 1) {
		return formatDate(ts, 'short');
	}
	else if(days < 1) {
		var newDate = new Date(ts).getTime();
		var ms = new Date().getTime() - newDate;				
		var secs = Math.floor(ms / 1000);
		var msleft = ms % 1000;
		var totalHours = Math.floor(secs / (60 * 60));
		var hours = totalHours % 24;
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);
		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);
		if(hours == 1) {
			return hours + ' hr ago';		
		} 
		else if(hours > 1) {
			return hours + ' hrs ago';
		} 
		else if(minutes == 1) {
			return minutes + ' min ago';
		} 
		else if(minutes > 1) {
			return minutes + ' mins ago';		
		} 
		else if(seconds > 1) {
			return  seconds + ' secs ago';
		}
		else {
			return  'just now';
		}						
	}
}

/* External markup for Header/Overlay etc*/
function addExternalMarkup(viewID) {
	$('#' + viewID + ' header.logged-in').load('header.html');
	$('#' + viewID + ' .active-overlay').load('overlaymessages.html');
}

/* Function to truncate message text on the basis of screen szie for overlay*/
function truncatedText() {
	var screenSize = $(window).width();
	if(screenSize < 400) {
		return screenSize/7;
	}
	else if (screenSize > 400 && screenSize < 600) {
		return screenSize/6;
	}
	else if(screenSize > 600 && screenSize < 800) {
		return screenSize/5;
	}
	else {
		return screenSize/4;	
	}
}
/* Function to truncate message text on the basis of screen szie*/
function truncatedTextScreen() {
	var screenSize = $(window).width();
	if(screenSize < 400) {
		return screenSize/11;
	}
	else if (screenSize > 400 && screenSize < 700) {
		return screenSize/8;
	}
	else {
		return screenSize/8;
	}
}

/* This function validates USA phonenumber for 10 digits and returns dashed phone number or error object*/
function validateUSAPhone(txtPhone) {
	var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	var phonepatternforhyphen = /^\d+(-\d+)*$/;
  var phoneNumberPatternPlus = /^\+?[0-9]{0,15}$/;
  var phoneHypenPlus = /(?:\(?\+\d{2}\)?\s*)?\d+(?:[ -]*\d+)*$/;

  txtPhone = txtPhone.replace(/[\u00AD\u002D\u2011]+/g,'');
  if(!phoneNumberPatternPlus.test(txtPhone) || ((12>txtPhone.length || txtPhone.length >15) && (txtPhone.charAt(0) == '+'))){
    var phoneObject = {
      type : 'Error',
      text : '<span>Sorry, </span> Not a valid phone number.'
    };
  } else if((txtPhone.charAt(0) != '+') && (!phoneNumberPattern.test(txtPhone)) || (10>txtPhone.length || txtPhone.length >12)) {
    var phoneObject = {
      type : 'Error',
      text : '<span>Sorry, </span> Not a valid phone number.'
    };
  } else {
    if((txtPhone.charAt(0)) == '+') {
      txtPhone = txtPhone.replace(/(.{2})(.{3})(.{3})/,'$1-$2-$3-');
    } else {
      txtPhone = txtPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
	  var phoneObject = {
  		type : 'Text',
  		text : txtPhone
	  };		    
	}
	return phoneObject;
}

/* This function validates email addresses */
function validateEmail(txtEmail) {
	var emailPattern = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if(!emailPattern.test(txtEmail)) {
		var emailObject = {
			type : 'Error',
			text : "<span>Sorry, </span> Not a valid email address."
		};
	} else if(emailPattern.test(txtEmail)) {
		var emailObject = {
			type : 'Email',
			text : txtEmail
		};
	}
	return emailObject;
}