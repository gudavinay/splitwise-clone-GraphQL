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

export {
  signupMutation,
};
