var FeedMe = require('feedme'),
  Https = require('https');

function createTrendingResponder (execlib){

  var TelegramResponder = require('./telegramrespondercreator')(execlib);
  var lib = execlib.lib;
  var MessageTypes = require('./messageTypes/messagetypes.js')(execlib);
  var ReplyMessage = MessageTypes.ReplyMessage;
  var InlineQueryResultArticle = MessageTypes.InlineQueryResultArticle;

  function TrendingResponder(res, req){
    this.defaultMessage = 'I am not smart right now...';
    this.items = [];
    TelegramResponder.call(this,res,req); //must call at the end because process is called in parent constructor
  }

  lib.inherit(TrendingResponder, TelegramResponder);

  TrendingResponder.prototype.destroy = function(){
    this.defaultMessage = null;
    TelegramResponder.prototype.destroy.call(this);
  }

  TrendingResponder.prototype.googleTrendingFeedToJson = function(){
    var oi = this.onItem.bind(this), otf = this.onTrendsFetched.bind(this);
    Https.get('https://www.google.com/trends/hottrends/atom/feed', function (res) {
      var p = new FeedMe();
      p.on('item', oi);
      res.pipe(p);
      res.on('end', function () {
        p.removeAllListeners();
        oi = null;
        p = null;
        otf();
        otf = null;
      });
    });
  };

  TrendingResponder.prototype.onItem = function (item) {
    var processedItem = this.processItem(item);
    if (!!processedItem.url){
      this.items.push(processedItem);
    }
  };

  TrendingResponder.prototype.processItem = function (item) {
    return new InlineQueryResultArticle(item);
  };

  TrendingResponder.prototype.onTrendsFetched = function () {
    //console.log(require('util').inspect(this.items,{depth:7}));
    this.callMethod('answerInlineQuery',{
      inline_query_id : this.incomingRequest.id,
      results : JSON.stringify(this.items),
      cache_time: 60
    });
    /*
    var params = {
        inline_query_id : this.incomingRequest.id,
        results : JSON.stringify(this.items.slice(1,2))
      };
    console.log('params', params);
    lib.request('https://api.telegram.org/bot260656864:AAEERH7CqNskjOT1f1VbNT0PLJ61QEYoBTE/answerInlineQuery',{
      parameters: params,
      method: 'POST',
      onComplete: console.log.bind(console, 'answerInlineQuery says'),
      onError:  console.error.bind(console, 'answerInlineQuery fails')
    });
    */
  };

  TrendingResponder.prototype.processInlineQuery = function(){
    this.googleTrendingFeedToJson();
  };

  TrendingResponder.prototype.process = function(){
    //AI
    console.log('Hej hej?',this.incomingRequest.constructor.name);
    switch (this.incomingRequest.constructor.name){
      case 'Message':
        this.callMethod('sendMessage',new ReplyMessage({
          chat_id : this.incomingRequest.chat.id,
          text : this.defaultMessage,
          reply_to_message_id : this.incomingRequest.message_id
        }));
        break;
      case 'InlineQuery':
        this.processInlineQuery();
        break;
      case 'ChosenInlineResult':
        this.res.end('{}'); //what else?
        this.destroy();
    }
  };

  return TrendingResponder;

}

module.exports = createTrendingResponder;
