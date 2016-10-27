function createCallbackQuery(execlib){

  var User = require('./user.js')(execlib);
  var Message = require('./message.js')(execlib);

  function CallbackQuery(jsonreq){
    this.update_id = jsonreq.update_id;
    this.id = jsonreq.callback_query.id;
    this.from = new User(jsonreq.callback_query.from);
    if (!!jsonreq.callback_query.message) this.message = new Message({update_id:this.update_id, message: jsonreq.callback_query.message});
    if (!!jsonreq.callback_query.inline_message_id) this.inline_message_id = jsonreq.callback_query.inline_message_id;
    if (!!jsonreq.callback_query.chat_instance) this.chat_instance = jsonreq.callback_query.chat_instance;
    if (!!jsonreq.callback_query.data) this.data = jsonreq.callback_query.data;
    if (!!jsonreq.callback_query.game_short_name) this.game_short_name = jsonreq.callback_query.game_short_name;
  }

  CallbackQuery.prototype.destroy = function(){
    this.id = null;
    this.from = null;
    if (!!this.message) this.message = null;
    if (!!this.inline_message_id) this.inline_message_id = null;
    if (!!this.chat_instance) this.chat_instance = null;
    if (!!this.data) this.data = null;
    if (!!this.game_short_name) this.game_short_name = null;
  };

  return CallbackQuery;
}

module.exports = createCallbackQuery;
