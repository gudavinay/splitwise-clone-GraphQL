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

const fetchUsersQuery = gql`
query{
  fetchUsers{
    name
    email
    _id
  }
}`;


const getAllExpensesQuery = gql`
query($group_id: String) {
  getAllExpenses(group_id:$group_id){
    group_id
    description
    paid_by
    amount
    created_date
    updated_date
    paid_to_users{
      paid_to
      amount
      settled
      _id
    }
  }
}`;


const getAllIndividualExpensesQuery = gql`
query($group_id: String) {
  getAllIndividualExpensesQuery(group_id:$group_id){
    group_id
    description
    paid_by
    amount
    created_date
    updated_date
    paid_to_users{
      paid_to
      amount
      settled
      _id
    }
  }
}`;


export {
  loginQuery,
  fetchGroupsQuery,
  fetchUsersQuery,
  getAllExpensesQuery,
  getAllIndividualExpensesQuery,
};
