import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import CreateConversation from "./CreateConversation";
import CreateConversationModal from "./CreateConversationModal";

interface ConversationWrapperProps {
  session: Session;
}

export default function ConversationWrapper({
  session,
}: ConversationWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <Box
      //   display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      display="flex"
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.200"
      flexDirection="column"
      gap={4}
      py={6}
      px={3}
    >
      <CreateConversation isOpen={isOpen} setIsOpen={setIsOpen} />
      <CreateConversationModal
        session={session}
        onClose={onClose}
        isOpen={isOpen}
      />
    </Box>
  );
}
