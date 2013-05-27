/*globals ko*/

function InviteFollowersViewModel() {
    
    // --- properties
    
    var that = this;
    var  dataService = new EvernymChannelService();
	
    this.template = "inviteFollowersView";
    
    
	this.channelid = ko.observable();
    this.channelname = ko.observable();
    
    
    
    $("#" + this.template).live("pagebeforeshow", function (e, data) {

        if ($.mobile.pageData && $.mobile.pageData.id) {
            that.activate({ id: $.mobile.pageData.id });
        }

        else {

            var currentChannel = localStorage.getItem("currentChannel");
            var lchannel = JSON.parse(currentChannel);
            that.activate(lchannel);

        }


    });
    
    
    // Methods
    
    function getChannelFromPageData(){
        that.activate({id:$.mobile.pageData.id});
    }
    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
        
    }
	
    this.activate = function (channel) {
        
        that.channelid(channel.id);
        that.channelname(channel.name);
        
        
        return true;
	    
    };

	



   

    
    
}
