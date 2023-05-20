import React from "react";
import { Session } from "next-auth";
import { Flex } from "@chakra-ui/react";
import ConversationWrapper from "./conversations/ConversationWrapper";
import FeedWrapper from "./messages/FeedWrapper";

interface ChatProps {
  session: Session;
}

export default function Chat({ session }: ChatProps) {
  return (
    <Flex height="100vh">
      <ConversationWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  );
}
