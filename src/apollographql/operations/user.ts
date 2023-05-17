import { gql } from "@apollo/client";
export default {
  Queries: {
    searchUsers: gql`
      query searchUsers($username: String!, $session: Session) {
        searchUsers(username: $username, session: $session) {
          id
          username
        }
      }
    `,
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
