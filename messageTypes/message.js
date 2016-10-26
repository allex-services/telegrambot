function createMessage(execlib){

  var Chat = require('./chat.js')(execlib);
  var User = require('./user.js')(execlib);

  function Message(jsonreq){
    //TODO consolelog za entities...
    this.update_id = jsonreq.update_id;
    this.message_id = jsonreq.message.message_id;
    this.date = jsonreq.message.date;
    this.text = jsonreq.message.text;
    this.chat = new Chat(jsonreq.message.chat);
    this.user = new User(jsonreq.message.from);
    this.commands = [];
    this.hashtags = [];
    this.processEntities(jsonreq.message.entities); 
    console.log('STA SI',require('util').inspect(jsonreq.message.entities,{depth:5}));
    console.log('this.commands??',require('util').inspect(this.commands,{depth:5}));
    console.log('this.hashtags??',require('util').inspect(this.hashtags,{depth:5}));
  }

  Message.prototype.destroy = function(){
    this.user = null;
    this.chat = null;
    this.text = null;
    this.date = null;
    this.message_id = null;
    this.update_id = null;
  };

  Message.prototype.fillEntityArray = function(entity){
    switch (entity.type){
      case 'bot_command':
        this.commands.push(this.text.substring(entity.offset,entity.offset+entity.length));
        break;
      case 'hashtag':
        this.hashtags.push(this.text.substring(entity.offset,entity.offset+entity.length));
        break;
    }
  };

  Message.prototype.processEntities = function(entities){
    if (!entities) return;
    entities.forEach(this.fillEntityArray.bind(this));
  };

  return Message;
}

module.exports = createMessage;
