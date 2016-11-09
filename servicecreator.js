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
    this.token = prophash.token;
    this.cache = new lib.Map();
    this.cache_time = prophash.cache_time ||  15 * 60 * 1000;
    this.job_interval = prophash.job_interval || 15 * 1000;
    this.invalidateCount = 0; //to lib
    this.aged = []; //to lib
    this.maxAge = 4*60*2; //2 hours, to lib
    this.doCronJob(); //to lib
    this.createListenerMethod(prophash.token, prophash.modulehandler).then(
      this.readyToAcceptUsersDefer.resolve.bind(this.readyToAcceptUsersDefer, true)
    );
  }
  
  ParentService.inherit(TelegramBotService, factoryCreator);
  
  TelegramBotService.prototype.__cleanUp = function() {
    this.aged = null;
    this.invalidateCount = null;
    this.job_interval = null;
    this.cache_time = null;
    if (!!this.cache){
      this.cache.destroy();
    }
    this.cache = null;
    this.token = null;
    ParentService.prototype.__cleanUp.call(this);
  };

  TelegramBotService.prototype.doAging = function(item,name){
    if (!lib.isDefinedAndNotNull(item.age)) item = 0;
    item.age++;
    if (item.age >= this.maxAge){
      this.aged.push(name);
    }
  };

  TelegramBotService.prototype.invalidateCacheEntry = function(item,name,map){
    var ret;
    var results = item.results;
    var timestamp = item.timestamp;
    if (name.indexOf('PERSISTENT') === 0){
      return;
    }
    this.doAging(item,name);
    if (!results || !timestamp){
      return false;
    }
    if (Date.now() - timestamp > this.cache_time){
      item.results = null;
      item.timestamp = null;
      return true;
    }
    return false;
  };

  TelegramBotService.prototype.removeFromCache = function(entryName){
    var ret = this.cache.remove(entryName);
    console.log('IZBRISAO IZ CACHE!');
  };

  TelegramBotService.prototype.clearCache = function(){
    this.cache.traverse(this.invalidateCacheEntry.bind(this));
    this.aged.forEach(this.removeFromCache.bind(this));
    this.aged = [];
  };

  TelegramBotService.prototype.makeInProcessRequest = function(){
    this[this.token](null,{inprocess_request:'call_api'});
  };

  TelegramBotService.prototype.cronJob = function(){
    this.clearCache();
    this.makeInProcessRequest();
    this.doCronJob();
  };

  //move cron job functionallity to lib
  TelegramBotService.prototype.doCronJob = function(){
    setTimeout(this.cronJob.bind(this),this.job_interval);
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
      if (!!req.inprocess_request){ //InProcess request
        TelegramResponder.inProcessFactory(req, responderClass, this.cache);
        return;
      }
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
