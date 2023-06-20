// General Types
export interface EmojiProps {
  id: string;
  keywords: Array<string>;
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

// Username interfaces

import { Session } from "next-auth";

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
  session: Session | null;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchUsersVariables {
  username: string;
  session: Session;
}

// Conversations interfaces

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface SearchedUser {
  id: string;
  username: string;
  image: string;
}

export interface CreateConversationVariables {
  participantIds: Array<string>;
  session: Session;
}

export interface User {
  id: string;
  username: string;
  image: string;
  _typename: string;
}

export interface Participant {
  hasSeenLatestMessage: boolean;
  user: User;
  imageUrl: string;
  typename: string;
}

export interface Conversation {
  id: string;
  latestMessage: Message;
  participants: Array<Participant>;
  createdAt: Date;
  updatedAt: Date;
  _typename: string;
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    conversation: Conversation;
  };
}

export interface ConversationsData {
  conversations: Array<Conversation>;
}

export interface ConversationsQueryVariables {
  session: Session;
}

export interface MarkConversationAsReadVariables {
  userId: string;
  conversationId: string;
  session: Session;
}

export interface DeleteConversationVariables {
  conversationId: string;
  session: Session;
}

export interface LeaveConversationVariables {
  conversationId: string;
  session: Session;
}

export interface ConversationDeletedData {
  conversationDeleted: {
    id: string;
  };
}

// Message

export interface Message {
  body: string;
  conversationId: string;
  senderId: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
  id: string;
  sender: Sender;
}

export interface Sender {
  id: string;
  username: string;
  // imageUrl: string;
}

export interface SendMessageArgs {
  session: Session;
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface MessageData {
  messages: Array<Message>;
}

export interface MessagesVariables {
  conversationId: string;
  session: Session;
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: {
        body: string;
        createdAt: Date;
        id: string;
        sender: Sender;
        imageUrl: string;
        __typename: string;
      };
    };
  };
}
