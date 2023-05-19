import { gql } from "@apollo/client";

const ConversationFields = `
  id
  participants {
    user {
      id
      username
    }
    hasSeenLatestMessage
  }
  latestMessage {
    id
    sender {
      id
      username
    }
    body
    createdAt
  }
  updatedAt
`;

export default {
  Queries: {
    conversations: gql`
      query Conversations($session: Session) {
        conversations(session: $session) {
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation(
        $participantIds: [String]!
        $session: Session!
      ) {
        createConversation(participantIds: $participantIds, session: $session) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
        subscription ConversationCreated($session: Session!) {
          conversationCreated(session: $session) {
            ${ConversationFields}
          }
        }
      `,
  },
};
