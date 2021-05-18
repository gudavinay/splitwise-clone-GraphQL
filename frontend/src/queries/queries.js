import { gql } from 'apollo-boost';

const loginQuery = gql`
query($email: String,$password: String) {
  login(email:$email,password:$password){
    _id
    name
    email
    name
    profilePicture
    phone
    currency
    timezone
    language
    error
  }
}
`;

const fetchGroupsQuery = gql`
query($user_id: String) {
  fetchGroups(user_id:$user_id)
}
`;

export {
  loginQuery,
  fetchGroupsQuery,
};
