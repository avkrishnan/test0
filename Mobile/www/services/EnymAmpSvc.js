//Run this once
function EnymAmpSetup(altBaseUrl) {
  console.log('setting up Evernym Amplify resources');

  var baseUrl = altBaseUrl ? altBaseUrl : 'https://api.evernym.com/api24/rest';

  var acct = 'account';
  var chnl = 'channel';
  var flwr = 'follower';

  function defineGet(name, base, rsc) { define(name, base, rsc, 'GET'); }
  function definePost(name, base, rsc) { define(name, base, rsc, 'POST'); }
  function definePut(name, base, rsc) { define(name, base, rsc, 'PUT'); }
  function defineDelete(name, base, rsc) { define(name, base, rsc, 'DELETE'); }

  function define(name, baseRcs, extRsc, type) {
    var settings = {
      url: baseUrl + '/' + baseRcs + (extRsc == undefined ? '' : extRsc),
      dataType: 'json',
      type: type
    };
    amplify.request.define(name, 'ajax', settings);
  }

  //Admin services (privileged services only available to certain users, like Evernym corporate employees
  defineGet('feedback', admin, '/feedback');
  
  //Account (Login) services
  definePost('enroll', acct, '/enroll');
  defineGet('checkName', acct, '/{name}');
  definePost('login', acct, '/login');
  defineGet('getAccount', acct);
  definePut('modAccount', acct);
  definePost('logout', acct, '/logout');
  definePost('forgotPassword', acct, '/forgot');
  definePut('resetPassword', acct, '/forgot');
  definePut('changePassword', acct, '/password');

  //Channel services
  definePost('createChnl', chnl); //formerly createChannel
  defineGet('getOwnedChnls', chnl, '?relationship=O'); //formerly listMyChannels
  defineGet('getFollowedChnls', chnl, '?relationship=F'); //formerly listFollowingChannels
  defineGet('getChnl', chnl, '/{id}'); //formerly getChannel
  definePost('followChnl', chnl, '/{id}/' + flwr); //formerly followChannel
  defineGet('getFollowers', chnl, '/{id}/' + flwr); //formerly getFollowers
  defineGet('getFollower', flwr, '/{id}');
  defineDelete('unfollowChnl', chnl, '/{id}/' + flwr); //formerly unfollowChannel
  definePost('addFollower', chnl, '/{id}/' + flwr); //formerly addFollower
  defineDelete('removeFollower', chnl, '/{id}/' + flwr + '/{fid}'); // formerly removeFollower
  defineDelete('deleteChnl', chnl, '/{id}'); //formerly deleteChannel
  definePut('modChnl', chnl, '/{id}'); //formerly modifyChannel
 
}

//Constructor
function EnymAmpSvc(altStorage) {

  console.log('loading EvernymService');

  var self = this;
  
  self.request = function(resourceId, data) {
    var dfrd = $.Deferred();
    amplify.request({
      resourceId : resourceId,
      data : data,
      success : dfrd.resolve,
      error : dfrd.reject
    });
    return dfrd.promise();
  };

  self.storage = altStorage ? altStorage : localStorage;

  self.getAccessToken = function() {
    return self.storage.getItem('accessToken');
  };

  self.clearAccessToken = function() {
    self.storage.removeItem('accessToken');
  };

  self.setAccessToken = function(accessToken) {
    self.storage.setItem('accessToken', accessToken);
  };

}