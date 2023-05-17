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

// export interface SessionFromTheFrontEnd {
//   session: {
//     user: {
//       name: string;
//       email: string;
//       image: string;
//       id: string;
//       username: string | null;
//       emailVerified: boolean | null;
//     };
//     expires: ISODateString;
//   };
// }
