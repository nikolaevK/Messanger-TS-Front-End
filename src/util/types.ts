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

export interface MarkConversationAsReadVariables {
  userId: string;
  conversationId: string;
  session: Session;
}

// Message

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
