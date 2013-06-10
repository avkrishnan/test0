/*globals ko*/

function SignupViewModel() {
    
    
    var that = this;
    
    var  dataService = new EvernymLoginService();
    
    this.template = "signupView";
    

    this.accountName = ko.observable();
    this.password = ko.observable();
    this.emailaddress = ko.observable();
    this.firstname = ko.observable();
    this.lastname = ko.observable();
    
    // Methods
    this.activate = function () {
        return true;
    };
    
    function generateAccount() {
        return {
        accountName: that.accountName(), // Create Random AccountName Generator
        emailaddress: that.emailaddress(),
        password: that.password(),
        firstname: that.firstname(),
        lastname: that.lastname()
        };
    };
    
    this.signUpCommand = function () {
        
        $.mobile.showPageLoadingMsg("a", "Enrolling");
        var callbacks = {
        success: signUpSuccess,
        error: signUpError
        };
        
        
        var account = generateAccount();
        dataService.accountEnroll(account, callbacks);
    };
    
    this.loginCommand = function () {
        debugger;
        $.mobile.showPageLoadingMsg("a", "Logging In With New Credentials");
        var callbacks = {
        success: loginSuccess,
        error: loginError
        };
        
        var loginModel = {};
        
        loginModel.accountName = that.accountName();
        loginModel.password = that.password();
        loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
        
        dataService.accountLogin(loginModel, callbacks);
    }
    
    function loginSuccess(args) {
        debugger;
        $.mobile.hidePageLoadingMsg();
        localStorage.removeItem('accessToken');
        if (args.accessToken) {
            
            localStorage.setItem("accessToken", args.accessToken);
            
            var login_nav = JSON.parse(localStorage.getItem("login_nav"));
            localStorage.removeItem("login_nav");
            
            if (login_nav){
                var hash = login_nav.hash;
                $.mobile.changePage(hash);
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
    
    function loginError(data, status, response) {
        $.mobile.hidePageLoadingMsg();
        showMessage("LOGIN FAILED");
        localStorage.removeItem('accessToken');
        
        //logger.logError('Your login failed, please try again!', null, 'login', true);
    }
    
    function signUpSuccess(args) {
        $.mobile.hidePageLoadingMsg();
        that.loginCommand();
        localStorage.setItem('flags.signup_complete', 1);
        
        showMessage("You will now receive an email with information to verify your email.");
        //logger.log('You successfully signed up!', null, 'signup', true);
    };
    
    function signUpError(data, status, response) {
        $.mobile.hidePageLoadingMsg();
        //logger.logError('signup failed!', null, 'signup', true);
        showMessage("Error Registering: " + response.message);
    };
    
}
