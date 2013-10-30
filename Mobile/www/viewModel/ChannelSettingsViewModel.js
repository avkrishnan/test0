/*globals ko*/

function ChannelSettingsViewModel() {	
  var that = this;
	this.template = 'channelSettingsView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelSettings';
	this.displayname = 'Channel Settings';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();

  /* Channel Settings observable */
	this.channelName = ko.observable();
	this.channelDisplayName = ko.observable();
		
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.a) {
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }
      that.activate();
    });	
	};  
	this.activate = function() {
		var _accountName = localStorage.getItem('accountName');
		that.accountName(_accountName);
		return this.getChannelCommand();
		goToView('channelSettingsView');
	}
	this.editChannelName = function () {
		goToView('channelChangeNameStepFirstView');
  };
	this.editChannelDisplayName = function () {
		goToView('channelEditDisplayNameView');
  };
	this.deleteChannel = function () {
		goToView('channelDeleteView');
  };
	this.changeChannelIcon = function () {
		goToView('channelChangeIconView');
  };
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem('currentChannelName', data.name);
		localStorage.setItem('currentChannelDescription', data.description);
		that.channelName(localStorage.getItem('currentChannelName'));
		that.channelDisplayName(localStorage.getItem('currentChannelDescription'));
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    $.mobile.changePage('#channelSettingsView', {
      transition: 'none'
    });
  };
	
  this.getChannelCommand = function () {
		var channelId = localStorage.getItem('currentChannelId');
		$.mobile.showPageLoadingMsg('a', 'Loading Channel');
		return ES.channelService.getChannel(channelId, {success: successfulGetChannel, error: errorAPI});
  };
}

