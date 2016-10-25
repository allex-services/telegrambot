function createInlineQuery(execlib){

  var User = require('./user.js')(execlib);

  function InlineQuery(jsonreq){
    this.update_id = jsonreq.update_id;
    this.id = jsonreq.inline_query.id;
    this.query = jsonreq.inline_query.query;
    this.offset = jsonreq.inline_query.offset;
    this.user = new User(jsonreq.inline_query.from);
  }
  InlineQuery.prototype.destroy = function(){
    this.user = null;
    this.offset = null;
    this.query = null;
    this.id = null;
    this.update_id = null;
  };

  return InlineQuery;
}

module.exports = createInlineQuery;
