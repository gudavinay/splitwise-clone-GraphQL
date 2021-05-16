const UserProfile = require('../mongo/models/user_profile')

function handle_request(msg, callback) {
  console.log("inside fetchUsers 2");
  try {
    UserProfile.find({}, function (err, result) {
      if(err){
        console.log(err);
        callback(null, 'Internal Server Error........');
      }
      console.log(result, err);
      callback(null, err ? err : JSON.parse(JSON.stringify(result).toLocaleLowerCase()));
      // callback(null,"");
    });
      // callback(null,"ALL SUCCESS");
  } catch (err) {
    console.log(err);
    callback(null, 'Internal Server Error........');
  }
};
exports.handle_request = handle_request;


