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
            // if the listview is not initialised, the above call with throw an exception
            // there doe snot appear to be any way to easily test for this state, so
            // we just swallow the exception here.
        }
    }
}
};

// create the various view models
var 
loginViewModel = new LoginViewModel(),
channelListViewModel = new ChannelListViewModel(),
channelViewModel = new ChannelViewModel(),
channelNewViewModel = new ChannelNewViewModel(),
signupViewModel = new SignupViewModel()
;

// load the stored state (recent searches)

$.mobile.defaultPageTransition = ""; //"slide";

$(document).ready(function () {
                  // bind each view model to a jQueryMobile page
                  
                  ko.applyBindings(loginViewModel, document.getElementById("loginView"));
                  ko.applyBindings(channelListViewModel, document.getElementById("channelListView"));
                  ko.applyBindings(channelViewModel, document.getElementById("channelView"));
                  ko.applyBindings(channelNewViewModel, document.getElementById("channelNewView"));
                  ko.applyBindings(signupViewModel, document.getElementById("signupView"));
                  
                  
                  var currentUrl = $.mobile.path.parseUrl(window.location.href);
                  
                  console.log("currentUrl: " + currentUrl.hash);
                  
                  $(document).on('pagebeforeshow', '#channelListView', function(){
                                 console.log('activating channel list view');
                                 channelListViewModel.activate();
                                 });
                  
                  
                  if (currentUrl.hash  == '#channelListView' || currentUrl.hash  == ''){
                      channelListViewModel.activate();
                  }
                  else if (currentUrl.hash  == '#channelView'){
                      var currentChannel = localStorage.getItem("currentChannel");
                      var channel = JSON.parse(currentChannel);
                      channelViewModel.activate(channel);
                  }
                  else if (currentUrl.hash  == '#loginView'){
                      
                      loginViewModel.activate();
                  }
                  
    });

















