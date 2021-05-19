const graphql = require('graphql');
const UserProfile = require('../models/user_profile');
const Group = require('../models/group');
const Expenses = require('../models/expenses');
// const { getUserProfile } = require('../query/getUserProfile');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const config = require('../../mongo/config')


const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = graphql;

const UserProfileGQL = new GraphQLObjectType({
  name: "userprofile",
  fields: () => ({
    _id: { type: GraphQLID },
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    profilePicture: { type: GraphQLString },
    phone: { type: GraphQLString },
    currency: { type: GraphQLString },
    timezone: { type: GraphQLString },
    language: { type: GraphQLString },
    error: { type: GraphQLString },
  }),
});


const GroupGQL = new GraphQLObjectType({
  name: "group",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    profile_picture_url: { type: GraphQLString },
    user: { type: new GraphQLList(UserStatusGQL) },
    error: { type: GraphQLString },
  }),
});


const UserStatusGQL = new GraphQLObjectType({
  name: "userstatus",
  fields: () => ({
    _id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    isAccepted: { type: GraphQLString },
  }),
});

const ExpensesGQL = new GraphQLObjectType({
  name: "expenses",
  fields: () => ({
    _id: { type: GraphQLID },
    group_id: { type: GraphQLID },
    description: { type: GraphQLString },
    paid_by: { type: GraphQLString },
    amount: { type: GraphQLString },
    created_date: { type: GraphQLString },
    updated_date: { type: GraphQLString },
    paid_to_users: { type: new GraphQLList(PaidToUsersGQL), }
  }),
});


const PaidToUsersGQL = new GraphQLObjectType({
  name: "paidtousers",
  fields: () => ({
    _id: { type: GraphQLID },
    paid_to: { type: GraphQLID },
    amount: { type: GraphQLString },
    settled: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root Query',
  fields: {




    getUserProfile: {
      // query{
      //   getUserProfile(_id:"6081f55943ceef78bb6549db"){
      //     email
      //   }
      // }
      type: UserProfileGQL,
      args: { _id: { type: GraphQLID } },
      resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          UserProfile.findOne({ _id: args._id }).then(result => {
            resolve(result);
          }).catch(err => {
            console.log(err);
            reject(err);
          })
        });
      },
    },




    login: {
      type: UserProfileGQL,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          UserProfile.findOne({ email: args.email.toUpperCase() }, function (err, result) {
            let res = {};
            if (err) {
              resolve(err);
            }
            if (result && result['password'] && passwordHash.verify(args.password, result['password'])) {
              res = result;
            } else {
              res.error = "Unsuccessful Login";
            }
            resolve(res);
          });
        });
      },
    },


    fetchUsers: {
      type: new GraphQLList(UserProfileGQL),
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          UserProfile.find({}, function (err, result) {
            if (err) {
              resolve();
            }
            resolve(JSON.parse(JSON.stringify(result).toLocaleLowerCase()));
          });
        });
      },
    },



    fetchGroups: {
      type: GraphQLString,
      args: {
        user_id: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Group.find({ "user.user_id": args.user_id }, function (err, result) {
            if (err) {
              resolve();
            }
            var data = [];
            result.forEach(res => {
              let obj = { name: res.name, group_id: res._id };
              res.user.forEach(user => {
                if (args.user_id == user.user_id) {
                  obj['isAccepted'] = user.isAccepted;
                }
              });
              data.push(obj);
            });
            resolve(JSON.stringify(data))
          });
        });
      },
    },



    getAllExpenses: {
      type: new GraphQLList(ExpensesGQL),
      args: {
        group_id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Expenses.find({ group_id: args.group_id })
            .populate('group_id', ["name"])
            .populate('paid_by', ["name"])
            .populate('notes.created_by', ["name"])
            .lean()
            .then((result) => {
              let data = [];
              result.forEach(exp => {
                let obj = {
                  _id: exp._id,
                  created_date: exp.created_date,
                  updated_date: exp.updated_date,
                  group_id: exp.group_id._id,
                  description: exp.description,
                  paid_by: exp.paid_by._id,
                  name: exp.paid_by.name,
                  paid_by_name: exp.paid_by.name,
                  amount: exp.amount,
                  notes: exp.notes
                }
                data.push(obj);
              });
              resolve(data.reverse());
            });
        });
      },
    },



    getAllIndividualExpenses: {
      type: new GraphQLList(ExpensesGQL),
      args: {
        group_id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          Expenses.find({ group_id: args.group_id })
            .populate('group_id', ["name"])
            .populate('paid_by', ["name"])
            .populate('paid_to_users.paid_to', ["name"])
            .lean()
            .then((result) => {
              let data = [];
              result.forEach(exp => {
                exp.paid_to_users.forEach(paid_to_user => {
                  if (paid_to_user.settled == 'N') {
                    let obj = {
                      created_date: exp.created_date,
                      updated_date: exp.updated_date,
                      group_id: exp.group_id._id,
                      description: exp.description,
                      paid_by: exp.paid_by._id,
                      paid_by_name: exp.paid_by.name,
                    }
                    obj.paid_to = paid_to_user.paid_to._id;
                    obj.paid_to_name = paid_to_user.paid_to.name;
                    obj.name = paid_to_user.paid_to.name;
                    obj.amount = paid_to_user.amount;
                    obj.settled = paid_to_user.settled;
                    data.push(obj);
                  }
                });
              });
              resolve(data);
            });
        });
      },
    },
  },
});



