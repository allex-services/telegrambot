function createChosenInlineResult(execlib){

  var User = require('./user.js')(execlib);

  function ChosenInlineResult(jsonreq){
    this.update_id = jsonreq.update_id;
    this.result_id = jsonreq.chosen_inline_result.result_id;
    this.from = new User(jsonreq.chosen_inline_result.from);
    this.query = jsonreq.chosen_inline_result.query;
  }
  ChosenInlineResult.prototype.destroy = function(){
    this.from = null;
    this.query = null;
    this.result_id = null;
    this.update_id = null;
  };

  return ChosenInlineResult;
}

module.exports = createChosenInlineResult;
