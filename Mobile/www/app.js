/*globals $, ko, document */

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



$(document).bind("mobileinit", function(){
                 $.mobile.autoInitialize = false;
                 });


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
    
    var  systemService = new EvernymSystemService();
    
    
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
    
    
    
    systemService.sendFeedback(feedbackObject, callbacks);
    
    
    
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
    
    var loginBadCodes = [100110, 100201, 100202, 100203];
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


// create the various view models
var
loginViewModel = new LoginViewModel(),
channelListViewModel = new ChannelListViewModel(),
channelsFollowingListViewModel = new ChannelsFollowingListViewModel(),
channelViewModel = new ChannelViewModel(),
channelMenuViewModel = new ChannelMenuViewModel(),
channelSettingsViewModel = new ChannelSettingsViewModel(),
channelBroadcastsViewModel = new ChannelBroadcastsViewModel(),
channelNewViewModel = new ChannelNewViewModel(),
signupViewModel = new SignupViewModel(),
sendMessageViewModel = new SendMessageViewModel(),
followersListViewModel = new FollowersListViewModel(),
inviteFollowersViewModel = new InviteFollowersViewModel(),
followerViewModel = new FollowerViewModel(),
commethodVerificationViewModel = new CommethodVerificationViewModel(),
userSettingsModel = new UserSettingsViewModel(),
devSettingsModel = new DevSettingsViewModel(),
notificationsViewModel = new NotificationsViewModel(),
forgotPasswordViewModel = new ForgotPasswordViewModel(),
resetPasswordViewModel = new ResetPasswordViewModel(),
panelHelpViewModel = new PanelHelpViewModel(),
messageViewModel = new MessageViewModel();


// load the stored state (recent searches)

$.mobile.defaultPageTransition = ""; //"slide";




