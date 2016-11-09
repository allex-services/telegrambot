function createInProcessRequest(execlib){

  var lib = execlib.lib;

  function InProcessRequest(prophash){
    this.inprocess_request = prophash.inprocess_request;
  }
  InProcessRequest.prototype.destroy = function(){
    this.inprocess_request = null;
  };
  return InProcessRequest;
}

module.exports = createInProcessRequest;
