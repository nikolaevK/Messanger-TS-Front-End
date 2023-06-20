import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
  id
  participants {
    user {
      id
      username
      image
    }
    hasSeenLatestMessage
  }
  latestMessage {
    ${MessageFields}
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
        $participantIds: [String]
        $session: Session!
      ) {
        createConversation(participantIds: $participantIds, session: $session) {
          conversationId
        }
      }
    `,
    markConversationAsRead: gql`
      mutation MarkConversationAsRead(
        $userId: String!
        $conversationId: String!
        $session: Session!
      ) {
        markConversationAsRead(
          userId: $userId
          conversationId: $conversationId
          session: $session
        )
      }
    `,
    leaveConversation: gql`
      mutation LeaveConversation($conversationId: String!, $session: Session!) {
        leaveConversation(conversationId: $conversationId, session: $session)
      }
    `,
    deleteConversation: gql`
      mutation DeleteConversation(
        $conversationId: String!
        $session: Session!
      ) {
        deleteConversation(conversationId: $conversationId, session: $session)
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
    conversationUpdated: gql`
      subscription ConversationUpdated($session: Session!) {
        conversationUpdated(session: $session) {
          conversation {
            ${ConversationFields}
          }
        }
      }
    `,
    conversationDeleted: gql`
      subscription ConversationDeleted($session: Session!) {
        conversationDeleted(session: $session) {
          id
        }
      }
    `,
  },
};
