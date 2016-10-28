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
    this.commands = [];
    this.hashtags = [];
    this.processEntities(jsonreq.message.entities); 
    //console.log('STA SI',require('util').inspect(jsonreq.message.entities,{depth:5}));
  }

  Message.prototype.destroy = function(){
    this.hashtags = null;
    for (var i=0; i<this.commands.length; i++){
      this.commands[i].destroy();
    }
    this.commands = null;
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
        this.commands.push(new Command(this.text,entity.offset,entity.length));
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

  function Command(text,offset,length){
    this.name = text.substring(offset,offset+length);
    this.params = this.extractParams(text,offset,length);
  }

  Command.prototype.destroy = function(){
    this.params = null;
    this.name = null;
  };

  Command.prototype.addDelimited = function(ret,delimiter,elem){
    ret.push.apply(ret,elem.split(delimiter));
  };

  Command.prototype.delimit = function(array,delimiter){
    var ret = [];
    array.forEach(this.addDelimited.bind(this,ret,delimiter));
    return ret;
  };

  Command.prototype.extractParams = function(text,offset,length){
    var ret = [];
    var spaceDelimited = text.split(' ');
    var delimited = this.delimit(spaceDelimited,'\n');
    var commandPosition = delimited.indexOf(this.name);
    if (commandPosition === -1) return ret;
    for (var i=commandPosition; i<delimited.length; i++){
      if (delimited[i][0] !== '/'){
        ret.push(delimited[i]);
      }else if(delimited[i] !== this.name){
        break;
      }
    }
    return ret;
  };

  return Message;
}

module.exports = createMessage;
