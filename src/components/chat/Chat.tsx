import React, { useEffect, useState } from "react";
import { Session } from "next-auth";
import { Flex } from "@chakra-ui/react";
import ConversationWrapper from "./conversations/ConversationWrapper";
import FeedWrapper from "./messages/FeedWrapper";

interface ChatProps {
  session: Session;
}

export default function Chat({ session }: ChatProps) {
  const [screenSize, setScreenSize] = useState<number>();

  useEffect(() => {
    // Getting height to calculate how many loaderComponents needed
    // Depends on users screen
    setScreenSize(window.innerHeight);
  }, [screenSize]);

  return (
    <Flex height="100vh">
      <ConversationWrapper session={session} screenSize={screenSize!} />
      <FeedWrapper session={session} />
    </Flex>
  );
}
