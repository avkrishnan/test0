/*globals ko*/

function FollowerViewModel() {

    // --- properties

    var that = this;
    var dataService = new EvernymChannelService();

    this.template = "followerView";
    this.title = ko.observable();
    this.follower = ko.observable();

    this.channelid = ko.observable();
    this.channelname = ko.observable();


    $("#" + this.template).live("pagebeforeshow", function (e, data) {

        debugger;

        if ($.mobile.pageData && $.mobile.pageData.id) {
            that.activate({ id: $.mobile.pageData.id });
        }

        else {
            debugger;
            var currentChannel = localStorage.getItem("currentChannel");
            var lchannel = JSON.parse(currentChannel);
            that.activate(lchannel);

        }


    });


    // Methods

    function getChannelFromPageData() {
        that.activate({ id: $.mobile.pageData.id });
    }

    this.activate = function (channel) {
        debugger;

        that.follower();
        that.channelid(channel.id);
        that.channelname(channel.name);
        $.mobile.showPageLoadingMsg("a", "Loading Follower");
       
        return true;

    };

    this.logoutCommand = function () {
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)

    }

    //function errorAPI(data, status, details) {
    //    $.mobile.hidePageLoadingMsg();
    //    if (data == "Unauthorized") {
    //        $.mobile.changePage("#" + loginViewModel.template)
    //    }
    //    console.log("error something " + data);
    //    showMessage("Error Getting Messages: " + ((status == 500) ? "Internal Server Error" : details.message));

    //    //logger.logError('error listing channels', null, 'channel', true);
    //};



    this.getFollowerCommand = function () {

        //logger.log("starting getChannel", undefined, "channels", true);
        return dataService.getFollower(that.channelid(), { success: function () { }, error: errorAPI });

    };






}
