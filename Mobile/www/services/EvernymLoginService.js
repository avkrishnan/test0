function EvernymLoginService(api) {

  console.log('loading EvernymLoginService');

  var t = this;

  t.accountEnroll = function(accountModel, callbacks) {
    return api.callAPI('POST', '/account/enroll', accountModel, callbacks);
  };

  t.checkName = function(name, callbacks) {
    return api.callAPI('GET', '/account/' + name, undefined, callbacks);
  };

  t.accountLogin = function(loginModel, callbacks) {
    return api.callAPI('POST', '/account/login', loginModel, callbacks);
  };

  t.getAccount = function(callbacks) {
    return api.callAPI('GET', '/account', undefined, callbacks, true);
  };

  t.accountModify = function(account, callbacks) {
    return api.callAPI('PUT', '/account', account, callbacks, true);
  };

  t.accountModifyOther = function(id, account) {
    return api.callAPI('PUT', '/account/' + id, account, undefined, true);
  };

  t.accountLogout = function(callbacks) {
    return api.callAPI('POST', '/account/logout', undefined, callbacks, true);
  };

  t.forgotPassword = function(forgotPasswordModel, callbacks) {
    return api.callAPI('POST', '/account/forgot', forgotPasswordModel, callbacks);
  };

  t.resetPassword = function(resetPasswordModel, callbacks) {
    return api.callAPI('PUT', '/account/forgot', resetPasswordModel, callbacks);
  };

  t.changePassword = function(passwordChangeRequest, callbacks) {
    return api.callAPI('PUT', '/account/password', passwordChangeRequest, callbacks, true);
  };

}