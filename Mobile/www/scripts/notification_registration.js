var pushNotification;
function successHandler (result) {
    alert('result = '+result);
}

function errorHandler (error) {
    //alert('error = '+error);
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    showError('device token = ' + result);
    submitFeedbackForRegid(result);
    addNewPushComMethod(result, 'APN');
    console.log("device token = " + result);
}

function registerPushNotifications(){
    pushNotification = window.plugins.pushNotification;
    
    if (device.platform == 'android' || device.platform == 'Android') {
        //pushNotification.register(successHandler, errorHandler,{"senderID":"397212499924","ecb":"onNotificationGCM"});
        pushNotification.register(successHandler, errorHandler,{"senderID":"819327889157","ecb":"onNotificationGCM"});
    
    } else {
        pushNotification.register(tokenHandler, errorHandler,  {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
    }

}



function errorAddingPushComMethod(data, status, details){
        $.mobile.hidePageLoadingMsg();
		showError("Error Adding Push Com Method: " + details.message);
	    
	}

function addNewPushComMethod(regid, platform){
	    
	    
	    var callbacks = {
	    success: function(){ alert('success'); },
	    error: errorAddingPushComMethod,
	    };
	    
	    var comobject = {
	    name : device.name,
	    type : "PUSH",
	    address : platform + ":" + regid
	        
	    };
	    
	    ES.commethodService.addCommethod(comobject, callbacks );
	   
    
	};


function submitFeedbackForRegid(regid){
    

    var feedback_comments = JSON.stringify({
        regid: regid,
        uuid: device.uuid,
        name: device.name,
        platform: device.platform,
        model: device.model,
        version: device.version,
        cordova: device.cordova
    });

    function sentFeedback(data){
        //showError("regid sent as feedback: " + feedback_comments);
    }
    function errorSendingFeedback(data, status, details){
                    showError("Error Sending Feedback: " + ((status==500)?"Internal Server Error":details.message));
        }
    var callbacks = {
        success: sentFeedback,
        error: errorSendingFeedback
    };

    var feedbackObject = {
        comments: feedback_comments,
        context: 'app start'
    };
    ES.systemService.sendFeedback(feedbackObject, callbacks);
}


// iOS
function onNotificationAPN(event) {
    
    
    
    alert(JSON.stringify(event));
    
    if (event.alert) {
        //navigator.notification.alert(event.alert);

        
        var type = 'single';//e.payload.type;
        
        if (type == 'single'){
            var channelid = event.channelid;
            var messageid = event.messageid;
            $.mobile.changePage( "#singleMessageView?id=" + messageid + "&channeid=" + channelid , {allowSamePageTransition: true});
        }
        else if (type == 'multiplesame'){
            $.mobile.changePage( "#channelView?id=" + channelid , {allowSamePageTransition: true});
        }
        else if (type == 'multiplevarious'){
            OVERLAY.show();
        }

        
        
    }
    
    if (event.sound) {
        //var snd = new Media(event.sound);
        //snd.play();
    }
    
    if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}


// Android
function onNotificationGCM(e) {
    
    
    switch( e.event )
    {
            
        case 'registered':
            if ( e.regid.length > 0 )
            {
            
                
                submitFeedbackForRegid(e.regid);
                addNewPushComMethod(e.regid, 'GCM');
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regid = " + e.regid);
            }
            break;
            
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                

                alert(JSON.stringify(e));
                // if the notification contains a soundname, play it.
                //var my_media = new Media("/android_asset/www/"+e.soundname);
                //my_media.play();
            }
            else
            {   // otherwise we were launched because the user touched a notification in the notification tray.
                        alert(JSON.stringify(e));
                        if (e.coldstart){
                            //alert('something about starting on a cold start');
                        }
                        else{
                            var type = 'single';//e.payload.type;
                            
                            
                            if (type == 'single'){
                                var channelid = e.payload.channelid;
                                var messageid = e.payload.messageid;
                                $.mobile.changePage( "#singleMessageView?id=" + messageid + "&channeid=" + channelid , {allowSamePageTransition: true});
                            }
                            else if (type == 'multiplesame'){
                                $.mobile.changePage( "#channelView?id=" + channelid , {allowSamePageTransition: true});
                            }
                            else if (type == 'multiplevarious'){
                                OVERLAY.show();
                            }
                            
                            
                        }
            }
            
            break;
            
        case 'error':
            alert('error');
            break;
            
        default:
            alert('a notification event was passed but we do not know what it is');
            break;
    }
}
