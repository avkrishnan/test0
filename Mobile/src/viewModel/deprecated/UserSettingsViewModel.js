﻿/*globals ko*/

function UserSettingsViewModel() {
	/// <summary>
	/// A view model that displays the communication means and urgency that user wants to recieve communications
	/// </summary>
	
	// --- properties
	
    this.template = "userSettingsView";
    this.viewid = "V-08";
    this.viewname = "UserSettings";
    this.displayname = "User Settings";
    this.hasfooter = true;
    
  
	this.channels = ko.observableArray([]);
    this.commethods = ko.observableArray([]);
    this.baseUrl = ko.observable();
    this.accountName = ko.observable();
    this.name = ko.observable();
    
    
    this.firstname = ko.observable();
    this.lastname = ko.observable();
    
    
    this.newComMethod = ko.observable();
    this.newComMethodName = ko.observable();
    this.comMethodType = ko.observable("EMAIL");
    
    this.navText = ko.observable();
    this.pView = '';
    
	var that = this;
  
	this.applyBindings = function(){
        $("#" + that.template).on("pagebeforeshow", null, function (e, data) {
                                    
                                    var currentBaseUrl = ENYM.ctx.getItem("baseUrl");
                                    
                                    
                                    var previousView = ENYM.ctx.getItem('previousView');
                                    console.log("previousView: " + previousView);
                                    var vm = ko.dataFor($("#" + previousView).get(0));
                                    console.log("previousView Model viewid: " + vm.displayname);
                                    that.navText(vm.displayname);
                                    that.pView = previousView;
                                    
                                    if (currentBaseUrl){
                                    that.baseUrl(currentBaseUrl);
                                    }
                                    else {
                                    
                                        that.baseUrl(ES.evernymService.getBaseUrl());
                                    }
                                    
                                    
                                    that.activate();
                                    
                                    
                                    });
    };
    
    
	
    
    
    this.activate = function() {
        
        
        var _accountName = ENYM.ctx.getItem("accountName");
        var _name = ENYM.ctx.getItem("UserFullName");
        
        that.accountName(_accountName);
		that.name(_name);
        
        
		that.getCommethods().then(gotCommethods);

		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;
            
	};
	
	this.backNav = function(){
        $.mobile.changePage("#" + that.pView);
    };
	
	
    
    function gotCommethods(data){
        //alert(JSON.stringify(data));
        that.commethods(data.commethod);
        $(window).resize();
    }
    
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template);
	};
	
    
    this.changeBaseUrl = function(){
        showMessage('stored base url: ' + that.baseUrl());
        ENYM.ctx.setItem("baseUrl", that.baseUrl());
    };
	
    function commethodError(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error Getting Communication Methods: " + details.message);
		//logger.logError('error listing channels', null, 'channel', true);

        
    }
    
    function requestVerificationError(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error Requesting Verification: " + details.message);
		
        
        
    }
    
    
    function requestVerificationSuccess(data){
		
        $("#chicken").html("Verification Email Sent");
        
        
    }

    
    this.verifyCommand = function(commethod){
        
        //showMessage(JSON.stringify(commethod));
        
        $.mobile.showPageLoadingMsg("a", "Requesting Verification");
        
        var callbacks = {
        //success: requestVerificationSuccess,
        
        success: function (){
            $("#commethod-" + commethod.id).html("Verification Email Sent");
        },
        error: requestVerificationError
        };
        
        
        return ES.commethodService.requestVerification( commethod.id, callbacks);
        
    };
    
    
    this.verifyCodeCommand = function(commethod){
        
        showCodeDialog();
        
        function verificationSuccess(){
            showMessage("Successfully Verified Communication Method");
            that.getCommethods().then(gotCommethods);
        }
        
        function verificationError(data, status, details){
			$.mobile.hidePageLoadingMsg();
			showError("Error in Verification: " + details.message);
			loginPageIfBadLogin(details.code);
		};
        
        function submitVerificationCode(){
        
            var code = $("#verifyCode").find("#verifyCodeCode").val();
            
            $.mobile.showPageLoadingMsg("a", "Verifying");
			var callbacks = {
			success: verificationSuccess,
			error: verificationError
			};
        
            var needsAuthentication = true;
			ES.commethodService.verification(code, callbacks, needsAuthentication).then(closeCodeDialog);
            
            
        }
        
        function closeCodeDialog(){
        
            $("#verifyCode").fadeOut( 400, function(){
                              $(this).remove();
                              });
        
        }
        
        function showCodeDialog(){
            
			var existingdiv = $("#verifyCode").get(0);
	
			if (!existingdiv){
	
			$("<div id='verifyCode' class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'>" +
			  "<h3>Verification Code</h3>" +
			  "<input type='text' id='verifyCodeCode' style='width:250px;' /><br/>" +
			  "<button id='submitcodebutton'>Submit</button>&nbsp;&nbsp;" +
			  "<button id='closecodebutton' >Cancel</button><br/>" +
			  "</div>")
			.css({ display: "block",
				 opacity: 0.90,
				 position: "fixed",
				 padding: "7px",
				 "text-align": "center",
				 width: "270px",
				 left: ($(window).width() - 284)/2,
				 top: "20px" /* $(window).height()/2 - 145 */ })
			.appendTo( $.mobile.pageContainer ).delay( 1500 )
			.find('#closecodebutton').click(closeCodeDialog)
			.end()
			.find('#submitcodebutton').click(submitVerificationCode)
			
			;
		}
		
		
	
    
}

        
    };
    
    
    
    this.getCommethods = function(){
    
        
        
        $.mobile.showPageLoadingMsg("a", "Getting Communication Methods");
        
        var callbacks = {
        success: function(){;},
        error: commethodError
        };
        
        
        return ES.commethodService.getCommethods( callbacks);

        
    };
	
	this.addNewComMethod = function(){
	
	    var commethod = that.newComMethod();
	    var _newComMethodName = that.newComMethodName();
	    var _comMethodType = that.comMethodType();
	    
	    
	    var callbacks = {
	    success: function(){ that.activate();},
	    error: errorAddComMethod
	    };
	    
	    var comobject = {
	        name : _newComMethodName,
            type : _comMethodType,
            address : commethod
	    };
	    
	    ES.commethodService.addCommethod(comobject, callbacks );
	   
    
	};
	
	this.deleteMethod = function(commethod){
	    
	    var callbacks = {
	    success: function(){ that.activate();},
	    error: errorDeleteComMethod
	    };
	    
	    ES.commethodService.deleteCommethod(commethod.id, callbacks );
	
	};
	
	
	this.changeNameCommand = function(){
	
	    var firstName = that.firstname();
	    var lastName = that.lastname();
	    
	    var callbacks = {
	    success: function(){ 
	        that.name(firstName + " " + lastName);
	        loginViewModel.getAccount();
	    
	     },
	    error: errorChangingName
	    };
	    
	    var nameObject = {
	        firstname: firstName,
	        lastname: lastName
	                
	    };
	    
	    ES.loginService.accountModify(nameObject, callbacks );
	   
    
	};
	
	function errorChangingName(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showError("Error Changing Name: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'commethodService', true);
	};
	
	function errorListChannels(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showError("Error listing channels: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'commethodService', true);
	};
	
	
	function errorAddComMethod(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showError("Error adding a com method: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'commethodService', true);
	};
	
	function errorDeleteComMethod(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showError("Error deleting a com method: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'commethodService', true);
	};
	
	
	
	
}
