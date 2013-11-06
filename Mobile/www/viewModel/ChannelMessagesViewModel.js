/*globals ko*/
function ChannelMessagesViewModel() {
	var that = this;
	this.template = "channelMessagesView";
	this.viewid = "V-55";
	this.viewname = "ChannelMessagesDetails";
	this.displayname = "Channel Messages";
	this.hasfooter = true;	
	
	this.accountName = ko.observable();
	this.title = ko.observable();
	this.description = ko.observable('DESCRIPTION');
	this.channelid = ko.observable();
	this.channelMessages = ko.observableArray([]);

	this.applyBindings = function() {
		$("#" + that.template).on("pagebeforeshow", null, function(e, data) {
			that.activate();
		});
	};
    
	this.activate = function () {
		that.accountName(localStorage.getItem("accountName"));
		that.channelid(localStorage.getItem("currentChannelMessages"));		
		$.mobile.showPageLoadingMsg("a", "Loading Channel Messages");
		return that.getChannelCommand(that.channelid()).then(that.gotChannel);
	};
	
	this.getChannelCommand = function(channelid) {
		//alert(channelid);
		var callbacks = {
			success: function(){
				//alert('success');	
			},
			error: function() {
				alert('error');
			}
		};
		$.mobile.showPageLoadingMsg("a", "Loading Channel");
		return ES.channelService.getChannel(channelid, callbacks);
	};
		
	this.gotChannel = function(data) {
		//alert(JSON.stringify(data));
		$.mobile.hidePageLoadingMsg();
		that.title(data.name );
		that.description(data.description);
		var callbacks = {
			success: function(data){
				//alert('success');
				that.channelMessages(data.message);
				//alert(JSON.stringify(that.channelMessages()));
			},
			error: function() {
				alert('error');	
			}
		};		
		return ES.messageService.getChannelMessages(that.channelid(), undefined, callbacks);
	}
}
