function createInlineQueryResultArticle(execlib){

  var lib = execlib.lib;
  var InputMessageContent = require('./inputMessageContent.js')(execlib);
  var map = {
    "gt":">", "lt":"<", "apos":"'", "amp":"&", "quot":"\"", "nbsp":"  ",
  };

  function InlineQueryResultArticle(item,reply_markup,hide_url,thumb_width,thumb_height){
    this.type = 'article';
    this.id = lib.uid();//Date.now(); //my id or given?
    this.title = item.title;
    if (!!reply_markup) this.reply_markup = reply_markup;
    if (!!hide_url) this.hide_url = hide_url;
    if (!!item['ht:news_item'] && !!item['ht:news_item'][0]){
      if (!!item['ht:news_item'][0]['ht:news_item_url']) this.url = item['ht:news_item'][0]['ht:news_item_url'];
      if (!!item['ht:news_item'][0]['ht:news_item_title']) this.description = item['ht:approx_traffic'] + '\n' + this.removeHTMLTags(item['ht:news_item'][0]['ht:news_item_title']);
      if (!!item['ht:news_item'][0]['ht:news_item_snippet']) this.input_message_content = new InputMessageContent(item['ht:news_item'][0]['ht:news_item_snippet'] + '\n' + this.url || '' ,'HTML');
    }
    if (!!item['ht:picture']) this.thumb_url = 'https:'+item['ht:picture'];
    if (!!thumb_width) this.thumb_width = thumb_width;
    if (!!thumb_height) this.thumb_height = thumb_height;
    //input_message_content is required so i must check it
    if (!this.input_message_content) this.input_message_content = new InputMessageContent(item.title + '\n' + (this.url || ''),'HTML');
  }

  InlineQueryResultArticle.prototype.destroy = function(){
    this.type = null;
    this.id = null; //my id or given?
    this.title = null;
    this.input_message_content = null;
    if (!!this.reply_markup) this.reply_markup = null;
    if (!!this.url) this.url = null;
    if (!!this.hide_url) this.hide_url = null;
    if (!!this.description) this.description = null;
    if (!!this.thumb_url) this.thumb_url = null;
    if (!!this.thumb_width) this.thumb_width = null;
    if (!!this.thumb_height) this.thumb_height = null;
  };

  InlineQueryResultArticle.prototype.HTMLAsciiToPlain = function(text){
    return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
    //return text.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(n); });
  };

  InlineQueryResultArticle.prototype.removeHTMLTags = function(htmlText){
    var ret = this.HTMLAsciiToPlain(htmlText.replace(/<(?:.|\n)*?>/gm, ''));
    return ret; 
  };

  return InlineQueryResultArticle;
}

module.exports = createInlineQueryResultArticle;