/*function ChannelSettingsViewModel() {

	
	// --- properties
	
	var that = this;

	
	
	this.template = 'channelSettingsView';
    this.viewid = 'V-16';
    this.viewname = 'ChannelSettings';
    this.displayname = 'Channel Settings';
    
    this.hasfooter = true;
    this.isChannelView = true;
	this.title = ko.observable();
    this.relationship = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
	
	
	this.editChannelName = ko.observable();
	this.editChannelDescription = ko.observable();
    this.editLongDescription = ko.observable();
    this.editIconId = ko.observable();
    this.selectIconObj = ko.observable();
    that.channelIconObj = ko.observable();
    
    this.url = ko.observable();
    this.description = ko.observable();
    this.longdescription = ko.observable();
    this.email = ko.observable('');
    
	this.navText = ko.observable('Channel');
	*/
	
    /*
    $('#' + that.template).live('pagebeforecreate', function (e, data) {
                                var panelhtml = $('#globalpanel').html();
                                $(this).find('#gpanel').html(panelhtml);
                                });
    */
    
    
    
    /*this.applyBindings = function(){
    
        
        $('#' + that.template).on('pagebeforeshow', null, function(e, data){
                                    
                                    that.clearForm();
                                    
                                    $('.more_messages_button').hide();
                                    
                                    if ($.mobile.pageData && $.mobile.pageData.id){
                                    
									that.activate({id:$.mobile.pageData.id});
                                    }
                                    
                                    else {
									var currentChannel = localStorage.getItem('currentChannel');
									var lchannel = JSON.parse(currentChannel);
                                    
                                    
                                    
                                    if (!(that.channel()[0] && lchannel.id == that.channel()[0].id)){
                                    
                                    that.messages([]);
                                    }
                                    
                                    if (lchannel){
                                    that.channel([lchannel]);
                                    that.title(lchannel.name );
                                    
                                    that.editChannelName(lchannel.name);
                                    that.editChannelDescription(lchannel.description);
                                    
                                  
                                    
                                    that.description(lchannel.description);
                                    that.longdescription(lchannel.longDescription);
                                    that.url(lchannel.normName + '.evernym.com');
                                    that.email(lchannel.normName + '@evernym.com');
                                    
                                    that.editLongDescription(lchannel.longDescription);
                                    
                                    if (lchannel.picId ){
                                     	that.editIconId(lchannel.picId);
										var iconJSON = JSON.parse(lchannel.picId);
										if (iconJSON && iconJSON.id){
											var set = iconJSON.set;
											var id = iconJSON.id;
											var mappedIcon = selectIconViewModel.mapImage(set, id, 68);
											that.selectIconObj(mappedIcon);
											var mappedIcon2 = selectIconViewModel.mapImage(set, id, 63);
											that.channelIconObj(mappedIcon2);
										}
                                    }
                                    
                                    
                                    
                                    
                                    
                                    that.relationship(lchannel.relationship);
                                    that.channelid(lchannel.id);
                                    $.mobile.showPageLoadingMsg('a', 'Loading Messages');
                                    
                                    }
                                    else {
                                    $.mobile.changePage('#' + loginViewModel.template);
                                    }
                                    
                                    }
                                    
                                    });
    
    
    
    };
    
	
	this.activate = function (channel) {
		
		that.channelid(channel.id);

		
		that.messages([]);
		$.mobile.showPageLoadingMsg('a', 'Loading The Channel');
		that.getChannelCommand(that.channelid()).then(gotChannel);
		
		return true;
		
	};
	
	this.clearForm = function(){
	
	
	
	    
		that.editIconId('');
		that.selectIconObj(undefined);
		that.channelIconObj(undefined);

        that.editChannelName('');
        that.editChannelDescription('');
        that.editLongDescription('');
	
	
	};
	
	
	//TODO make one function for getting the data onto the page.
	function gotChannel(data){
	
	    var lchannel = data;
	
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem('currentChannel', JSON.stringify(data));
		that.channel([data]);
		that.title(data.name );
        that.relationship(data.relationship);
        that.channelid(data.id);
        
        that.description(data.description);
        that.longdescription(data.longDescription);
        that.url(data.normName + '.evernym.com');
        that.email(data.normName + '@evernym.com');
        
        
        if (lchannel.picId){
			that.editIconId(lchannel.picId);
			var iconJSON = JSON.parse(lchannel.picId);
			if (iconJSON && iconJSON.id){
				var set = iconJSON.set;
				var id = iconJSON.id;
			
				var mappedIcon = selectIconViewModel.mapImage(set, id, 68);
				that.selectIconObj(mappedIcon);
			
				var mappedIcon2 = selectIconViewModel.mapImage(set, id, 63);
				that.channelIconObj(mappedIcon2);
			
			}
		}
        
        that.editChannelName(data.name);
        that.editChannelDescription(data.description);
        that.editLongDescription(data.longDescription);
		
	}
    
    function postFollow(data){
        
        
        
    }
	
    
	
    
    
	function successfulGetChannel(data){

		$.mobile.hidePageLoadingMsg();
		
	}
	
	function successfulDelete(data){

		$.mobile.changePage('#' + channelListViewModel.template);
        channelListViewModel.clearForm();
        channelListViewModel.activate();
        
	}
	
	function successfulModify(){
	
	    var channelObject = {
		    id: that.channelid(),
		    name: that.editChannelName(),
		    description: that.editChannelDescription()
		};
		
        that.activate(channelObject);
        //TODO - just change the one object inside of the list of channels instead of calling to get all the channels again.
        channelListViewModel.refreshChannelList();
	}
	
	
	
	function successfulFollowChannel(){
		$.mobile.hidePageLoadingMsg();
		showMessage('Now Following Channel ' + $.mobile.pageData.id);
		
	}
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();

		
		
	}
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage('#' + loginViewModel.template)
		
	};
	
	function errorAPIChannel(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (loginPageIfBadLogin(details.code)){
			
            showError('Please log in or register to view this channel.');
		}
        else {
		    showError('Error Getting Channel: ' + ((status==500)?'Internal Server Error':details.message));
		}
            

	}
    
    function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError('Error: ' + ((status==500)?'Internal Server Error':details.message));
		

	}
    

    function errorFollowing(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (details.code == 100601){ // we are already following this channel
			
            
            
		}
        else {
		
		    showError('Error Following Channel: ' + details.message);
		}
	}
	
	function errorPostingMessage(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError('Error Posting Message: ' + details.message);

	}
	
	function errorRetrievingMessages(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError('Error Retrieving Messages: ' + ((status==500)?'Internal Server Error':details.message));

	}
	
	this.getChannelCommand = function (lchannelid) {
		
		$.mobile.showPageLoadingMsg('a', 'Loading Channel');

		return ES.channelService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPIChannel});
		
	};
    
    this.showMoreMessagesCommand = function(){
        
        var last_message_id = that.messages()[that.messages().length - 1].id;
        
        $.mobile.showPageLoadingMsg('a', 'Loading Messages');
		
		return ES.messageService.getChannelMessages(that.channelid(), {before: last_message_id}, {success: successfulMessageGET, error: errorRetrievingMessages}).then(gotMoreMessages);
        
        
    }
	
	this.followChannelCommand = function(){
		
		that.messages([]);
		$.mobile.showPageLoadingMsg('a', 'Requesting to Follow Channel');
		return ES.channelService.followChannel(that.channelid(), {success: successfulFollowChannel, error: errorFollowing});
		
	};
    
    
    this.unfollowChannelCommand = function(){
	   
        
		$.mobile.showPageLoadingMsg('a', 'Requesting to Unfollow Channel');
        var callbacks = {
        success: function(){;},
            error: errorUnfollow
        };
		
        return ES.channelService.unfollowChannel(that.channelid(),callbacks).then(successfulUnfollowChannel);
		
	};
    
    
    function successfulUnfollowChannel(data){
        
        that.showChannelList();
    }
    
    function errorUnfollow(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError('Error Unfollowing Channel: ' + ((status==500)?'Internal Server Error':details.message));
	}
	
	this.deleteChannelCommand = function () {

		$.mobile.showPageLoadingMsg('a', 'Removing Channel');
		return ES.channelService.deleteChannel(that.channelid(), { success: successfulDelete, error: errorAPI });

	};
    
    
    this.showMessage = function (message) {
        localStorage.setItem('currentMessage', JSON.stringify(message));
        
		
		$.mobile.changePage('#' + messageViewModel.template)
	};
    
    
    
    this.showChannelMenu = function(){
        
         $.mobile.changePage('#' + channelMenuViewModel.template);
        
    }
    
    
    
    this.backNav = function(){
        
        var lrelationship = 'O';
        
        if (that.channel()[0]){
            lrelationship = that.channel()[0].relationship;
        }
        
        if (lrelationship && lrelationship == 'F'){
            
            $.mobile.changePage('#' + channelBroadcastsViewModel.template);
        }
        else {
            $.mobile.changePage('#' + channelMenuViewModel.template);
        }
        
    };
 
 
    this.selectIcon = function(){
        selectIconViewModel.setCallBack(gotIcon);
        $.mobile.changePage('#' + selectIconViewModel.template);
        
        function gotIcon(iconObj){
            //alert(JSON.stringify(iconObj));
            var imageObj = {set: iconObj.set, id: iconObj.id};
            
            $.mobile.changePage('#' + that.template);
            that.editIconId(JSON.stringify(imageObj));
            
            var mappedIcon = selectIconViewModel.mapImage(iconObj.set, iconObj.id, 68);
            that.selectIconObj(mappedIcon);
            
        }
        
    };
	
	this.modifyChannelCommand = function(){
		
		
		var channelObject = {
		    id: that.channelid(),
		   // name: that.editChannelName(),
		    description: that.editChannelDescription(),
		    longDescription: that.editLongDescription(),
		    picId: that.editIconId()
		};
		
		return ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
	};
	
	

	
	
}
*/