function createMessage(execlib){

  var Chat = require('./chat.js')(execlib);
  var User = require('./user.js')(execlib);

  function Message(jsonreq){
    this.update_id = jsonreq.update_id;
    this.message_id = jsonreq.message.message_id;
    this.date = jsonreq.message.date;
    this.text = jsonreq.message.text;
    this.chat = new Chat(jsonreq.message.chat);
    this.user = new User(jsonreq.message.from);
  }
  Message.prototype.destroy = function(){
    this.user = null;
    this.chat = null;
    this.text = null;
    this.date = null;
    this.message_id = null;
    this.update_id = null;
  };

  return Message;
}

module.exports = createMessage;