const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {



    signup: {
      type: UserProfileGQL,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          const data = {
            email: args.email.toUpperCase(),
            name: args.name,
            password: passwordHash.generate(args.password)
          };
          const up = new UserProfile(data);
          up.save(function (err, result) {
            let res = {};
            if (err && err.message.includes("duplicate key")) {
              res.error = "ER_DUP_ENTRY"
            } else {
              res = result;
            }
            resolve(res);
          });
        });
      },
    },



    newGroup: {
      type: GraphQLString,
      args: {
        email: { type: GraphQLString },
        groupName: { type: GraphQLString },
        user_rec_id: { type: GraphQLString },
        userIDArray: { type: GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          // resolve(JSON.stringify(args))
          var users = [];
          args.userIDArray.forEach(user => {
            const userData = {
              user_id: user,
              isAccepted: user == args.user_rec_id ? 1 : 0
            };
            users.push(userData);
          });
          const data = {
            name: args.groupName,
            admin_email: args.email,
            user: users
          };
          const group = new Group(data);
          group.save(function (err, result) {
            let res = null;
            if (err && err.message.includes("duplicate key")) {
              res = "ER_DUP_ENTRY"
            } else {
              res = result;
            }
            resolve(JSON.stringify(res));
          });
        });
      },
    },



    addExpense: {
      type: GraphQLString,
      args: {
        description: { type: GraphQLString },
        amount: { type: GraphQLString },
        group_id: { type: GraphQLString },
        paid_by: { type: GraphQLString },
      },
      resolve(parent, args) {
        return new Promise((resolve, reject) => {
          let users = [];
          Group.find({ _id: args.group_id }, async function (err, result) {
            result[0]['user'].forEach(user => {
              if (user.isAccepted == 1 && user.user_id != args.paid_by) {
                users.push(user.user_id);
              }
            });
            var splitAmount = (parseFloat(args.amount) / (users.length + 1)).toFixed(2);
            var unevenSplit = (parseFloat(args.amount) - (users.length) * splitAmount).toFixed(2);
            let paid_to_users = [];
            users.forEach((user, index) => {
              paid_to_users.push({
                paid_to: user,
                amount: index == result.length - 1 ? unevenSplit : splitAmount,
                settled: 'N'
              })
            });
            let data = {
              group_id: args.group_id,
              description: args.description,
              paid_by: args.paid_by,
              paid_to_users: paid_to_users,
              amount: parseFloat(args.amount)
            }
            const expenses = new Expenses(data);
            expenses.save(function (err, result) {
              console.log("RESPONSE FOR ADD EXPENSE", result);
            });
            resolve(null, JSON.stringify(err ? err : result));
          });
        });
      },
    },

    updateUserProfile: {
      type: UserProfileGQL,
      args: {
        userDetails: { type: UserProfileGQL },
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          UserProfile.updateOne({ _id: args.id }, args, { new: true }, function (err, result) {
            UserProfile.findOne({ _id: args.id }, function (err, result) {
              resolve(data)
            })
          });
        });
      },
    },


    settleUp: {
      type: GraphQLString,
      args: {
        paid_by: { type: GraphQLString },
        paid_to: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          Expenses.find()
            .or([{ "paid_to_users.paid_to": args.paid_to, "paid_by": args.paid_by },
            { "paid_to_users.paid_to": args.paid_by, "paid_by": args.paid_to }])
            .lean()
            .then((result) => {
              result.forEach(exp => {
                let countOfSettled = 0;
                exp.paid_to_users.forEach(paid_to_user => {
                  if ((args.paid_to == paid_to_user.paid_to && args.paid_by == exp.paid_by) || (args.paid_by == paid_to_user.paid_to && args.paid_to == exp.paid_by)) {
                    paid_to_user.settled = 'Y';
                  }
                });
                exp.paid_to_users.forEach(paid_to_user => {
                  if (paid_to_user.settled == 'N') {
                    countOfSettled++;
                  }
                });
                if (countOfSettled == 1) {
                  exp.paid_to_users.forEach(paid_to_user => {
                    paid_to_user.settled = 'Y';
                  });
                }
                const updatedArray = exp.paid_to_users;
                const updateDocument = {
                  $set: { "paid_to_users": updatedArray, "updated_date": new Date() }
                };
                Expenses.updateOne({ _id: exp._id }, updateDocument, function (err, result) {
                  resolve(JSON.stringify(result));
                })
              });
              resolve(JSON.stringify(result));
            });
        });
      },
    },


    acceptInvite: {
      type: GraphQLString,
      args: {
        user_id: { type: GraphQLString },
        group_id: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return new Promise((resolve, reject) => {
          Group.find({ _id: args.group_id }, function (err, result) {
            result[0]['user'].forEach(user => {
              if (user.user_id == args.user_id) {
                user.isAccepted = args.isAccepted;
              }
            });
            Group.where({ _id: args.group_id }).updateOne({ user: result[0]['user'] }, function (err, result) {
              resolve(JSON.stringify(err ? err : result));
            });
          })
        });
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
