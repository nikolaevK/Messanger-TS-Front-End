import React from "react";
import { Session } from "next-auth";
import { Flex } from "@chakra-ui/react";

interface ChatProps {
  session: Session | null;
}

export default function Chat({ session }: ChatProps) {
  return <Flex height="100vh">Chat</Flex>;
}
