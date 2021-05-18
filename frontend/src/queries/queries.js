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

export {
  loginQuery,
};
