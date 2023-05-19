import { ConversationsData, ConversationsQueryVariables } from "@/util/types";
import { Box } from "@chakra-ui/react";

import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import CreateConversation from "./CreateConversation";
import CreateConversationModal from "./CreateConversationModal";
import ConversationsOperations from "../../../apollographql/operations/conversation";
import { useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

interface ConversationWrapperProps {
  session: Session;
}

export default function ConversationWrapper({
  session,
}: ConversationWrapperProps) {
  const router = useRouter();
  const {
    query: { conversationId },
  } = router;
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const {
    data: conversationsData,
    error: conversationError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, ConversationsQueryVariables>(
    ConversationsOperations.Queries.conversations,
    {
      variables: { session },
      onError: ({ message }) => {
        toast.error(message);
      },
    }
  );

  // Subscription which is responsible for show updates when new conversation is created
  function subscribeToNewConversations() {
    subscribeToMore({
      document: ConversationsOperations.Subscriptions.conversationCreated,
      variables: { session },
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationsData };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  }

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

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
      <div>
        {conversationsData?.conversations.map((c) => (
          <div key={c.id}>{c.id}</div>
        ))}
      </div>
    </Box>
  );
}
