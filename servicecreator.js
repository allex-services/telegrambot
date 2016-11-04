function createTelegramBotService(execlib, ParentService) {
  'use strict';
  
  var lib = execlib.lib,
    q = lib.q,
    TelegramResponder = require('./telegramrespondercreator')(execlib);

  function factoryCreator(parentFactory) {
    return {
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')),
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')) 
    };
  }

  function TelegramBotService(prophash) {
    ParentService.call(this, prophash);
    this.cache = new lib.Map();
    this.cache_time = prophash.cache_time ||  30 * 1000;
    this.job_interval = prophash.job_interval || 15 * 1000;
    this.clearCacheCronJob();
    this.createListenerMethod(prophash.token, prophash.modulehandler).then(
      this.readyToAcceptUsersDefer.resolve.bind(this.readyToAcceptUsersDefer, true)
    );
  }
  
  ParentService.inherit(TelegramBotService, factoryCreator);
  
  TelegramBotService.prototype.__cleanUp = function() {
    this.cache_time = null;
    if (!!this.cache){
      this.cache.destroy();
    }
    this.cache = null;
    ParentService.prototype.__cleanUp.call(this);
  };

  TelegramBotService.prototype.invalidateCacheEntry = function(item,name,map){
    var ret;
    var results = item.results;
    var timestamp = item.timestamp;
    if (!results || !timestamp){
      return false;
    }
    if (Date.now() - timestamp > this.cache_time){
      item.results = null;
      item.timestamp = null;
      console.log('Ovaj je zastareo!',name);
      return true;
    }
    return false;
  };

  TelegramBotService.prototype.clearCache = function(){
    console.log('Idem u traversiranje cache-a');
    this.cache.traverse(this.invalidateCacheEntry.bind(this));
    console.log('Ispraznio cache!');
    this.clearCacheCronJob();
  };

  TelegramBotService.prototype.clearCacheCronJob = function(){
    console.log('Navio sad koji ce za ' + this.job_interval + ' da clearuje cache');
    setTimeout(this.clearCache.bind(this),this.job_interval);
  };

  TelegramBotService.prototype.isInitiallyReady = function () {
    return false;
  };

  function catchHelper(res,err){
    res.end('{}');
    console.error(err);
    res = null;
    err = null;
  }

  function onModuleHandler (token, respondermodule) {
    var responderClass = respondermodule(TelegramResponder);
    var ret = function (url, req, res) {
      if (!responderClass) {
        //throw lib.Error(...);
        res.end('{}');
        return;
      }
      this.extractRequestParams(url, req).then(
        TelegramResponder.factory.bind(null, res, responderClass, this.cache)
      ).catch(
        catchHelper.bind(null,res) 
      );
    };
    ret.destroy = function () {
      responderClass = null;
    };
    TelegramBotService.prototype[token] = ret;
    return q(true);
  }

  TelegramBotService.prototype.createListenerMethod = function (token, modulehandlername) {
    return execlib.loadDependencies('client', [modulehandlername], onModuleHandler.bind(null, token));
  };

  /*
  TelegramBotService.prototype['260656864:AAEERH7CqNskjOT1f1VbNT0PLJ61QEYoBTE'] = function(url, req, res){
  };
  */


  TelegramBotService.prototype.propertyHashDescriptor = {
    token: {
      type: 'string'
    },
    modulehandler: {
      type: 'string'
    }
  };

  
  return TelegramBotService;
}

module.exports = createTelegramBotService;
