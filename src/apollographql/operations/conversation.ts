import { gql } from "@apollo/client";

export default {
  Mutations: {
    createConversation: gql`
      mutation CreateConversation(
        $participantIds: [String]!
        $session: Session
      ) {
        createConversation(participantIds: $participantIds, session: $session) {
          conversationId
        }
      }
    `,
  },
};
