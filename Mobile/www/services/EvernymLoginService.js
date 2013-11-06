function EvernymLoginService(api) {

  console.log('loading EvernymLoginService');

  var t = this;

  t.accountEnroll = function(accountModel, callbacks) {
    return api.callAPI('POST', '/account/enroll', accountModel, callbacks);
  };

  t.checkName = function(name, callbacks) {
    return api.callAPI('GET', '/account/' + name, undefined, callbacks);
  };

  t.forgotPassword = function(forgotPasswordModel, callbacks) {
    return api.callAPI('POST', '/account/forgot', forgotPasswordModel, callbacks);
  };

  t.resetPassword = function(resetPasswordModel, callbacks) {
    return api.callAPI('PUT', '/account/forgot', resetPasswordModel, callbacks);
  };

  t.accountLogin = function(loginModel, callbacks) {
    return api.callAPI('POST', '/account/login', loginModel, callbacks);
  };

  t.getAccount = function(loginModel, callbacks) {
    return api.callAPI('GET', '/account', undefined, callbacks, true);
  };

  t.changeName = function(account, callbacks) {
    return api.callAPI('PUT', '/account', account, callbacks, true);
  };

  t.accountLogout = function(callbacks) {
    return api.callAPI('POST', '/account/logout', undefined, callbacks, true);
  };

}