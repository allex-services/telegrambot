function createUser(execlib){

  function User(userobj){
    this.id = userobj.id;
    this.first_name = userobj.first_name;
    this.last_name = userobj.last_name;
    this.username = userobj.username;
  }
  User.prototype.destroy = function(){
    this.username = null;
    this.last_name = null;
    this.first_name = null;
    this.id = null;
  };

  return User;
}

module.exports = createUser;
