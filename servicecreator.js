function createTelegramBotService(execlib, ParentService) {
  'use strict';
  
  var lib = execlib.lib,
    q = lib.q,
    TelegramResponder = require('./telegramrespondercreator')(execlib),
    notifyInterval = 50;

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
    this.aged = []; //to lib
    this.maxAge = 4*60*2; //2 hours, to lib
    this.notified = {
      google : {ind : false, milestone: 10}, 
      twitter : {ind : false, milestone: 15}, 
      youtube : {ind : false, milestone: 21} 
    };
    this.doCronJob(); //to lib
    this.createListenerMethod(prophash.token, prophash.modulehandler, prophash.subscribehandler).then(
      this.readyToAcceptUsersDefer.resolve.bind(this.readyToAcceptUsersDefer, true)
    );
  }
  
  ParentService.inherit(TelegramBotService, factoryCreator);
  
  TelegramBotService.prototype.__cleanUp = function() {
    this.notified = null;
    if (!!this.subscribeMechanics){
      this.subscribeMechanics.destroy();
    }
    this.subscribeMechanics = null;
    this.aged = null;
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
    if (!lib.isDefinedAndNotNull(item.age)) item.age = 0;
    item.age++;
    if (item.age >= this.maxAge){
      this.aged.push(name);
    }
  };

  TelegramBotService.prototype.invalidateCacheEntry = function(item,name,map){
    var ret;
    var content = item.content;
    var timestamp = item.timestamp;
    if (name.indexOf('REMOVABLE') !== 0){
      return;
    }
    if (!content || !timestamp){
      return false;
    }
    this.doAging(item,name);
    if (Date.now() - timestamp > this.cache_time){
      if (lib.isFunction(item.destroy)){
        item.destroy();
      }
      item.content = null;
      return true;
    }
    return false;
  };

  TelegramBotService.prototype.removeFromCache = function(entryName){
    var ret = this.cache.remove(entryName);
  };

  TelegramBotService.prototype.clearCache = function(){
    this.cache.traverse(this.invalidateCacheEntry.bind(this));
    this.aged.forEach(this.removeFromCache.bind(this));
    this.aged = [];
  };

  TelegramBotService.prototype.makeAPICall = function(){
    this[this.token](null,{inprocess_request:'call_api'});
  };

  function checkTime(delta,milestone){
    var now = new Date();
    var nowMillis = now.getTime();
    if ((now.getHours() < milestone) && (new Date(nowMillis + delta).getHours() >= milestone)){
      //1 period behind milestone
      return -1;
    }
    if ((new Date(nowMillis - delta).getHours() < milestone) && (now.getHours() >= milestone)){
      //1 period after milestone
      return 1;
    }
    //0, invalid
    return 0;
  }

  TelegramBotService.prototype.notificationJob = function(inprocess_request,subscribers,index){
    var subscriber = subscribers[index];
    this[this.token](null, {
      inprocess_request : inprocess_request,
      data : subscriber 
    });
    this.notify(inprocess_request,index+1,subscribers);
  };

  TelegramBotService.prototype.notify = function(inprocess_request,index,subscribers){
    if (!subscribers || !subscribers.length) return;
    if (!subscribers[index]){
      //resolve if some notification on end/error needed
      return;
    }
    setTimeout(this.notificationJob.bind(this,inprocess_request,subscribers,index),notifyInterval);
  };

  TelegramBotService.prototype.doNotify = function(){
    if (checkTime(this.job_interval,this.notified.google.milestone) === 1){
      this.subscribeMechanics.getOldest(1000).then(
        this.notify.bind(this,'notify_google',0)
      );
    }
    if (checkTime(this.job_interval,this.notified.twitter.milestone) === 1){
      this.subscribeMechanics.getOldest(1000).then(
        this.notify.bind(this,'notify_twitter',0)
      );
    }
    if (checkTime(this.job_interval,this.notified.youtube.milestone) === 1){
      this.subscribeMechanics.getOldest(1000).then(
        this.notify.bind(this,'notify_youtube',0)
      );
    }
  }

  TelegramBotService.prototype.cronJob = function(){
    //TODO get subscribers from storage, filter them and notify
    this.doNotify();
    this.clearCache();
    this.makeAPICall();
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

  function onModuleHandler (token, respondermodule, subscribemodule) {
    this.subscribeMechanics = new subscribemodule.Mechanics('subscribers.db'); 
    var responderClass = respondermodule(TelegramResponder);
    var ret = function (url, req, res) {
      if (!!req.inprocess_request){ //InProcess request
        TelegramResponder.inProcessFactory(req, responderClass, this.cache, this.subscribeMechanics, token);
        return;
      }
      if (!responderClass) {
        //throw lib.Error(...);
        res.end('{}');
        return;
      }
      this.extractRequestParams(url, req).then(
        TelegramResponder.factory.bind(null, res, responderClass, this.cache, this.subscribeMechanics, token)
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

  TelegramBotService.prototype.createListenerMethod = function (token, modulehandlername, subscribehandlername) {
    return execlib.loadDependencies('client', [modulehandlername,subscribehandlername], onModuleHandler.bind(this, token));
  };

  /*
  TelegramBotService.prototype['260656864:AAEERH7CqNskjOT1f1VbNT0PLJ61QEYoBTE'] = function(url, req, res){
  };
  */

  TelegramBotService.prototype.logSubscribers = function(){
    return this.subscribeMechanics.logAll();
  };

  TelegramBotService.prototype.removeDuplicateSubscribers = function(){
    return this.subscribeMechanics.removeDuplicateValue('id');
  };


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
