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
        var callbacks = {
        success: signUpSuccess,
        error: signUpError
        };
        
        
        var account = generateAccount();
        dataService.accountEnroll(account, callbacks);
    };
    
    this.loginCommand = function() {
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
        
        
        localStorage.removeItem('accessToken');
        if (args.accessToken) {
            
            localStorage.setItem("accessToken", args.accessToken);
            $.mobile.changePage("#" + channelListViewModel.template);
            channelListViewModel.activate();
        } else {
            loginError();
            return;
        }
        
        //logger.log('You successfully logged in!', null, 'login', true);
    }
    
    function loginError(data, status, response) {
        alert("LOGIN FAILED");
        localStorage.removeItem('accessToken');
        alert("Error creating channel: " + response.message);
        //logger.logError('Your login failed, please try again!', null, 'login', true);
    }
    
    function signUpSuccess(args) {
        that.loginCommand();
        //logger.log('You successfully signed up!', null, 'signup', true);
    };
    
    function signUpError(data, status, response) {
        //logger.logError('signup failed!', null, 'signup', true);
        alert("Error Registering: " + response.message);
    };
    
}
