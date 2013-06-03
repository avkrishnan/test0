/*globals ko*/

function InviteFollowersViewModel() {
	
	// --- properties
	
	var that = this;
	var  dataService = new EvernymChannelService();
	
	this.template = "inviteFollowersView";
	
	this.channelid = ko.observable();
	this.channelname = ko.observable();
	this.normName = ko.observable();
	this.emailaddress = ko.observable();
	this.firstname = ko.observable();
	this.lastname = ko.observable();
	this.smsPhone = ko.observable();
   
	
	$("#" + this.template).live("pagebeforeshow", function (e, data) {

		if ($.mobile.pageData && $.mobile.pageData.id) {
			that.activate({ id: $.mobile.pageData.id });
		} else {
			var currentChannel = localStorage.getItem("currentChannel");
			var lchannel = JSON.parse(currentChannel);
			that.activate(lchannel);
		}


	});
	
	
	// Methods

	function generateProvisionalAccount() {
		return {
			emailaddress: that.emailaddress,
			smsPhone: that.smsPhone,
			firstname: that.firstname,
			lastname: that.lastname,
			channelid: that.channelid
		};
	}
	
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
		that.normName(channel.normName);
		
		return true;
		
	};

	this.addFollowerCommand(provisionalAccount){
		$.mobile.showPageLoadingMsg("a", "Adding Follower");
		var callbacks = {
			success: addFollowerSuccess,
			error: addFollowerError
		};
		
		var provisional = generateProvisionalAccount();
		dataService.provisionalEnroll(provisional, callbacks);
	}


	function addFollowerSuccess(args) {
		$.mobile.hidePageLoadingMsg();
	};
	
	function addFollowerError(data, status, response) {
		$.mobile.hidePageLoadingMsg();
		showMessage("Error Creating Follower Account: " + response.message);
	};
   

	
	
}
