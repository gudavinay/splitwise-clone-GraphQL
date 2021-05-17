import { gql } from 'apollo-boost';

const loginQuery = gql`
query{
  login(email:"user1@test.com",password:"password")
}
`;

export {
  loginQuery,
};
