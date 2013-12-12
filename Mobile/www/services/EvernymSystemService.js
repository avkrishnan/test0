function EvernymSystemService(api) {

  console.log('loading EvernySystemService');

  var t = this;
  
  t.sendFeedback = function(feedbackObject, callbacks) {
    return api.callAPI('POST', '/system/feedback', feedbackObject, callbacks,
        true);
  };

  t.getUrgencySettings = function(callbacks) {
    return api.callAPI('GET', '/system/urgency', undefined, callbacks, true);
  };

  t.getMsgNotifs = function(callbacks) {
    return api.callAPI('GET', '/notification?type=msg', undefined, callbacks, true);
  };

  t.getMsgNotifsSmry = function(callbacks) {
    return api.callAPI('GET', '/notification/summary?type=msg', undefined, callbacks, true);
  };

  t.MnsCacheData = {};
  t.MnsLastUpdated = 0;

  t.MnsCacheTTL = 60000; //60 seconds
  
  t.adjMnsCount = function(adj) {
    t.MnsCacheData.data.unreadCount += adj;
    var elapsed = Date.now() - t.MnsLastUpdated;
    if (elapsed > (t.MnsCacheTTL-5000) && elapsed < t.MnsCacheTTL) { // if cache will expired in next 5 seconds 
      t.MnsLastUpdated = Date.now() - (t.MnsCacheTTL-5000); // set it to expire in 5 seconds (this makes sure the back end is updated before the next api call)
    }
  };
  
  t.getMsgNotifsSmry_C = function(callbacks) {
    var elapsed = Date.now() - t.MnsLastUpdated;
    var dfrd = $.Deferred();
    if (elapsed > 0 && elapsed < 60000) {
      var c = t.MnsCacheData;
      dfrd.resolve(c.data, c.textStatus, c.status, c.responseText);
    } else {
      t.getMsgNotifsSmry(callbacks)
      .then(
        function(data, textStatus, status, responseText) {
          t.MnsLastUpdated = Date.now();
          t.MnsCacheData.data = data;
          t.MnsCacheData.textStatus = textStatus;
          t.MnsCacheData.status = status;
          t.MnsCacheData.responseText = responseText;
          dfrd.resolve(data, textStatus, status, responseText);
        }, 
        function(textStatus, status, details) {
          t.MnsLastUpdated = 0;
          dfrd.reject(textStatus, status, details);
        }
      );
    }
    return dfrd.promise();
  };

};