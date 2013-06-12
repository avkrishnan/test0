/*globals $, ko, document */

ko.virtualElements.allowedBindings.updateListviewOnChange = true;
ko.bindingHandlers.updateListviewOnChange = {
update: function (element, valueAccessor) {
    
    
    console.log('dood');
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



var messages = 0;

function showMessage(message){
    
    
    
     $("<div class='xui-loader ui-overlay-shadow ui-body-e ui-corner-all'>" + message + "</div>").css({ "display": "block", "opacity": 0.96, "top": 50, "padding":"10px", "font-size":"14pt", "position":"relative", "z-index":100 })
     .appendTo( $.mobile.pageContainer )
     .delay( 2500 )
     .fadeOut( 400, function(){
     $(this).remove();
     messages --;
     });
    
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
channelNewViewModel = new ChannelNewViewModel(),
signupViewModel = new SignupViewModel(),
sendMessageViewModel = new SendMessageViewModel(),
followersListViewModel = new FollowersListViewModel(),
inviteFollowersViewModel = new InviteFollowersViewModel(),
followerViewModel = new FollowerViewModel(),
commethodVerificationViewModel = new CommethodVerificationViewModel(),
userSettingsModel = new UserSettingsViewModel(),
notificationsViewModel = new NotificationsViewModel()

;

// load the stored state (recent searches)

$.mobile.defaultPageTransition = ""; //"slide";

$(document).ready(function () {
                  // bind each view model to a jQueryMobile page
                  
                  $.mobile.activeBtnClass = '';
                  
                  
                  ko.applyBindings(loginViewModel, document.getElementById("loginView"));
                  
                  
                  ko.applyBindings(channelViewModel, document.getElementById("channelView"));
                  ko.applyBindings(channelNewViewModel, document.getElementById("channelNewView"));
                  ko.applyBindings(signupViewModel, document.getElementById("signupView"));
                  ko.applyBindings(sendMessageViewModel, document.getElementById("sendMessageView"));
                  ko.applyBindings(followersListViewModel, document.getElementById("followersListView"));
                  ko.applyBindings(inviteFollowersViewModel, document.getElementById("inviteFollowersView"));
                  ko.applyBindings(followerViewModel, document.getElementById("followerView"));
                  ko.applyBindings(userSettingsModel, document.getElementById("userSettingsView"));
                  ko.applyBindings(channelListViewModel, document.getElementById("channelListView"));
                  ko.applyBindings(channelsFollowingListViewModel, document.getElementById("channelsFollowingListView"));
                  ko.applyBindings(commethodVerificationViewModel, document.getElementById("commethodVerificationView"));
                  
                  ko.applyBindings(notificationsViewModel, document.getElementById("notificationsView"));
                   
                  
                  var currentUrl = $.mobile.path.parseUrl(window.location.href);
                  
                  console.log("currentUrl: " + currentUrl.hash);
                  
                  
                  $(document).bind("pagebeforechange", function (event, data) {
                      
                                   $.mobile.pageData = (data && data.options && data.options.pageData)
                                   ? data.options.pageData
                                   : null;
                                   });
                  
              
                  $(document).on('pagebeforeshow', '#channelListView', function(){
                                 //console.log('activating channel list view');
                                 //alert('activating something');
                                 //channelListViewModel.activate();
                                 });
                   
                  
                  
    });

















