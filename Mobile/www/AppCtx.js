var ENYM = {};

ENYM.Ctx = function() {
    
  var self = this;
  
  self.setItem = function(key, value) {
    localStorage.setItem(key,value);
    //amplify.store(key, value);
  };

  self.removeItem = function(key) {
    localStorage.removeItem(key);
    //amplify.store(key, null);
  };

  self.getItem = function(key) {
    return localStorage.getItem(key);
    //return amplify.store(key);
  };

};

ENYM.ctx = new ENYM.Ctx();
  
