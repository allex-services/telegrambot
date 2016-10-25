function createChat(execlib){

  function Chat(chatobj){
    this.id = chatobj.id;
    this.first_name = chatobj.first_name;
    this.last_name = chatobj.last_name;
    this.username = chatobj.username;
    this.private = chatobj.private;
  }
  Chat.prototype.destroy = function(){
    this.private = null;
    this.username = null;
    this.last_name = null;
    this.first_name = null;
    this.id = null;
  };

  return Chat;
}

module.exports = createChat;
