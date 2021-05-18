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



export {
  signupMutation,
  newGroupMutation
};
