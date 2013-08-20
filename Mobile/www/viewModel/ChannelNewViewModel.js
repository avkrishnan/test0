/*globals ko*/

function ChannelNewViewModel() {
    
    
    this.template = "channelNewView";
    this.viewid = "V-15";
    this.viewname = "CreateAnotherChannel";
    
    this.name = ko.observable();
    this.description = ko.observable();
    this.notifications = ko.observable();
    
    var that = this;
    var  dataService = new EvernymChannelService();
    
    /*
    $("#" + that.template).live("pagebeforecreate", function (e, data) {
                                var panelhtml = $("#globalpanel").html();
                                $(this).find("#gpanel").html(panelhtml);
                                });
    */
    
    
    $("#" + this.template).live("pagebeforeshow", function (e, data) {
                                that.clearForm();
                                that.activate();
    });
    
    // Methods
    this.activate = function () {
        
        return true;
    };
    
    this.clearForm = function(){
        that.name('');
    };
    
    this.routeToLogin = function () {
        //router.navigateTo('#/login');
    };
    
    function successfulCreate(data){
        $.mobile.hidePageLoadingMsg();
        //logger.log('success creating channel', null, 'dataservice', true);
        //router.navigateTo('#/channellist');
        
        $.mobile.changePage("#" + channelListViewModel.template);
        channelListViewModel.clearForm();
        channelListViewModel.activate();
        
        panelHelpViewModel.setAllDirty();
        
    };
    
    function errorCreate(data, status, response){
        $.mobile.hidePageLoadingMsg();
        //that.notifications("error creating channel " + JSON.stringify(data));
        console.log("error creating channel: " + response.message);
        showError("Error creating channel: " + response.message);
        loginPageIfBadLogin(details.code);
        //logger.log('error creating channel', null, 'dataservice', true);
    };
    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
    }
    
    this.createChannelCommand = function () {
        //inputChannelName
        //logger.log('start creating channel ' + this.name() , null, 'dataservice', true);
        $.mobile.showPageLoadingMsg("a", "Creating Channel " + that.name());
        alert(that.description());
        dataService.createChannel({name: that.name(), description: that.description()}, {success: successfulCreate, error: errorCreate});
    };
     

    
    
}
