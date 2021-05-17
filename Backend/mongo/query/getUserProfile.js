const user_profile = require("../models/user_profile");

exports.getUserProfile = async args => {
    return new Promise(async (resolve, reject) => {
       await user_profile.findOne({_id:"6081f55943ceef78bb6549db"}).then(result=>{
          console.log(result);
      resolve(result);
      }).catch(err=>{
          console.log(err);
          reject(err);
      })
    });
  };