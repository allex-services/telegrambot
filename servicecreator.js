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
    this.createListenerMethod(prophash.token, prophash.modulehandler).then(
      this.readyToAcceptUsersDefer.resolve.bind(this.readyToAcceptUsersDefer, true)
    );
  }
  
  ParentService.inherit(TelegramBotService, factoryCreator);
  
  TelegramBotService.prototype.__cleanUp = function() {
    ParentService.prototype.__cleanUp.call(this);
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
        TelegramResponder.factory.bind(null, res, responderClass)
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
