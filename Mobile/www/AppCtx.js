var ENYM = {};

ENYM.Ctx = function() {
    
  var self = this;
  
  self.setItem = function(key, value) {
    //localStorage.setItem(key,value);
    amplify.store(key, value);
    console.log('stored ' + key);
  };

  self.removeItem = function(key) {
    //localStorage.removeItem(key);
    amplify.store(key, null);
    console.log('removed ' + key);
  };

  self.getItem = function(key) {
    //return localStorage.getItem(key);
    console.log('retrieved ' + key);
    var result = amplify.store(key);
    return result == undefined ? null : result;
  };

};

ENYM.ctx = new ENYM.Ctx();
  
