/*globals ko*/

function FollowerViewModel() {

    // --- properties

    var that = this;
    var dataService = new EvernymChannelService();

    this.template = "followerView";
    this.title = ko.observable();
    this.followerid = ko.observable();
    this.followerName = ko.observable();
    this.follower = ko.observable();

    this.channelid = ko.observable();
    this.channelname = ko.observable();

    
    
 

    $("#" + this.template).live("pagebeforeshow", function (e, data) {

        if ($.mobile.pageData && $.mobile.pageData.id) {
            
            that.activate({ id: $.mobile.pageData.id });
        }


    });


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

    }
        
    this.getFollowerCommand = function () {

        return dataService.getFollower(that.channelid(), { success: gotFollower, error: errorAPI });

    };

    function gotFollower(data){
        if(data.follower){
            that.follower(data.follower);
            that.followerName(data.follower.name);
        }
    }

    this.removeFollowerCommand = function () {
        
        
        return dataService.removeFollower(that.channelid(), that.followerid(), { success: function(){;}, error: errorAPI }).then(successfulRemove);
    }

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
        showMessage("Error Getting Messages: " + ((status == 500) ? "Internal Server Error" : details.message));
    };



}
