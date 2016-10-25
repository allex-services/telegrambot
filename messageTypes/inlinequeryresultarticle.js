function createInlineQueryResultArticle(execlib){

  var lib = execlib.lib;
  var InputMessageContent = require('./inputMessageContent.js')(execlib);

  function InlineQueryResultArticle(item,reply_markup,hide_url,thumb_width,thumb_height){
    this.type = 'article';
    this.id = lib.uid();//Date.now(); //my id or given?
    this.title = item.title;
    if (!!reply_markup) this.reply_markup = reply_markup;
    if (!!hide_url) this.hide_url = hide_url;
    if (!!item['ht:news_item'] && !!item['ht:news_item'][0]){
      if (!!item['ht:news_item'][0]['ht:news_item_url']) this.url = item['ht:news_item'][0]['ht:news_item_url'];
      if (!!item['ht:news_item'][0]['ht:news_item_title']) this.input_message_content = new InputMessageContent(item['ht:news_item'][0]['ht:news_item_title'] + '\n' + this.url,'HTML');
      if (!!item['ht:news_item'][0]['ht:news_item_snippet']) this.description = item['ht:news_item'][0]['ht:news_item_snippet'];
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
  return InlineQueryResultArticle;
}

module.exports = createInlineQueryResultArticle;
