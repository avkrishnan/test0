/*globals ko*/

function FollowerViewModel() {

    // --- properties

    var that = this;

    this.template = "followerView";
    this.viewid = "V-??";
    this.viewname = "FOLLOWER";
    this.displayname = "Follower";
    
    this.hasfooter = true;
    this.isChannelView = true;
    this.title = ko.observable();
    this.followerid = ko.observable();
    this.followerName = ko.observable();
    this.follower = ko.observable();

    this.channelid = ko.observable();
    this.channelname = ko.observable();
    this.navText = ko.observable('Followers');
    
    
    this.applyBindings = function(){
        $("#" + that.template).on("pagebeforeshow", null, function (e, data) {
                                    
                                    if ($.mobile.pageData && $.mobile.pageData.id) {
                                    
                                    that.activate({ id: $.mobile.pageData.id });
                                    }
                                    
                                    
                                    });
    };
    

    this.activate = function (lfollower) {

        var currentChannel = localStorage.getItem("currentChannel");
        var channel = JSON.parse(currentChannel);
        
        that.follower(lfollower);
        that.followerid(lfollower.id);
        that.channelid(channel.id);
        that.channelname(channel.name);
        that.followerName(lfollower.firstname + ' ' + lfollower.lastname);
        $.mobile.showPageLoadingMsg("a", "Loading Follower");
       
        return true;

    };

    this.logoutCommand = function () {
        
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)

    };
    
    this.backNav = function(){
        $.mobile.changePage("#" + followersListViewModel.template);
    };
        
    this.getFollowerCommand = function () {

        return ES.channelService.getFollower(that.channelid(), { success: gotFollower, error: errorAPI });

    };

    function gotFollower(data){
        if(data.follower){
            that.follower(data.follower);
            that.followerName(data.follower.name);
        }
    }

    this.removeFollowerCommand = function () {
        
        
        return ES.channelService.removeFollower(that.channelid(), that.followerid(), { success: function(){;}, error: errorAPI }).then(successfulRemove);
    };

    function successfulRemove(data) {
        showMessage('Removed Follower ' + that.followerName());
        $.mobile.changePage("#" + followersListViewModel.template);
    }

    function errorAPI(data, status, details) {
        
        $.mobile.hidePageLoadingMsg();
        if (data == "Unauthorized") {
            $.mobile.changePage("#" + loginViewModel.template)
        }
        console.log("Error:  " + data);
        showError("Error Getting Messages: " + ((status == 500) ? "Internal Server Error" : details.message));
    };



}
