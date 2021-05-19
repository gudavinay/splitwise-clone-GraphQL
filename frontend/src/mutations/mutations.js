import { gql } from 'apollo-boost';

const signupMutation = gql`
  mutation signup($name: String, $email: String, $password: String) {
    signup(name: $name, email: $email, password: $password){
      _id
      email
      name
      password
      profilePicture
      phone
      currency
      timezone
      language
      error
    }
  }
`;


const newGroupMutation = gql`
  mutation newGroup($email: String, $groupName: String, $user_rec_id: String,$userIDArray:[String] ) {
    newGroup(email:$email
    groupName:$groupName
    userIDArray:$userIDArray
    user_rec_id:$user_rec_id
    )
  }
`;


const acceptInviteMutation = gql`
  mutation acceptInvite($group_id: String, $user_id: String) {
    acceptInvite(group_id:$group_id
      user_id:$user_id
    )
  }
`;


const addExpenseMutation = gql`
  mutation addExpense($description: String, $amount: String, $group_id: String,$paid_by:String ) {
    addExpense(description:$description
      amount:$amount
      group_id:$group_id
      paid_by:$paid_by
    )
  }
`;


const settleUpMutation = gql`
  mutation settleUp($paid_to: String, $paid_by: String) {
    settleUp(paid_to:$paid_to
      paid_by:$paid_by
    )
  }
`;

const updateUserProfileMutation = gql`
  mutation updateUserProfile($userDetails: userInput) {
    updateUserProfile(
      userDetails: $userDetails) {
      _id
      email
      name
      password
      profilePicture
      phone
      currency
      timezone
      language
      error
    }
}
`;



export {
  signupMutation,
  newGroupMutation,
  addExpenseMutation,
  acceptInviteMutation,
  settleUpMutation,
  updateUserProfileMutation
};
