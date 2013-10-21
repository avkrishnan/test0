function EvernymService() {


    console.log('loading EvernymService');
    var that = this;
	//var baseUrl = 'http://qupler.no-ip.org:8080/api/rest';
	var baseUrl = 'https://api.evernym.com/api24/rest';
    
    this.getBaseUrl = function(){return baseUrl;};
    
    this.doAfterDone = function(){};
    
    this.doAfterFail = function(){};
    
	this.callAPI = function(method, resource, object, callbacks, useAccessToken) {
		
        var currentBaseUrl = localStorage.getItem("baseUrl");
        
        if (currentBaseUrl){
            baseUrl = currentBaseUrl;
        }
        
        var ajaxParams = {
		url: baseUrl + resource,
		type: method,
		data: JSON.stringify(object),
		dataType: "json",
		contentType: "application/json"
		};
		
		var accessToken = localStorage.getItem("accessToken");
		if (useAccessToken && accessToken) {
            
			ajaxParams.beforeSend = function (xhr) {
				xhr.setRequestHeader("Authorization", accessToken);
			}
		}
        
        var deferred = $.Deferred();
           
		var ajaxCall = $.ajax(ajaxParams);
		
		ajaxCall.done(function (data, textStatus, jqXHR) {
		
		              that.doAfterDone();
                      
                      if (callbacks && callbacks.success){
					      callbacks.success(data, textStatus, jqXHR.status, jqXHR.responseText);
					  }
					  deferred.resolve(data, textStatus, jqXHR.status, jqXHR.responseText);
					  
					  });
		
		ajaxCall.fail(function (jqXHR, textStatus, errorThrown) {
		
					  var pattern = /<b>description<\/b>/;
					  
					  var details = {};
	    
	                  var results = pattern.exec(jqXHR.responseText);
	                  
	                  if (results && results.length){
	                      details.message = parseDescription(jqXHR.responseText);
	                  }
	                  else {
	                      details = JSON.parse(jqXHR.responseText);
	                  }
					  
                      
                      that.doAfterFail(ajaxParams, jqXHR, textStatus, errorThrown, details);
					  
					  if (callbacks && callbacks.error){
					      callbacks.error(errorThrown ? errorThrown : textStatus, jqXHR.status, details);
					  }
					  
					  deferred.reject(errorThrown ? errorThrown : textStatus, jqXHR.status, details);
					  
					  });
		
		return deferred.promise();
		
	};
	
	
	function parseDescription(html){
	    var description = '';
	    
	/*

<html><head><title>Apache Tomcat/7.0.26 - Error report</title><style><!--H1 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:22px;} H2 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:16px;} H3 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:14px;} BODY {font-family:Tahoma,Arial,sans-serif;color:black;background-color:white;} B {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;} P {font-family:Tahoma,Arial,sans-serif;background:white;color:black;font-size:12px;}A {color : black;}A.name {color : black;}HR {color : #525D76;}--></style> </head><body><h1>HTTP Status 400 - Bad Request</h1><HR size="1" noshade="noshade"><p><b>type</b> Status report</p><p><b>message</b> <u>Bad Request</u></p><p><b>description</b> <u>The request sent by the client was syntactically incorrect (Bad Request).</u></p><HR size="1" noshade="noshade"><h3>Apache Tomcat/7.0.26</h3></body></html>

*/    
	    
	    var pattern = /<p><b>description<\/b>(.*)<\/p>/
	    
	    var results = pattern.exec(html);
	    if (results.length){
	        description = results[1];
	    }
	    
	    return description;
	}




  
}
