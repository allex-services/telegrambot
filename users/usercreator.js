function createUser(execlib, ParentUser) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  if (!ParentUser) {
    ParentUser = execlib.execSuite.ServicePack.Service.prototype.userFactory.get('user');
  }

  function User(prophash) {
    ParentUser.call(this, prophash);
  }
  
  ParentUser.inherit(User, require('../methoddescriptors/user'), [/*visible state fields here*/]/*or a ctor for StateStream filter*/);
  User.prototype.__cleanUp = function () {
    ParentUser.prototype.__cleanUp.call(this);
  };

  User.prototype.logSubscribers = function(defer){
    qlib.promise2defer(this.__service.logSubscribers(), defer);
  };

  User.prototype.logCnt= function(defer){
    qlib.promise2defer(this.__service.logCnt(), defer);
  };

  User.prototype.removeDuplicateSubscribers = function(defer){
    qlib.promise2defer(this.__service.removeDuplicateSubscribers(), defer);
  };

  return User;
}

module.exports = createUser;
