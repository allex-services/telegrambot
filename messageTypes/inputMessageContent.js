function createInputMessageContent(execlib){

  var lib = execlib.lib;

  function InputMessageContent(mtext,parse_mode,dwpp){
    this.message_text = mtext;
    if (!!parse_mode) this.parse_mode = parse_mode;
    if (!!dwpp) this.disable_web_page_preview = dwpp;
  }
  InputMessageContent.prototype.destroy = function(){
    if (!!this.dwpp) this.dwpp = null;
    if (!!this.parse_mode) this.parse_mode = null;
    this.message_text = null;
  };
  return InputMessageContent;
}

module.exports = createInputMessageContent;
