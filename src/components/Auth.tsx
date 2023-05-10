import React from "react";
import { Session } from "next-auth";

interface AuthProps {
  session: Session;
}

export default function Auth({ session }: AuthProps) {
  return <div>Auth</div>;
}
