function createTrendingService(execlib, ParentService) {
  'use strict';
  
  var lib = execlib.lib,
    TelegramResponder = require('./telegramrespondercreator')(execlib);

  function factoryCreator(parentFactory) {
    return {
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')),
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')) 
    };
  }

  function TrendingService(prophash) {
    ParentService.call(this, prophash);
    this.createListenerMethod(prophash.token, prophash.modulehandler);
  }
  
  ParentService.inherit(TrendingService, factoryCreator);
  
  TrendingService.prototype.__cleanUp = function() {
    ParentService.prototype.__cleanUp.call(this);
  };

  function catchHelper(res,err){
    res.end('{}');
    console.error(err);
  }

  function listenerGenerator (modulehandlername) {
    var ret = function (url, req, res) {
      if (!modulehandlername) {
        //throw lib.Error(...);
        res.end('{}');
        return;
      }
      this.extractRequestParams(url, req).then(
        TelegramResponder.factory.bind(null, res, modulehandlername)
      ).catch(
        catchHelper.bind(null,res) 
      );
    };
    ret.destroy = function () {
      modulehandlername = null;
    };
    return ret;
  }

  TrendingService.prototype.createListenerMethod = function (token, modulehandlername) {
    TrendingService.prototype[token] = listenerGenerator(modulehandlername);
  };

  /*
  TrendingService.prototype['260656864:AAEERH7CqNskjOT1f1VbNT0PLJ61QEYoBTE'] = function(url, req, res){
  };
  */


  TrendingService.prototype.propertyHashDescriptor = {
    token: {
      type: 'string'
    },
    modulehandler: {
      type: 'string'
    }
  };

  
  return TrendingService;
}

module.exports = createTrendingService;
