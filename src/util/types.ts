// Username interfaces

import { ISODateString, Session } from "next-auth";

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

export interface SearchedUser {
  id: string;
  username: string;
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

export interface CreateConversationVariables {
  participantIds: Array<string>;
  session: Session;
}

interface User {
  id: string;
  username: string;
  _typename: string;
}

export interface Participant {
  hasSeenLatestMessage: boolean;
  user: User;
  typename: string;
}

export interface Conversation {
  id: string;
  latestMessage: Message;
  participants: Array<Participant>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationsData {
  conversations: Array<Conversation>;
}

export interface ConversationsQueryVariables {
  session: Session;
}

export interface Message {
  body: string;
  conversationId: string;
  senderId: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  sender: Sender;
}

export interface Sender {
  id: string;
  username: string;
}
