function createInlineKeyboardButton(execlib){

  var lib = execlib.lib;

  function InlineKeyboardButton(prophash){
    this.text = prophash.text;
    if (!!prophash.url) this.url = prophash.url;
    if (!!prophash.callback_data) this.callback_data = prophash.callback_data;
    if (!!prophash.switch_inline_query) this.switch_inline_query = prophash.switch_inline_query;
    if (!!prophash.switch_inline_query_current_chat) this.switch_inline_query_current_chat = prophash.switch_inline_query_current_chat;
    if (prophash.switch_inline_query_current_chat === null) this.switch_inline_query_current_chat = '';
    if (!!prophash.callback_game) this.callback_game = prophash.callback_game;
  }
  InlineKeyboardButton.prototype.destroy = function(){
    if (!!this.callback_game) this.callback_game = null;
    if (!!this.switch_inline_query_current_chat) this.switch_inline_query_current_chat = null;
    if (!!this.switch_inline_query) this.switch_inline_query = null;
    if (!!this.callback_data) this.callback_data = null;
    if (!!this.url) this.url = null;
    this.text = null;
  };
  return InlineKeyboardButton;
}

module.exports = createInlineKeyboardButton;
