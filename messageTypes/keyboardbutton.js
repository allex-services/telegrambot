function createKeyboardButton(execlib){

  var lib = execlib.lib;

  function KeyboardButton(prophash){
    this.text = prophash.text;
    if (!!prophash.request_contact) this.request_contact = prophash.request_contact;
    if (!!prophash.request_location) this.request_location = prophash.request_location;
  }
  KeyboardButton.prototype.destroy = function(){
    if (!!this.request_location) this.request_location = null;
    if (!!this.request_contact) this.request_contact = null;
    this.text = null;
  };
  return KeyboardButton;
}

module.exports = createKeyboardButton;
