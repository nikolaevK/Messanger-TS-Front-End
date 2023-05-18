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
