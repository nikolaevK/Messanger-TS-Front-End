import { gql } from "@apollo/client";
import { GraphQLInputObjectType, GraphQLString } from "graphql";

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
