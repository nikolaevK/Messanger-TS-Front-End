import { gql } from "@apollo/client";
export default {
  Queries: {
    // searchUsers: gql`
    //   query searchUsers($username: String!) {
    //     searchUsers(username: $username) {
    //       id
    //       username
    //     }
    //   }
    // `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!, $session: Session) {
        createUsername(username: $username, session: $session) {
          success
          error
        }
      }
    `,
  },
};
