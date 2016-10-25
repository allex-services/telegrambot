function createInlineQuery(execlib){

  var lib = execlib.lib;

  function InlineQuery(prophash){
    this.inline_query_id = prophash.inline_query_id;
    this.results = prophash.results;
    if (!!prophash.cache_time) this.cache_time = prophash.cache_time;
    if (!!prophash.is_personal) this.is_personal = prophash.is_personal;
    if (!!prophash.next_offset) this.next_offset = prophash.next_offset;
    if (!!prophash.switch_pm_text) this.switch_pm_text = prophash.switch_pm_text;
    if (!!prophash.switch_pm_parameter) this.switch_pm_parameter = prophash.switch_pm_parameter;
  }
  InlineQuery.prototype.destroy = function(){
    if (!!this.switch_pm_parameter) this.switch_pm_parameter = null;
    if (!!this.switch_pm_text) this.switch_pm_text = null;
    if (!!this.next_offset) this.next_offset = null;
    if (!!this.is_personal) this.is_personal = null;
    if (!!this.cache_time) this.cache_time = null;
    this.results = null;
    this.inline_query_id = null;
  };
  return InlineQuery;
}

module.exports = createInlineQuery;
