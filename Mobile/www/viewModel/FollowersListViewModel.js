/*globals ko*/

function FollowersListViewModel() {
    
    // --- properties
    
    var that = this;
    var  dataService = new EvernymChannelService();
	
    this.template = "followersListView";
    this.title = ko.observable();
    this.followers = ko.observableArray([]);
    
	this.channelid = ko.observable();
    this.channelname = ko.observable();
    
    $("#" + this.template).live("pagebeforeshow", function(e, data){
                                
                                
                                if ($.mobile.pageData && $.mobile.pageData.id){
                                    that.activate({id:$.mobile.pageData.id});
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
	
    this.activate = function (channel) {
        
        that.followers([]);
        that.channelid(channel.id);
        that.channelname(channel.name);
        $.mobile.showPageLoadingMsg("a", "Loading Followers");
        that.getFollowersCommand().then(gotFollowers);
	    
        return true;
	    
    };

	
    function gotFollowers(data){
	    $.mobile.hidePageLoadingMsg();
        
        if (data.followers && data.followers.constructor == Object){
            
            data.followers = [data.followers];
        }

        
        that.followers(data.followers);
	    
	};

    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
        
    }
    
	function errorAPI(data, status, details){
        $.mobile.hidePageLoadingMsg();
        if (data == "Unauthorized"){
            $.mobile.changePage("#" + loginViewModel.template)
        }
        console.log("error something " + data);
        showMessage("Error Getting Messages: " + ((status==500)?"Internal Server Error":details.message));
        
	    //logger.logError('error listing channels', null, 'channel', true);
	};
    

	
	this.getFollowersCommand = function () {
	    
        //logger.log("starting getChannel", undefined, "channels", true);
	    return dataService.getFollowers(that.channelid(), {success: function(){}, error: errorAPI});
        
	};


   

    
    
}
