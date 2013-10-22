function FollowChannelViewModel() {

	
	var that = this;
	
	
	this.template = "followChannelView";
    this.viewid = "V-??";
    this.viewname = "FollowChannel";
    this.displayname = "Follow Channel";
    
    this.hasfooter = true;
    this.isChannelView = true;
	
	
    this.channel = ko.observableArray([]);
	this.channelid = ko.observable();
    
    this.navText = ko.observable();
    this.pView = '';
    
    this.clean = function(){
    
        
        that.channelid('');
    };
    
    
    this.applyBindings = function(){
    
    
        $("#" + that.template).on("pagebeforeshow", null, function(e, data){
            that.clean();
            
            
            var previousView = localStorage.getItem('previousView');
			console.log("previousView: " + previousView);
			var vm = ko.dataFor($("#" + previousView).get(0));
			console.log("previousView Model viewid: " + vm.displayname);
			that.navText(vm.displayname);
			that.pView = previousView;
								
		});
	
	
    
    };
    
    this.backNav = function(){
        $.mobile.changePage("#" + that.pView);
    };
   
	
	this.activate = function (channel) {
		
	};
	
	function gotChannel(data){
		
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem("currentChannel", JSON.stringify(data));
		that.channel([data]);
		//alert(JSON.stringify(data));
		$.mobile.changePage("#" + channelViewModel.template);
	}
    
    
    
    
	function successfulGetChannel(data){

		$.mobile.hidePageLoadingMsg();
		
	}
	
	
	function errorAPIChannel(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (loginPageIfBadLogin(details.code)){
			
            showError("Please log in or register to view this channel.");
		}
        else {
		    showError("Error Getting Channel: " + ((status==500)?"Internal Server Error":details.message));
		}

	}
    
    function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error: " + ((status==500)?"Internal Server Error":details.message));
		

	}
    
	
	this.getChannelCommand = function () {
		
		$.mobile.showPageLoadingMsg("a", "Loading Channel");
        var lchannelid = that.channelid();
		return ES.channelService.getChannel(lchannelid, {success: gotChannel, error: errorAPIChannel});
		
	};
    
   
	
	
  
	
	
	
	
	
   

	
	
}
