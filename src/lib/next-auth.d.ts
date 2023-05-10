import "next-auth";

// Extends the type Session from next-auth
// Adds username and id which initially are not on the session
declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    username: string;
  }
}
