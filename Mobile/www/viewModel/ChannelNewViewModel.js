/*globals ko*/

function ChannelNewViewModel() {
    
    
    this.template = "channelNewView";
    this.viewid = "V-15";
    this.viewname = "CreateAnotherChannel";
    this.displayname = "Create Channel";
    
    this.hasfooter = true;
    this.name = ko.observable();
    this.description = ko.observable();
    this.longdescription = ko.observable();
    this.notifications = ko.observable();
    
    this.navText = ko.observable();
    this.pView = '';
    
    var that = this;
    
    /*
    $("#" + that.template).live("pagebeforecreate", function (e, data) {
                                var panelhtml = $("#globalpanel").html();
                                $(this).find("#gpanel").html(panelhtml);
                                });
    */
    
    
    this.applyBindings = function(){
        $("#" + that.template).on("pagebeforeshow", null, function (e, data) {
                                    that.clearForm();
                                    
                                    var previousView = localStorage.getItem('previousView');
                                    console.log("previousView: " + previousView);
                                    var vm = ko.dataFor($("#" + previousView).get(0));
                                    console.log("previousView Model viewid: " + vm.displayname);
                                    that.navText(vm.displayname);
                                    that.pView = previousView;
                                    
                                    
                                    that.activate();
                                    });
    };
    
    

    
    // Methods
    this.activate = function () {
        
        return true;
    };
    
    this.backNav = function(){
        $.mobile.changePage("#" + that.pView);
    };
    
    this.clearForm = function(){
        that.name('');
        that.description('');
        that.longdescription('');
    };
    
    this.routeToLogin = function () {
        //router.navigateTo('#/login');
    };
    
    function successfulCreate(data){
        $.mobile.hidePageLoadingMsg();
        //logger.log('success creating channel', null, 'channelService', true);
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
        //logger.log('error creating channel', null, 'channelService', true);
    };
    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
    }
    
    this.createChannelCommand = function () {
        //inputChannelName
        //logger.log('start creating channel ' + this.name() , null, 'channelService', true);
        $.mobile.showPageLoadingMsg("a", "Creating Channel " + that.name());
        
        ES.channelService.createChannel({name: that.name(), description: that.description(), longDescription:that.longdescription()}, {success: successfulCreate, error: errorCreate});
    };
     

    
    
}
