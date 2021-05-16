const UserProfile = require('../mongo/models/user_profile')

function handle_request(msg, callback) {
  try {
    UserProfile.updateOne({ _id: msg.id }, msg, {new: true},function(err,result){
      UserProfile.findOne({_id:msg.id},function(err,result){
        var data = JSON.parse(JSON.stringify(result));
        delete data.password;
        callback(null,data)
      })
    });
  } catch (err) {
    console.log(err);
    callback(null, 'Internal Server Error.');
  }
};
exports.handle_request = handle_request;


