/*globals ko*/

function ChannelNewViewModel() {
    
    
    this.template = "channelNewView";
    this.name = ko.observable();
    this.notifications = ko.observable();
    
    var that = this;
    var  dataService = new EvernymChannelService();
    
     
    
    
    // Methods
    this.activate = function () {
        that.name("");
        //var result = authentication.validateCookie();
        
        return true;
    };
    
    this.routeToLogin = function () {
        //router.navigateTo('#/login');
    };
    
    function successfulCreate(data){
        //logger.log('success creating channel', null, 'dataservice', true);
        //router.navigateTo('#/channellist');
        
        $.mobile.changePage("#" + channelListViewModel.template);
        channelListViewModel.activate();
    };
    
    function errorCreate(data, status, response){
        //that.notifications("error creating channel " + JSON.stringify(data));
        console.log("error creating channel: " + response.message);
        showMessage("Error creating channel: " + response.message);
        if (data == "Unauthorized"){
            $.mobile.changePage("#" + loginViewModel.template)
        }
        //logger.log('error creating channel', null, 'dataservice', true);
    };
    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
    }
    
    this.createChannelCommand = function () {
        //inputChannelName
        //logger.log('start creating channel ' + this.name() , null, 'dataservice', true);
        dataService.createChannel({name: that.name()}, {success: successfulCreate, error: errorCreate});
    };
     

    
    
}
