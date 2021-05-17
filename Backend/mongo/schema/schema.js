const graphql = require('graphql');
const UserProfile = require('../models/user_profile');
// const { getUserProfile } = require('../query/getUserProfile');


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
  }),
});


const GroupGQL = new GraphQLObjectType({
  name: "group",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    profile_picture_url: { type: GraphQLString },
    user: new GraphQLList(UserStatusGQL),
  }),
});

const UserStatusGQL = new GraphQLObjectType({
  name: "userstatus",
  fields: () => ({
    _id: { type: GraphQLID },
    user_id: { type: GraphQLString },
    isAccepted: { type: GraphQLString },
  }),
});

const ExpensesGQL = new GraphQLObjectType({
  name: "expenses",
  fields: () => ({
    _id: { type: GraphQLID },
    group_id: { type: GraphQLString },
    description: { type: GraphQLString },
    paid_by: { type: GraphQLString },
    amount: { type: GraphQLString },
    created_date: { type: GraphQLString },
    updated_date: { type: GraphQLString },
    paid_to_users: new GraphQLList(PaidToUsersGQL),
  }),
});


const PaidToUsersGQL = new GraphQLObjectType({
  name: "paidtousers",
  fields: () => ({
    _id: { type: GraphQLID },
    paid_to: { type: GraphQLString },
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
      async resolve(parent, args) {
        return new Promise(async (resolve, reject) => {
          UserProfile.findOne({ email: args.email.toUpperCase() }, function (err, result) {
            if (err) {
              reject(err);
            }
            if (result && result['password'] && passwordHash.verify(args.password, result['password'])) {
              const token = jwt.sign({ _id: result._id }, config.secret, {
                expiresIn: 1008000
              })
              var data = JSON.parse(JSON.stringify(result));
              delete data.password;
              data.token = token;
              res = data;
            } else {
              res = "Unsuccessful Login";
            }
            resolve(res);
          });
        });
      },
    },
  },
});
// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//   },
// });

const schema = new GraphQLSchema({
  query: RootQuery,
  // mutation: Mutation,
});

module.exports = schema;
