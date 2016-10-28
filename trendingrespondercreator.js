var FeedMe = require('feedme'),
  Https = require('https');

function createTrendingResponder (execlib){

  var lib = execlib.lib;

  var TelegramResponder = require('./telegramrespondercreator')(execlib);
  var lib = execlib.lib;
  var MessageTypes = require('./messageTypes/messagetypes.js')(execlib);
  var ReplyMessage = MessageTypes.ReplyMessage;
  var ReplyInlineQuery = MessageTypes.ReplyInlineQuery;
  var InlineQueryResultArticle = MessageTypes.InlineQueryResultArticle;
  var InlineKeyboardButton = MessageTypes.InlineKeyboardButton;
  var InlineKeyboardMarkup = MessageTypes.InlineKeyboardMarkup;
  var EmojiFlag = require('emoji-flag');
  var EmojiFlagToCountryCode = require('emoji-flag/to-country-code');

  var countryCodes = {
    'AR' : 1,
    'ar' : 1,
    'AU' : 2,
    'austra' : 2,
    'AT' : 3,
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
    'deu' : 14, 
    'GR' : 15,
    'gr' : 15,
    'he' : 15,
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

  var googleTrendsCountryCode = [
    {country: 'Global'},                     // 0. Global
    {country: 'Argentina', countryCode: 'AR'},               // 1. Argentina 
    {country: 'Australia', countryCode: 'AU'},               // 2. Australia
    {country: 'Austria', countryCode: 'AT'},                // 3. Austria
    {country: 'Belgium', countryCode: 'BE'},                 // 4. Belgium
    {country: 'Brazil', countryCode: 'BR'},                  // 5. Brazil
    {country: 'Canada', countryCode: 'CA'},                  // 6. Canada
    {country: 'Chile', countryCode: 'CL'},                   // 7. Chile
    {country: 'Colombia', countryCode: 'CO'},                // 8. Colombia
    {country: 'France', countryCode: 'FR'},                  // 9. France
    {country: 'Germany', countryCode: 'DE'},                 // 10. Germany
    {country: 'India', countryCode: 'IN'},                    // 11. India
    {country: 'Ireland', countryCode: 'IE'},                    // 12. Ireland
    {country: 'Italy', countryCode: 'IT'},                   // 13. Italy
    {country: 'Japan', countryCode: 'JP'},                    // 14. Japan
    {country: 'Malaysia', countryCode: 'MY'},                // 15. Malaysia
    {country: 'Mexico', countryCode: 'MX'},                  // 16. Mexico
    {country: 'Netherlands', countryCode: 'NL'},             // 17. Netherlands
    {country: 'New Zealand', countryCode: 'NZ'},             // 18. New Zealand 
    {country: 'Norway', countryCode: 'NO'},                  // 19. Norway
    {country: 'Peru', countryCode: 'PE'},                    // 20. Peru
    {country: 'Phillippines', countryCode: 'PH'},            // 21. Phillippines
    {country: 'Poland', countryCode: 'PL'},                  // 22. Poland
    {country: 'Portugal', countryCode: 'PT'},                // 23. Portugal
    {country: 'Russia', countryCode: 'RU'},                  // 24. Russia
    {country: 'Sweden', countryCode: 'SE'},                  // 25. Sweden
    {country: 'Switzerland', countryCode: 'CH'},             // 26. Switzerland
    {country: 'Turkey', countryCode: 'TR'},                  // 27. Turkey
    {country: 'United Kingdom', countryCode: 'GB'},           // 28. United Kingdom
    {country: 'United States', countryCode: 'US'},            // 29. United States
    {country: 'Vietnam', countryCode: 'VN'}                  // 30. Vietnam
  ];

  var googleTrendsCategories = [
    {name: 'All', shortcode: 'all'},
    {name: 'Business', shortcode: 'b'},
    {name: 'Entertainment', shortcode: 'e'},
    {name: 'Health', shortcode: 'm'},
    {name: 'Sci/Tech', shortcode: 't'},
    {name: 'Sports', shortcode: 's'},
    {name: 'Top Stories', shortcode: 'h'}
  ];

  var googleSearchesCountryCode = [
    {code : '', country: 'Global'},                     // 0. Global
    {code : 'p30', country: 'Argentina', countryCode: 'AR'},               // 1. Argentina 
    {code : 'p8',  country: 'Australia', countryCode: 'AU'},               // 2. Australia
    {code : 'p44',  country: 'Austria', countryCode: 'AT'},                // 3. Austria
    {code : 'p41', country: 'Belgium', countryCode: 'BE'},                 // 4. Belgium
    {code : 'p18', country: 'Brazil', countryCode: 'BR'},                  // 5. Brazil
    {code : 'p13', country: 'Canada', countryCode: 'CA'},                  // 6. Canada
    {code : 'p38', country: 'Chile', countryCode: 'CL'},                   // 7. Chile
    {code : 'p32', country: 'Colombia', countryCode: 'CO'},                // 8. Colombia
    {code : 'p43', country: 'Czech Republic', countryCode: 'CZ'},          // 9. Czech Republic
    {code : 'p49', country: 'Denmark', countryCode: 'DK'},                 // 10. Denmark
    {code : 'p29', country: 'Egypt', countryCode: 'EG'},                   // 11. Egypt
    {code : 'p50', country: 'Finland', countryCode: 'FI'},                 // 12. Finland
    {code : 'p16', country: 'France', countryCode: 'FR'},                  // 13. France
    {code : 'p15', country: 'Germany', countryCode: 'DE'},                 // 14. Germany
    {code : 'p48', country: 'Greece', countryCode: 'GR'},                  // 15. Greece
    {code : 'p10', country: 'Hong Kong', countryCode: 'HK'},               // 16. Hong Kong
    {code : 'p45', country: 'Hungary', countryCode: 'HU'},                 // 17. Hungary
    {code : 'p3', country: 'India', countryCode: 'IN'},                    // 18. India
    {code : 'p19', country: 'Indonesia', countryCode: 'ID'},               // 19. Indonesia
    {code : 'p6', country: 'Israel', countryCode: 'IL'},                   // 20. Israel
    {code : 'p27', country: 'Italy', countryCode: 'IT'},                   // 21. Italy
    {code : 'p4', country: 'Japan', countryCode: 'JP'},                    // 22. Japan
    {code : 'p37', country: 'Kenya', countryCode: 'KE'},                   // 23. Kenya
    {code : 'p34', country: 'Malaysia', countryCode: 'MY'},                // 24. Malaysia
    {code : 'p21', country: 'Mexico', countryCode: 'MX'},                  // 25. Mexico
    {code : 'p17', country: 'Netherlands', countryCode: 'NL'},             // 26. Netherlands
    {code : 'p52', country: 'Nigeria', countryCode: 'NG'},                 // 27. Nigeria
    {code : 'p51', country: 'Norway', countryCode: 'NO'},                  // 28. Norway
    {code : 'p25', country: 'Phillippines', countryCode: 'PH'},            // 29. Phillippines
    {code : 'p31', country: 'Poland', countryCode: 'PL'},                  // 30. Poland
    {code : 'p47', country: 'Portugal', countryCode: 'PT'},                // 31. Portugal
    {code : 'p39', country: 'Romania', countryCode: 'RO'},                 // 32. Romania
    {code : 'p14', country: 'Russia', countryCode: 'RU'},                  // 33. Russia
    {code : 'p36', country: 'Saudia Arabia', countryCode: 'SA'},           // 34. Saudia Arabia
    {code : 'p5', country: 'Singapore', countryCode: 'SG'},                // 35. Singapore
    {code : 'p40', country: 'South Africa', countryCode: 'ZA'},            // 36. South Africa
    {code : 'p26', country: 'Spain', countryCode: 'ES'},                   // 37. Spain
    {code : 'p42', country: 'Sweden', countryCode: 'SE'},                  // 38. Sweden
    {code : 'p46', country: 'Switzerland', countryCode: 'CH'},             // 39. Switzerland
    {code : 'p12', country: 'Taiwan', countryCode: 'TW'},                  // 40. Taiwan
    {code : 'p33', country: 'Thailand', countryCode: 'TH'},                // 41. Thailand
    {code : 'p24', country: 'Turkey', countryCode: 'TR'},                  // 42. Turkey
    {code : 'p35', country: 'Ukraine', countryCode: 'UA', disabled: true},                 // 43. Ukraine
    {code : 'p9', country: 'United Kingdom', countryCode: 'GB'},           // 44. United Kingdom
    {code : 'p1', country: 'United States', countryCode: 'US'},            // 45. United States
    {code : 'p28', country: 'Vietnam', countryCode: 'VN'}                  // 46. Vietnam
  ];

  var youtubeCountryCode = [
    {country: 'Global'},                     // 0. Global
    {country: 'Argentina', countryCode: 'AR'},               // 1. Argentina 
    {country: 'Australia', countryCode: 'AU'},               // 2. Australia
    {country: 'Brazil', countryCode: 'BR'},                  // 3. Brazil
    {country: 'Canada', countryCode: 'CA'},                  // 4. Canada
    {country: 'Egypt', countryCode: 'EG'},                   // 5. Egypt
    {country: 'France', countryCode: 'FR'},                  // 6. France
    {country: 'Germany', countryCode: 'DE'},                 // 7. Germany
    {country: 'Greece', countryCode: 'GR'},                  // 8. Greece
    {country: 'India', countryCode: 'IN'},                    // 9. India
    {country: 'Italy', countryCode: 'IT'},                   // 10. Italy
    {country: 'Japan', countryCode: 'JP'},                    // 11. Japan
    {country: 'Mexico', countryCode: 'MX'},                  // 12. Mexico
    {country: 'Morocco', countryCode: 'MA'},                  // 13. Morocoo
    {country: 'Netherlands', countryCode: 'NL'},             // 14. Netherlands
    {country: 'Phillippines', countryCode: 'PH'},            // 15. Phillippines
    {country: 'Poland', countryCode: 'PL'},                  // 16. Poland
    {country: 'Russia', countryCode: 'RU'},                  // 17. Russia
    {country: 'Saudia Arabia', countryCode: 'SA'},           // 18. Saudia Arabia
    {country: 'South Korea', countryCode: 'KR'},                  // 19. South Korea
    {country: 'Sweden', countryCode: 'SE'},                  // 20. Sweden
    {country: 'Taiwan', countryCode: 'TW'},                  // 21. Taiwan
    {country: 'Thailand', countryCode: 'TH'},                // 22. Thailand
    {country: 'Turkey', countryCode: 'TR'},                  // 23. Turkey
    {country: 'Ukraine', countryCode: 'UA'},                 // 24. Ukraine
    {country: 'United Kingdom', countryCode: 'GB'},           // 25. United Kingdom
    {country: 'United States', countryCode: 'US'},            // 26. United States
  ];

  var youtubeFilters = [
    {message: 'Safety filter: ON', value: 1},
    {message: 'Safety filter: OFF', value: 0}
  ];

  function getCountryObj(lcc){
    var curr = '', countryCode;
    for (var i=0; i<lcc.length; i++){
      curr += lcc[i];
      countryCode = countryCodes[curr];
      if (lib.isDefinedAndNotNull(countryCode)){
        return googleSearchesCountryCode[countryCode];
      }
    }
    return null;
  }

  function TrendingResponder(res, req){
    this.defaultMessage = 'Why don\'t you look for trending topics around the world?\n\nTry one of these:\n\n/inline\n/share\n/trends\n/searches\n/youtube\n/dailymotion\n/vimeo';
    this.startMessage = 'If you look for trending topics around the world you are at the perfect place.\n\nYou can control me by sending these commands:\n\n/inline\n/share\n/trends\n/searches\n/youtube\n/dailymotion\n/vimeo';
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
    //console.log('---- UBIO SAM SE ----');
  }

  TrendingResponder.prototype.createSupportedCountriesMessage = function(){
    var ret = 'Currently supported countries:\n\n';
    for (var i=1; i<googleSearchesCountryCode.length; i++){
      if (!googleSearchesCountryCode[i].disabled){
        ret += EmojiFlag(googleSearchesCountryCode[i].countryCode) + ' ' + googleSearchesCountryCode[i].country + '\n\n';
      }
    }
    return ret;
  };

  TrendingResponder.prototype.createSupportedCountriesInlineKeyboard = function(dataprefix){
    var ikm = new InlineKeyboardMarkup(15);
    for (var i=1; i<googleSearchesCountryCode.length; i++){
      if (!googleSearchesCountryCode[i].disabled){
        ikm.addButton(new InlineKeyboardButton({
          text: EmojiFlag(googleSearchesCountryCode[i].countryCode) + ' ' + googleSearchesCountryCode[i].country,
          callback_data: dataprefix + '|' + googleSearchesCountryCode[i].country
          //switch_inline_query: googleSearchesCountryCode[i].country
        }));
      }
    }
    return ikm.telegramType();
  };

  TrendingResponder.prototype.createSupportedTrendsCountriesInlineKeyboard = function(dataprefix){
    var ikm = new InlineKeyboardMarkup(10);
    for (var i=1; i<googleTrendsCountryCode.length; i++){
      if (!googleTrendsCountryCode[i].disabled){
        ikm.addButton(new InlineKeyboardButton({
          text: EmojiFlag(googleTrendsCountryCode[i].countryCode) + ' ' + googleTrendsCountryCode[i].country,
          callback_data: dataprefix + '|' + googleTrendsCountryCode[i].countryCode
          //switch_inline_query: googleSearchesCountryCode[i].country
        }));
      }
    }
    return ikm.telegramType();
  };

  TrendingResponder.prototype.createSupportedYoutubeCountriesInlineKeyboard = function(dataprefix){
    var ikm = new InlineKeyboardMarkup(13);
    for (var i=1; i<youtubeCountryCode.length; i++){
      if (!youtubeCountryCode[i].disabled){
        ikm.addButton(new InlineKeyboardButton({
          text: EmojiFlag(youtubeCountryCode[i].countryCode) + ' ' + youtubeCountryCode[i].country,
          callback_data: dataprefix + '|' + youtubeCountryCode[i].countryCode
          //switch_inline_query: googleSearchesCountryCode[i].country
        }));
      }
    }
    return ikm.telegramType();
  };

  TrendingResponder.prototype.createSelectedCountryInlineKeyboard = function(country){
    var ikm = new InlineKeyboardMarkup(1);
    ikm.addButton(new InlineKeyboardButton({
      text: 'Share trending topics in ' + country + ' with friends',
      switch_inline_query: country
    }));
    return ikm.telegramType();
  };

  TrendingResponder.prototype.createGoInline = function(param){
    var ikm = new InlineKeyboardMarkup(1);
    ikm.addButton(new InlineKeyboardButton({
      text: 'Go Inline!',
      switch_inline_query_current_chat: param
    }));
    return ikm.telegramType();
  };

  TrendingResponder.prototype.createTopicsInlineKeyboard = function(){
    var ikm = new InlineKeyboardMarkup(this.items.length);
    for (var i=0; i<this.items.length; i++){
      ikm.addButton(new InlineKeyboardButton({
        text: this.items[i].title,
        url:this.items[i].url 
      }));
    }
    return ikm.telegramType();
  };

  TrendingResponder.prototype.createTrendsCategoriesInlineKeyboard = function(countryCode){
    var ikm = new InlineKeyboardMarkup(googleTrendsCategories.length);
    for (var i=0; i<googleTrendsCategories.length; i++){
      ikm.addButton(new InlineKeyboardButton({
        text: googleTrendsCategories[i].name,
        url: 'https://www.google.com/trends/home/'+googleTrendsCategories[i].shortcode+'/'+countryCode
      }));
    }
    return ikm.telegramType();
  };

  TrendingResponder.prototype.createYoutubeFiltersInlineKeyboard = function(countryCode){
    var ikm = new InlineKeyboardMarkup(youtubeFilters.length);
    for (var i=0; i<youtubeFilters.length; i++){
      ikm.addButton(new InlineKeyboardButton({
        text: youtubeFilters[i].message,
        url: 'https://www.google.com/trends/hotvideos#geo='+countryCode+'&hvsm='+youtubeFilters[i].value
      }));
    }
    return ikm.telegramType();
  };

  TrendingResponder.prototype.googleTrendingFeedToJson = function(countryObj,otf){
    var code = (!countryObj ? null : countryObj.code);
    var country = (!countryObj ? 'Global' : countryObj.country);
    var oi = this.onItem.bind(this,country), otf = otf || this.onTrendsFetched.bind(this);
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

  TrendingResponder.prototype.onItem = function (country,item) {
    var processedItem = this.processItem(item,country);
    if (!!processedItem.url){
      this.items.push(processedItem);
    }
  };

  TrendingResponder.prototype.processItem = function (item,country) {
    return new InlineQueryResultArticle(item,null,true,country);
  };

  TrendingResponder.prototype.requestFinisher = function(res){
    console.log('OPERATION DONE',res);
    this.destroy();
  };

  TrendingResponder.prototype.onTrendsFetched = function () {
    //console.log('DA GA VIDIMO STA SALJEMO',require('util').inspect(this.items,{depth:5}));
    this.callMethod('answerInlineQuery',new ReplyInlineQuery({
      inline_query_id : this.incomingRequest.id,
      results : JSON.stringify(this.items),
      cache_time: 60,
      switch_pm_text: 'Check all supported countries',
      switch_pm_parameter: 'supported'
    }));
    /*
    var params = {
      inline_query_id : this.incomingRequest.id,
      results : JSON.stringify(this.items),
      cache_time: 0
    };
    console.log('params', params);
    lib.request('https://api.telegram.org/bot260656864:AAEERH7CqNskjOT1f1VbNT0PLJ61QEYoBTE/answerInlineQuery',{
      parameters: params,
      method: 'POST',
      onComplete: this.requestFinisher.bind(this),
      onError:  console.error.bind(console, 'answerInlineQuery fails')
    });
    */
  };

  TrendingResponder.prototype.onRegularTrendsFetched = function(country){
    this.sendMessage('Check out trending topics for ' + country+ ':\n\n',this.incomingRequest.message.chat.id,false,this.createTopicsInlineKeyboard());
  };

  TrendingResponder.prototype.sendMessage = function(text,chat_id,replyFlag,replyMarkup,silently){
    var prophash = {
      chat_id : chat_id,
      text : text
    };
    if (!!replyFlag){
      prophash.reply_to_message_id = this.incomingRequest.message_id;
    }
    if (!!replyMarkup){
      prophash.reply_markup = replyMarkup;
    }
    if (!!silently){
      prophash.disable_notification = silently;
    }
    this.callMethod('sendMessage',new ReplyMessage(prophash));
    /*
    var params = new ReplyMessage(prophash);
    lib.request('https://api.telegram.org/bot260656864:AAEERH7CqNskjOT1f1VbNT0PLJ61QEYoBTE/sendMessage',{
      parameters: params,
      method: 'POST',
      onComplete: this.requestFinisher.bind(this),
      onError:  console.error.bind(console, 'sendMessage fails')
    });
    */
  };

  TrendingResponder.prototype.commandRecieved = function(commandName){
    var command = null;
    for (var i=0; i<this.incomingRequest.commands.length; i++){
      if (this.incomingRequest.commands[i].name === commandName){
        command = this.incomingRequest.commands[i];
        break;
      }
    }
    return command;
  };

  TrendingResponder.prototype.hashtagRecieved = function(hashtagName){
    return this.incomingRequest.hashtags.indexOf(hashtagName) !== -1;
  };

  TrendingResponder.prototype.start = function(param1){
    switch (param1){
      case 'supported':
        this.sendMessage('Hello ' + this.incomingRequest.user.first_name + '!\n\n' + 'Currently supported countries:\n\n',this.incomingRequest.chat.id,false,this.createSupportedCountriesInlineKeyboard('INLINE_SUPPORTED'));
        return;
      default:
        this.sendMessage('Hello ' + this.incomingRequest.user.first_name + '!\n\n' + this.startMessage,this.incomingRequest.chat.id,false);
        return;
    }
  };

  TrendingResponder.prototype.sendInline = function(param1){
    param1 = param1 || null;
    this.sendMessage('Click the button to switch to Inline mode\n',this.incomingRequest.chat.id,false,this.createGoInline(param1));
  };

  TrendingResponder.prototype.sendShare = function(){
    this.sendMessage('Choose a country:\n\n',this.incomingRequest.chat.id,false,this.createSupportedCountriesInlineKeyboard('INLINE_SUPPORTED'));
  };

  TrendingResponder.prototype.sendSearches = function(){
    this.sendMessage('Choose a country:\n\n',this.incomingRequest.chat.id,false,this.createSupportedCountriesInlineKeyboard('REGULAR_SUPPORTED'));
  };

  TrendingResponder.prototype.sendTrends = function(){
    this.sendMessage('Choose a country:\n\n',this.incomingRequest.chat.id,false,this.createSupportedTrendsCountriesInlineKeyboard('REGULAR_TRENDS_SUPPORTED'));
  };

  TrendingResponder.prototype.sendYoutube = function(){
    this.sendMessage('Choose a country:\n\n',this.incomingRequest.chat.id,false,this.createSupportedYoutubeCountriesInlineKeyboard('REGULAR_YOUTUBE_SUPPORTED'));
  };

  TrendingResponder.prototype.processMessage = function(){
    // . commands first
    var command = this.commandRecieved('/start');
    if (!!command){
      this.start.apply(this, command.params);
      return;
    }
    command = this.commandRecieved('/inline');
    if (!!command){
      this.sendInline.apply(this, command.params);
      return;
    }
    command = this.commandRecieved('/share');
    if (!!command){
      this.sendShare.apply(this, command.params);
      return;
    }
    command = this.commandRecieved('/trends');
    if (!!command){
      this.sendTrends.apply(this, command.params);
      return;
    }
    command = this.commandRecieved('/searches');
    if (!!command){
      this.sendSearches.apply(this, command.params);
      return;
    }
    command = this.commandRecieved('/youtube');
    if (!!command){
      this.sendYoutube.apply(this, command.params);
      return;
    }
    if (this.commandRecieved('/dailymotion')){
      this.sendMessage(this.dailymotionTrendsURL,this.incomingRequest.chat.id,false);
      return;
    }
    if (this.commandRecieved('/vimeo')){
      this.sendMessage(this.vimeoTrendsURL,this.incomingRequest.chat.id,false);
      return;
    }
    this.sendMessage(this.defaultMessage,this.incomingRequest.chat.id,false);
  };

  TrendingResponder.prototype.processInlineQuery = function(){
    var countryObj;
    var emojiCountryCode = EmojiFlagToCountryCode(this.incomingRequest.query);
    if (!!emojiCountryCode){
      countryObj = getCountryObj(emojiCountryCode);
    }else{
      countryObj = getCountryObj(this.incomingRequest.query.toLowerCase());
    }
    this.googleTrendingFeedToJson(countryObj);
  };

  TrendingResponder.prototype.processCallbackQuery = function(){
    var bundle = this.incomingRequest.data.split('|');
    var command = bundle[0];
    var data = bundle[1];
    switch (command){
      case 'INLINE_SUPPORTED':
        this.sendMessage('Trends from ' + data + ' chosen\n\n',this.incomingRequest.message.chat.id,false,this.createSelectedCountryInlineKeyboard(data),true);
        return;
      case 'REGULAR_SUPPORTED':
        this.googleTrendingFeedToJson(getCountryObj(data.toLowerCase()),this.onRegularTrendsFetched.bind(this,data));
        return;
      case 'REGULAR_TRENDS_SUPPORTED':
        this.sendMessage('Pick category:\n\n',this.incomingRequest.message.chat.id,false,this.createTrendsCategoriesInlineKeyboard(data),true);
        return;
      case 'REGULAR_YOUTUBE_SUPPORTED':
        this.sendMessage('Choose safety filter:\n\n',this.incomingRequest.message.chat.id,false,this.createYoutubeFiltersInlineKeyboard(data),true);
        return;
      default:
        this.sendMessage(this.defaultMessage,this.incomingRequest.message.chat.id,false,true);
        return;
    }
  };

  TrendingResponder.prototype.process = function(){
    // . AI
    //console.log('Hej hej?',require('util').inspect(this.incomingRequest,{depth:5}));
    switch (this.incomingRequest.constructor.name){
      case 'Message':
        this.processMessage();
        break;
      case 'InlineQuery':
        this.processInlineQuery();
        break;
      case 'CallbackQuery':
        this.processCallbackQuery();
        break;
      case 'ChosenInlineResult':
        this.res.end('{}'); // . what else?
        this.destroy();
    }
  };

  return TrendingResponder;

}

module.exports = createTrendingResponder;
