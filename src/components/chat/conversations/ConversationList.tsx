import { Conversation } from "@/util/types";
import { Session } from "next-auth";
import React from "react";

interface ConversationListProps {
  session: Session;
  conversations: Conversation[];
}

export default function ConversationList({
  session,
  conversations,
}: ConversationListProps) {
  console.log(conversations);
  return <div>ConversationList</div>;
}
