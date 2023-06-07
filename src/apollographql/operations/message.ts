import { gql } from "@apollo/client";

export const MessageFields = `
    id
    sender {
        id
        username
    }
    body
    createdAt
`;

export default {
  Query: {
    messages: gql`
      query Messages($conversationId: String!, $session: Session!) {
        messages(conversationId: $conversationId, session: $session){
          ${MessageFields}
        }
      }
    `,
  },
  Mutation: {
    sendMessage: gql`
      mutation SendMessage(
        $id: String!
        $conversationId: String!
        $session: Session!
        $senderId: String!
        $body: String!
      ) {
        sendMessage(
          id: $id
          conversationId: $conversationId
          session: $session
          senderId: $senderId
          body: $body
        )
      }
    `,
  },
};
