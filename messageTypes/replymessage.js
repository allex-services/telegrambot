function createMessage(execlib){

  var lib = execlib.lib;

  function Message(prophash){
    this.chat_id = prophash.chat_id;
    this.text = prophash.text;
    if (!!prophash.parse_mode) this.parse_mode = prophash.parse_mode;
    if (!!prophash.disable_web_page_preview) this.disable_web_page_preview = prophash.disable_web_page_preview;
    if (!!prophash.disable_notification) this.disable_notification = prophash.disable_notification;
    if (!!prophash.reply_to_message_id) this.reply_to_message_id = prophash.reply_to_message_id;
    if (!!prophash.reply_markup) this.reply_markup = prophash.reply_markup;
  }
  Message.prototype.destroy = function(){
    if (!!this.reply_markup) this.reply_markup = null;
    if (!!this.reply_to_message_id) this.reply_to_message_id = null;
    if (!!this.disable_notification) this.disable_notification = null;
    if (!!this.disable_web_page_preview) this.disable_web_page_preview = null;
    if (!!this.parse_mode) this.parse_mode = null;
    this.text = null;
    this.chat_id = null;
  };
  return Message;
}

module.exports = createMessage;
