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
  }
  
  ParentService.inherit(TrendingService, factoryCreator);
  
  TrendingService.prototype.__cleanUp = function() {
    ParentService.prototype.__cleanUp.call(this);
  };

  function catchHelper(res,err){
    res.end('{}');
    console.error(err);
  }

  TrendingService.prototype['260656864:AAEERH7CqNskjOT1f1VbNT0PLJ61QEYoBTE'] = function(url, req, res){
    this.extractRequestParams(url, req).then(
      TelegramResponder.factory.bind(null, res, 'trending')
    ).catch(
      catchHelper.bind(null,res) 
    );
  };

  
  return TrendingService;
}

module.exports = createTrendingService;
