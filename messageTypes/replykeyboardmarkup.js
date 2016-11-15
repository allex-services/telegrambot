function createKeyboardMarkup(execlib){

  var lib = execlib.lib;

  function KeyboardMarkup(rowcount,resize_keyboard,one_time_keyboard,selective){
    this.activerow = 0;
    this.rowcount = rowcount;
    this.rows = [];
    for (var i=0; i<rowcount; i++){
      this.rows.push([]);
    }
    if (!!resize_keyboard){
      this.resize_keyboard = resize_keyboard;
    }
    if (!!one_time_keyboard){
      this.one_time_keyboard = one_time_keyboard;
    }
    if (!!selective){
      this.selective = selective;
    }
  }

  KeyboardMarkup.prototype.destroy = function(){
    if (!!this.selective){
      this.selective = null;
    }
    if (!!this.one_time_keyboard){
      this.one_time_keyboard = null;
    }
    if (!!this.resize_keyboard){
      this.resize_keyboard = null;
    }
    this.rows = null;
    this.rowcount = null;
    this.activerow = null;
  };

  KeyboardMarkup.prototype.addButton = function(button){
    this.rows[this.activerow].push(button);
    this.activerow = (this.activerow + 1) % this.rowcount;
  };

  KeyboardMarkup.prototype.telegramType = function(){
    return JSON.stringify({keyboard: this.rows, resize_keyboard: this.resize_keyboard, one_time_keyboard: this.one_time_keyboard, selective: this.selective});
  };

  return KeyboardMarkup;
}

module.exports = createKeyboardMarkup;
