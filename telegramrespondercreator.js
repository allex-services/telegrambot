function createTelegramResponder (execlib) {
  'use strict';

  var lib = execlib.lib;
  var MessageTypes = require('./messageTypes/messagetypes.js')(execlib);
  var Message = MessageTypes.Message;
  var InlineQuery = MessageTypes.InlineQuery;
  var ChosenInlineResult = MessageTypes.ChosenInlineResult;
  var CallbackQuery = MessageTypes.CallbackQuery;

  function TelegramResponder (res, jsonreq) {
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
    //TODO edited_message, callback_query
    return jsonreq;
  };
  TelegramResponder.prototype.callMethod = function (methodName, params) {
    //var ret = JSON.stringify(lib.extend({method:methodName},params));
    this.res.setHeader('Content-Type', 'application/json');
    this.res.end(JSON.stringify(lib.extend({method:methodName},params)));
    this.destroy();
  };

  //to override
  TelegramResponder.prototype.process = function () {
  };

  TelegramResponder.factory = function (res, responderClassName, req) {
    var jsonreq, responderClass;
    try {
      jsonreq = JSON.parse(req);
      if (!responderClassName){
        new TelegramResponder(res, jsonreq);
      }else{
        //responderClass = require('./' + responderClassName + 'respondercreator.js')(TelegramResponder, execlib);
        responderClass = require(responderClassName)(TelegramResponder, execlib);
        new responderClass(res, jsonreq);
      }
    } catch(e) {
      console.error(e);
      res.end('');
    }
  };

  TelegramResponder.MessageTypes = require('./messageTypes/messagetypes.js')(execlib);


  return TelegramResponder;
}

module.exports = createTelegramResponder;
