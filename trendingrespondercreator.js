var FeedMe = require('feedme'),
  Https = require('https');

function createTrendingResponder (execlib){

  var lib = execlib.lib;

  var TelegramResponder = require('./telegramrespondercreator')(execlib);
  var lib = execlib.lib;
  var MessageTypes = require('./messageTypes/messagetypes.js')(execlib);
  var ReplyMessage = MessageTypes.ReplyMessage;
  var InlineQueryResultArticle = MessageTypes.InlineQueryResultArticle;
  var EmojiFlagToCountryCode = require('emoji-flag/to-country-code');

  var countryCodes = {
    'AR' : 1,
    'ar' : 1,
    'AT' : 2,
    'austra' : 2,
    'AU' : 3,
    'austri' : 3,
    'BE' : 4,
    'be' : 4,
    'BR' : 5,
    'br' : 5,
    'CA' : 6,
    'ca' : 6,
    'CL' : 7,
    'ch' : 7,
    'CO' : 8,
    'co' : 8,
    'CZ' : 9,
    'cz' : 9,
    'DK' : 10,
    'den' : 10,
    'EG' : 11,
    'eg' : 11,
    'FI' : 12,
    'fi' : 12,
    'FR' : 13,
    'fr' : 13,
    'DE' : 14,
    'ge' : 14, //TODO deutchland, hellas etc...
    'GR' : 15,
    'gr' : 15,
    'HK' : 16,
    'ho' : 16,
    'HU' : 17,
    'hu' : 17,
    'IN' : 18,
    'indi' : 18,
    'ID' : 19,
    'indo' : 19,
    'IL' : 20,
    'is' : 20,
    'IT' : 21,
    'it' : 21,
    'JP' : 22,
    'j' : 22,
    'KE' : 23,
    'ke' : 23,
    'MY' : 24,
    'ma' : 24,
    'MX' : 25,
    'me' : 25,
    'NL' : 26,
    'ne' : 26,
    'NG' : 27,
    'ni' : 27,
    'NO' : 28,
    'no' : 28,
    'PH' : 29,
    'ph' : 29,
    'PL' : 30,
    'pol' : 30,
    'PT' : 31,
    'por' : 31,
    'RO' : 32,
    'ro' : 32,
    'RU' : 33,
    'ru' : 33,
    'SA' : 34,
    'sa' : 34,
    'SG' : 35,
    'si' : 35,
    'ZA' : 36,
    'so' : 36,
    'ES' : 37,
    'es' : 37,
    'sp' : 37,
    'SE' : 38,
    'swe' : 38,
    'CH' : 39,
    'swi' : 39,
    'TW' : 40,
    'ta' : 40,
    'TH' : 41,
    'th' : 41,
    'TR' : 42,
    'tu' : 42,
    //'' : 43,
    //'ukr' : 43, removed for now because of UK (united kingdom)
    'GB' : 44,
    'united k' : 44,
    'uk' : 44,
    'gb' : 44,
    'en' : 44,
    'wa' : 44,
    'sc' : 44,
    'ir' : 44,
    'US' : 45,
    'united s' : 45,
    'us' : 45,
    'usa' : 45,
    'am' : 45,
    'VN' : 46,
    'vi' : 46
  };

  var googleTrendsCountryCodes = [
    '',     // 0. Global
    'p30', // 1. Argentina 
    'p8',  // 2. Australia
    'p44', // 3. Austria
    'p41', // 4. Belgium
    'p18', // 5. Brazil
    'p13', // 6. Canada
    'p38', // 7. Chile
    'p32', // 8. Colombia
    'p43', // 9. Czech Republic
    'p49', // 10. Denmark
    'p29', // 11. Egypt
    'p50', // 12. Finland
    'p16', // 13. France
    'p15', // 14. Germany
    'p48', // 15. Greece
    'p10', // 16. Hong Kong
    'p45', // 17. Hungary
    'p3',  // 18. India
    'p19', // 19. Indonesia
    'p6',  // 20. Israel
    'p27', // 21. Italy
    'p4',  // 22. Japan
    'p37', // 23. Kenya
    'p34', // 24. Malaysia
    'p21', // 25. Mexico
    'p17', // 26. Netherlands
    'p52', // 27. Nigeria
    'p51', // 28. Norway
    'p25', // 29. Phillippines
    'p31', // 30. Poland
    'p47', // 31. Portugal
    'p39', // 32. Romania
    'p14', // 33. Russia
    'p36', // 34. Saudia Arabia
    'p5',  // 35. Singapore
    'p40', // 36. South Africa
    'p26', // 37. Spain
    'p42', // 38. Sweden
    'p46', // 39. Switzerland
    'p12', // 40. Taiwan
    'p33', // 41. Thailand
    'p24', // 42. Turkey
    'p35', // 43. Ukraine
    'p9',  // 44. United Kingdom
    'p1',  // 45. United States
    'p28'  // 46. Vietnam
  ];

  function getCountryCode(lcc){
    var curr = '', countryCode;
    for (var i=0; i<lcc.length; i++){
      curr += lcc[i];
      countryCode = countryCodes[curr];
      if (lib.isDefinedAndNotNull(countryCode)){
        return googleTrendsCountryCodes[countryCode];
      }
    }
    return null;
  }

  function TrendingResponder(res, req){
    this.defaultMessage = 'Why don\'t you look for trending topics around the world?\n\nTry:\n\n/trends\n/searches\n/youtube\n/dailymotion\n/vimeo';
    this.startMessage = 'If you look for trending topics around the world you are at the perfect place.\n\nYou can control me by sending these commands:\n\n/trends\n/searches\n/youtube\n/dailymotion\n/vimeo';
    this.googleTrendsFeedURL = 'https://www.google.com/trends/hottrends/atom/feed';
    this.googleTrendsURL = 'https://www.google.com/trends/';
    this.googleTrendingSearchesURL = 'https:// . www.google.com/trends/hottrends';
    this.youtubeTrendsURL = 'https://www.google.com/trends/hotvideos';
    this.dailymotionTrendsURL = 'http://www.dailymotion.com/en/trending/1';
    this.vimeoTrendsURL = 'https://vimeo.com/';
    this.items = [];
    TelegramResponder.call(this,res,req); // . must call at the end because process is called in parent constructor
  }

  lib.inherit(TrendingResponder, TelegramResponder);

  TrendingResponder.prototype.destroy = function(){
    this.defaultMessage = null;
    this.startMessage = null;
    this.googleTrendsFeedURL = null;
    this.googleTrendsURL = null;
    this.googleTrendingSearchesURL = null;
    this.youtubeTrendsURL = null;
    this.dailymotionTrendsURL = null;
    this.vimeoTrendsURL = null;
    this.items = null;
    TelegramResponder.prototype.destroy.call(this);
  }

  TrendingResponder.prototype.googleTrendingFeedToJson = function(code){
    var oi = this.onItem.bind(this), otf = this.onTrendsFetched.bind(this);
    var requestUrl = this.googleTrendsFeedURL + (!code ? '' : '?pn=' + code);
    Https.get(requestUrl, function (res) {
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
    return new InlineQueryResultArticle(item,null,true);
  };

  TrendingResponder.prototype.onTrendsFetched = function () {
    // . console.log(require('util').inspect(this.items,{depth:7}));
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

  TrendingResponder.prototype.sendMessage = function(text,replyFlag){
    var prophash = {
      chat_id : this.incomingRequest.chat.id,
      text : text
    };
    if (!!replyFlag){
      prophash.reply_to_message_id = this.incomingRequest.message_id;
    }
    this.callMethod('sendMessage',new ReplyMessage(prophash));
  };

  TrendingResponder.prototype.commandRecieved = function(commandName){
    return this.incomingRequest.commands.indexOf(commandName) !== -1;
  }

  TrendingResponder.prototype.hashtagRecieved = function(hashtagName){
    return this.incomingRequest.hashtags.indexOf(hashtagName) !== -1;
  }

  TrendingResponder.prototype.processMessage = function(){
    // . commands first
    if (this.commandRecieved('/start')){
      this.sendMessage('Hello ' + this.incomingRequest.user.first_name + '!\n' + this.startMessage,false);
      return;
    }
    if (this.commandRecieved('/trends')){
      this.sendMessage(this.googleTrendsURL,false);
      return;
    }
    if (this.commandRecieved('/searches')){
      this.sendMessage(this.googleTrendingSearchesURL,false);
      return;
    }
    if (this.commandRecieved('/youtube')){
      this.sendMessage(this.youtubeTrendsURL,false);
      return;
    }
    if (this.commandRecieved('/dailymotion')){
      this.sendMessage(this.dailymotionTrendsURL,false);
      return;
    }
    if (this.commandRecieved('/vimeo')){
      this.sendMessage(this.vimeoTrendsURL,false);
      return;
    }
    this.sendMessage(this.defaultMessage,false);
  };

  TrendingResponder.prototype.processInlineQuery = function(){
    var code;
    var emojiCountryCode = EmojiFlagToCountryCode(this.incomingRequest.query);
    if (!!emojiCountryCode){
      code = getCountryCode(emojiCountryCode);
    }else{
      code = getCountryCode(this.incomingRequest.query.toLowerCase());
    }
    this.googleTrendingFeedToJson(code);
  };

  TrendingResponder.prototype.process = function(){
    // . AI
    console.log('Hej hej?',this.incomingRequest);
    switch (this.incomingRequest.constructor.name){
      case 'Message':
        this.processMessage();
        break;
      case 'InlineQuery':
        this.processInlineQuery();
        break;
      case 'ChosenInlineResult':
        this.res.end('{}'); // . what else?
        this.destroy();
    }
  };

  return TrendingResponder;

}

module.exports = createTrendingResponder;
