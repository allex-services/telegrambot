function createInlineQueryResultArticle(execlib){

  var lib = execlib.lib;
  var InputMessageContent = require('./inputMessageContent.js')(execlib);

  function InlineQueryResultArticle(item){
    this.type = 'article';
    this.id = item.id;//Date.now(); //my id or given?
    this.title = item.title;
    this.input_message_content = new InputMessageContent(item.input_message_content,'HTML');
    if (!!item.url) this.url = item.url;
    if (!!item.reply_markup) this.reply_markup = item.reply_markup;
    if (!!item.hide_url) this.hide_url = item.hide_url;
    if (!!item.description) this.description = item.description;
    if (!!item.thumb_url) this.thumb_url = item.thumb_url;
    if (!!item.thumb_width) this.thumb_width = item.thumb_width;
    if (!!item.thumb_height) this.thumb_height = item.thumb_height;
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
