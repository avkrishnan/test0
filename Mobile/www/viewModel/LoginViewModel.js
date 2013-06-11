/*globals ko*/

function LoginViewModel() {
    /// <summary>
    /// A view model that represents a single tweet
    /// </summary>
    
    // --- properties
    
    var that = this;
    this.template = "loginView";
    
    this.accountName = ko.observable();
    
    this.password = ko.observable();
    
    var  dataService = new EvernymLoginService();
    
    $("#" + this.template).live("pagebeforeshow", function(e, data){ that.activate(); });
    
    this.activate = function(){
        that.password('');
        that.accountName('');
    }
    
    this.loginCommand = function () {
        
        var callbacks = {
        success: loginSuccess2,
        error: loginError
        };
        
        channelListViewModel.shown = false;
        var loginModel = {};
        $.mobile.showPageLoadingMsg("a", "Logging In");
        loginModel.accountName = this.accountName();
        loginModel.password = this.password();
        loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
        
        return dataService.accountLogin(loginModel, callbacks).then(loginSuccess);
    }
    
    this.showRegistration = function(){
        
        $.mobile.changePage("#" + signupViewModel.template);
        
    }
    
    this.logoutCommand = function() {
        that.password('');
        that.accountName('');
        var cookie = localStorage.getItem("accessToken");
        if (cookie) {
            var callbacks = {
            success: logoutSuccess,
            error: logoutError
            };
            dataService.accountLogout(cookie, callbacks);
            //logger.log('You successfully logged out!', null, 'login', true);
        }
    }
    
    function loginSuccess2(data){};
    
    function loginSuccess(args) {
                
        $.mobile.hidePageLoadingMsg();
        localStorage.removeItem('accessToken');
        if (args.accessToken) {
            
            localStorage.setItem("accessToken", args.accessToken);
            var notifications = args.notifications;
            
            
            var login_nav = JSON.parse(localStorage.getItem("login_nav"));
            localStorage.removeItem("login_nav");
            
            
            
            if (login_nav){
                var hash = login_nav.hash;
                
                if (hash.indexOf("index.html") !== -1){
                    hash = 'index.html';
                }
                
                $.mobile.changePage(hash);
            }
            else if (notifications.length){
                for (var n in notifications){
                    var code = notifications[n].code;
                    notificationsViewModel.addNotification(getAPICode(code));
                }
                
                $.mobile.changePage("#" + notificationsViewModel.template);
            }
            else {
                
                $.mobile.changePage("#" + channelListViewModel.template);
            }
            
            
            
            
        } else {
            loginError();
            return;
        }
        
        //logger.log('You successfully logged in!', null, 'login', true);
    }
    
    function loginError(data, status, details) {
        $.mobile.hidePageLoadingMsg();
        showMessage("LOGIN FAILED: " + details.message);
        localStorage.removeItem('accessToken');
        //logger.logError('Your login failed, please try again!', null, 'login', true);
    }
    
    function logoutSuccess() {
        
        localStorage.removeItem('accessToken');
        //logger.logError('You successfully logged out!', null, 'login', true);
    }
    
    function logoutError() {
        
        //logger.logError('Your log out failed, please try again!', null, 'login', true);
    }
    
    
    // --- private functions
    function parseDate(date) {
        /// <summary>
        /// Parses the tweet date to give a more readable format.
        /// </summary>
        var diff = (new Date() - new Date(date)) / 1000;
        
        if (diff < 60) {
            return diff.toFixed(0) + " seconds ago";
        }
        
        diff = diff / 60;
        if (diff < 60) {
            return diff.toFixed(0) + " minutes ago";
        }
        
        diff = diff / 60;
        if (diff < 10) {
            return diff.toFixed(0) + " hours ago";
        }
        
        diff = diff / 24;
        
        if (diff.toFixed(0) === 1) {
            return diff.toFixed(0) + " day ago";
        }
        
        return diff.toFixed(0) + " days ago";
    }
    

    
    
}
