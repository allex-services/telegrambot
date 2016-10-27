function createInlineKeyboardMarkup(execlib){

  var lib = execlib.lib;

  function InlineKeyboardMarkup(rowcount){
    this.activerow = 0;
    this.rowcount = rowcount;
    this.rows = [];
    for (var i=0; i<rowcount; i++){
      this.rows.push([]);
    }
  }

  InlineKeyboardMarkup.prototype.destroy = function(){
    this.rows = null;
    this.rowcount = null;
    this.activerow = null;
  };

  InlineKeyboardMarkup.prototype.addButton = function(button){
    this.rows[this.activerow].push(button);
    this.activerow = (this.activerow + 1) % this.rowcount;
  };

  InlineKeyboardMarkup.prototype.telegramType = function(){
    return JSON.stringify({inline_keyboard: this.rows});
  };

  return InlineKeyboardMarkup;
}

module.exports = createInlineKeyboardMarkup;
