/*globals ko*/

function FollowerViewModel() {

    // --- properties

    var that = this;
    var dataService = new EvernymChannelService();

    this.template = "followerView";
    this.title = ko.observable();
    this.followerid = ko.observable();
    this.followerName = ko.observable();

    this.channelid = ko.observable();
    this.channelname = ko.observable();


    $("#" + this.template).live("pagebeforeshow", function (e, data) {

        debugger;

        if ($.mobile.pageData && $.mobile.pageData.id) {
            var currentChannel = localStorage.getItem("currentChannel");
            var lchannel = JSON.parse(currentChannel);
            that.activate({ id: $.mobile.pageData.id }, lchannel);
        }

        // else { alert("error: page requires both a followerId and a channelId"); }

    });


    // Methods


    this.activate = function (follower, channel) {
        debugger;

        that.followerid(follower.id);
        that.channelid(channel.id);
        that.channelname(channel.name);
        $.mobile.showPageLoadingMsg("a", "Loading Follower");
       
        return true;

    };

    this.logoutCommand = function () {
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)

    }
        
    this.getFollowerCommand = function () {
        debugger;
        //logger.log("starting getChannel", undefined, "channels", true);
        return dataService.getFollower(that.channelid(), { gotFollower, error: errorAPI });

    };

    function gotFollower(data){
        if(data.follower){
            that.follower = data.follower;
            that.followerName = data.follower.name;
        }
    }

    this.removeFollowerCommand = function () {
        debugger;
        return dataService.unFollowChannel(that.channelid(), that.followerid(), { success: successfulRemove, error: errorAPI });
    }

    function successfulRemove(data) {
        $.mobile.changePage("#" + FollowersListViewModel.template);
    }

    function errorAPI(data, status, details) {
        debugger;
        $.mobile.hidePageLoadingMsg();
        if (data == "Unauthorized") {
            $.mobile.changePage("#" + loginViewModel.template)
        }
        console.log("Error:  " + data);
        showMessage("Error Getting Messages: " + ((status == 500) ? "Internal Server Error" : details.message));
    };



}
