function createTelegramResponder (execlib) {
  'use strict';

  var lib = execlib.lib;
  var MessageTypes = require('./messageTypes/messagetypes.js')(execlib);
  var Message = MessageTypes.Message;
  var InlineQuery = MessageTypes.InlineQuery;
  var ChosenInlineResult = MessageTypes.ChosenInlineResult;
  var CallbackQuery = MessageTypes.CallbackQuery;
  var InProcessRequest = MessageTypes.InProcessRequest;

  function TelegramResponder (res, jsonreq, token) {
    this.token = token;
    this.res = res;
    this.incomingRequest = this.createRequest(jsonreq);
    this.process();
  }
  TelegramResponder.prototype.destroy = function () {
    this.incomingRequest = null;
    this.res = null;
  };
  TelegramResponder.prototype.createRequest = function(jsonreq){
    if (!!jsonreq.message){
      return new Message(jsonreq);
    }
    if (!!jsonreq.inline_query){
      return new InlineQuery(jsonreq);
    }
    if (!!jsonreq.chosen_inline_result){
      return new ChosenInlineResult(jsonreq);
    }
    if (!!jsonreq.callback_query){
      return new CallbackQuery(jsonreq);
    }
    if (!!jsonreq.inprocess_request){
      return new InProcessRequest(jsonreq);
    }
    console.log('??! AKO NIJE NISTA OD OVOGA?',jsonreq);
    //TODO edited_message
    return jsonreq;
  };
  TelegramResponder.prototype.callMethod = function (methodName, params) {
    //var ret = JSON.stringify(lib.extend({method:methodName},params));
    this.res.setHeader('Content-Type', 'application/json');
    this.res.end(JSON.stringify(lib.extend({method:methodName},params)));
    this.destroy();
  };

  TelegramResponder.prototype.onNotificationSent = function(){
    console.log('Successfully sent NOTIFICATION');
    this.destroy();
  };

  TelegramResponder.prototype.onNotificationFailed = function(){
    console.log('Error on NOTIFICATION sending');
    this.destroy();
  };

  TelegramResponder.prototype.sendNotification = function (methodName, params) {
    lib.request('https://api.telegram.org/bot' + this.token + '/' + methodName,{ 
      parameters: params,
      method: 'POST', 
      onComplete: this.onNotificationSent.bind(this),
      onError: this.onNotificationFailed.bind(this) 
    });
  };

  //to override
  TelegramResponder.prototype.process = function () {
  };

  TelegramResponder.factory = function (res, responderClass, cache, subscribers, favorites, token, req) {
    var jsonreq;
    try {
      jsonreq = JSON.parse(req);
      if (!responderClass){
        new TelegramResponder(res, jsonreq);
      }else{
        new responderClass(res, jsonreq, cache, subscribers, favorites, token);
      }
    } catch(e) {
      console.error(e);
      res.end('{}');
    }
  };

  TelegramResponder.inProcessFactory = function (jsonreq, responderClass, cache, subscribers, favorites, token) {
    try {
      if (!responderClass){
        new TelegramResponder(null, jsonreq);
      }else{
        new responderClass(null, jsonreq, cache, subscribers, favorites, token);
      }
    } catch(e) {
      console.error(e);
      res.end('{}');
    }
  };

  TelegramResponder.MessageTypes = require('./messageTypes/messagetypes.js')(execlib);


  return TelegramResponder;
}

module.exports = createTelegramResponder;