$(document).ready(function () {
                  // bind each view model to a jQueryMobile page
                  
                  
                  
                 
                  if (document.location.hash == ""){
                  document.location.hash = "#channelListView"
                  }
                  
                  
                  
                  
                  $(document).on('pagebeforecreate', '[data-role="page"]', function(e,a){
                                 
                                 
                                 
                                 var panelhtml = $("#globalpanel").html();
                                 $(this).find('#gpanel').html(panelhtml);
                                 
                                 var panel = $(this).find('#mypanel').get(0);
                                 if (panel){
                                     var myScroll = new iScroll(panel);
                                 }
                                 
                                 var panelhtmldots = $("#globalpaneldots").html();
                                 $(this).find('#gpaneldots').html(panelhtmldots);
                                 
                                 
                                 
                                 //$(this).find('#mypanel').css('background','green');
                                 
                                 
                                 
                  });
                  
                  
                  $.mobile.activeBtnClass = '';
                  
                  ko.applyBindings(loginViewModel, document.getElementById("loginView"));
                  ko.applyBindings(channelViewModel, document.getElementById("channelView"));
                  ko.applyBindings(channelBroadcastsViewModel, document.getElementById("channelBroadcastsView"));
                  ko.applyBindings(channelMenuViewModel, document.getElementById("channelMenuView"));
                  ko.applyBindings(channelSettingsViewModel, document.getElementById("channelSettingsView"));
                  ko.applyBindings(channelNewViewModel, document.getElementById("channelNewView"));
                  ko.applyBindings(signupViewModel, document.getElementById("signupView"));
                  ko.applyBindings(sendMessageViewModel, document.getElementById("sendMessageView"));
                  ko.applyBindings(followersListViewModel, document.getElementById("followersListView"));
                  ko.applyBindings(inviteFollowersViewModel, document.getElementById("inviteFollowersView"));
                  ko.applyBindings(followerViewModel, document.getElementById("followerView"));
                  ko.applyBindings(userSettingsModel, document.getElementById("userSettingsView"));
                  ko.applyBindings(devSettingsModel, document.getElementById("devSettingsView"));
                  ko.applyBindings(channelListViewModel, document.getElementById("channelListView"));
                  ko.applyBindings(channelsFollowingListViewModel, document.getElementById("channelsFollowingListView"));
                  ko.applyBindings(commethodVerificationViewModel, document.getElementById("commethodVerificationView"));
                  ko.applyBindings(notificationsViewModel, document.getElementById("notificationsView"));
                  ko.applyBindings(forgotPasswordViewModel, document.getElementById("forgotPasswordView"));
                  ko.applyBindings(resetPasswordViewModel, document.getElementById("resetPasswordView"));
                  ko.applyBindings(messageViewModel, document.getElementById("messageView"));
                  ko.applyBindings(panelHelpViewModel, document.getElementById("panelHelpView"));
                  
                  var currentUrl = $.mobile.path.parseUrl(window.location.href);
                  
                  console.log("currentUrl: " + currentUrl.hash);
                  
                  localStorage.removeItem('baseUrl');
                  
                  
                  
                  
                  
                  
                 
                                    
                                   

                  $.mobile.initializePage();
                  
                  
                   
                  
                  $(document).on('pagebeforeshow', '[data-role="page"]', function(e,a){
                                 
                                 if( panelHelpViewModel.isDirty($(this).attr('id'))){
                                     var panelhtml = $("#globalpanel").find('#mypanel').html();
                                     $(this).find('#mypanel').html(panelhtml);
                                     $(this).find('#mypanel').panel();
                                 
                                                                  
                                     $(this).find('#mypanel').trigger('create');
                                 
                                 
                                 
                                 
                                     var panelhtml = $("#globalpaneldots").find('#mypaneldots').html();
                                     $(this).find('#mypaneldots').html(panelhtml);
                                     $(this).find('#mypaneldots').panel();
                                 
                                 
                                     $(this).find('#mypaneldots').trigger('create');
                                 
                                 /*
                                 var panel = $(this).find('#mypanel').get(0);
                                 if (panel){
                                 myScroll = new iScroll(panel);
                                 }
                                  */
                                 
                                 
                                 }
                                 
                                 
                                 
                                 
                                 
                                 /*
                                 if ($(this).find('#innerpanel').iscroll){
                                 showMessage('asdf');
                                     $(this).find('#innerpanel').iscroll('refresh');
                                 
                                 }
                                  */
                                 
                                 
                                 /*
                                 $(this).find('#innerpanel #extra-broadcast-channels')
                                 
                                 $('#my-collaspible').bind('expand', function () {
                                                           alert('Expanded');
                                                           }).bind('collapse', function () {
                                                                   alert('Collapsed');
                                                                   });
                                 
                                 
                                 
                                 */
                                 
                                 
                                 
                                 
                                 /*
                                 
                                 $(window).resize();
                                 
                                 
                                 $(this).find('#mypanel').resize();
                                     panelHelpViewModel.setClean($(this).attr('id'));
                                  
                                  */
                                 
                                 
                                 
                                 
                                 
                                 });
                  
                  
                  
                  $(document).on('swiperight', '[data-role="page"]', function(e,a){
                                   if (!openPanel)
                                   $(this).find('#mypanel').panel("open");
                                   
                                   });
                  
                  
                  $(document).on('swipeleft', '[data-role="page"]', function(e,a){
                                 if (!openPanel)
                                 $(this).find('#mypaneldots').panel("open");
                                 
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
                  
                  
                  $(document).bind("pagebeforechange", function (event, data) {
                  
                  
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
                  
                  /*
                  $(document).bind('panelopen', function(e, data) {
                                   top_pos = $(document).scrollTop();
                                   
                                   var iOS = undefined;
                                   
                                   if (iOS && iOS <= 5.01) {
                                   $(".ui-panel").css("overflow", "scroll");
                                   $(".ui-panel").css("-webkit-overflow-scrolling", "auto");
                                   } else {
                                   $(".ui-panel").css("overflow", "scroll");
                                   $(".ui-panel").css("-webkit-overflow-scrolling", "touch");
                                   }
                                   $(".ui-panel").height($(window).height() - $('.ui-page-active header').height());
                                   $(".ui-panel").css("top", 0);
                                   $(".ui-panel-content-wrap-open").css("overflow", "hidden");
                                   $(".ui-panel-content-wrap-open").height($(window).height() - $('.ui-page-active header').height());
                                   $(".ui-panel-content-wrap-open").scrollTop(top_pos);
                                   $(document).scrollTop(0);
                                   });
                  
                  $(document).bind('panelclose', function(e, data) {
                                   top_pos = $(".ui-panel-content-wrap-closed").scrollTop();
                                   $(".ui-panel").height('auto');
                                   $(".ui-panel-content-wrap-closed").height("auto");
                                   $(".ui-panel-content-wrap-closed").css("overflow", "auto");
                                   $(document).scrollTop(top_pos);
                                   });
                  */
                  
                  
                  
                 
                  
                  
                  // This is the initial call to get the channels populated in the left menu.
                  //channelListViewModel.activate().then(function(){});
                  
                  
    });

















