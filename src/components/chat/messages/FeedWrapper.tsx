import { Session } from "next-auth";
import React from "react";

interface FeedWrapperProps {
  session: Session;
}

export default function FeedWrapper({ session }: FeedWrapperProps) {
  return <div>FeedWrapper</div>;
}
