function EnymAmpSvc() {

  var t = this;
  t.request = function(resourceId, data) {
    var dfrd = $.Deferred();
    amplify.request({
      resourceId : resourceId,
      data : data,
      success : dfrd.resolve,
      error : dfrd.reject
    });
    return dfrd.promise();
  };


// var baseURL = 'https://api.evernym.com/api24/rest/';
  var baseURL = 'http://localhost:8079/api24/rest/';
  var acct = 'account';
  var chnl = 'channel';

  function defineGet(name, base, rsc) { define(name, base, rsc, 'GET'); }
  function definePost(name, base, rsc) { define(name, base, rsc, 'POST'); }
  function definePut(name, base, rsc) { define(name, base, rsc, 'PUT'); }
  function defineDelete(name, base, rsc) { define(name, base, rsc, 'DELETE'); }
  

  function define(name, baseRcs, extRsc, type) {
    var settings = {
      url: baseURL + baseRcs + (extRsc == undefined ? '' : '/' + extRsc),
      dataType: 'json',
      type: type
      //contentType : 'application/json'
    };
    amplify.request.define(name, 'ajax', settings);
  }

  defineGet('getChnl', chnl, '{id}');
  definePost('enroll', acct, 'enroll');
  defineGet('checkName', acct, '{name}');
  definePost('login', acct, 'login');
  defineGet('getAccount', acct);
  definePut('modAccount', acct);
  definePost('logout', acct, 'logout');
  definePost('forgotPassword', acct, 'forgot');
  definePut('resetPassword', acct, 'forgot');
  definePut('changePassword', acct, 'password');
   
}