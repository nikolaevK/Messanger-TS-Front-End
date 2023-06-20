import { Conversation, LeaveConversationVariables } from "@/util/types";
import { Box, Button } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import CreateConversation from "./CreateConversation";
import CreateConversationModal from "./CreateConversationModal";
import ConversationItem from "./Conversation";
import { useRouter } from "next/router";
import ConversationsOperations from "../../../apollographql/operations/conversation";
import { useMutation } from "@apollo/client";
import { DeleteConversationVariables } from "../../../util/types";
import toast from "react-hot-toast";

interface ConversationListProps {
  session: Session;
  conversations: Conversation[];
  onViewConversation: (
    conversationId: string,
    hasSeenLatesMessage: boolean
  ) => void;
}

export default function ConversationList({
  session,
  conversations,
  onViewConversation,
}: ConversationListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const router = useRouter();

  const {
    user: { id: userId },
  } = session;

  // Delete conversation mutation
  const [deleteConversation] = useMutation<
    { deletedConversation: boolean },
    DeleteConversationVariables
  >(ConversationsOperations.Mutations.deleteConversation);

  // leave conversation mutation
  const [leaveConversation] = useMutation<
    { leaveConversation: boolean },
    LeaveConversationVariables
  >(ConversationsOperations.Mutations.leaveConversation);

  async function onDeleteConversation(conversationId: string) {
    try {
      // toast will display according status of mutation
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
            session,
          },
          update: () => {
            // redirects to the home page when conversation is deleted
            router.replace(
              typeof process.env.NEXT_PUBLIC_URL === "string"
                ? process.env.NEXT_PUBLIC_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting",
          success: "Conversation deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error: any) {
      console.log("onDeleteConversation error: " + error);
    }
  }

  async function onLeaveConversation(conversationId: string) {
    try {
      // toast will display according status of mutation
      toast.promise(
        leaveConversation({
          variables: {
            conversationId,
            session,
          },
          update: () => {
            // redirects to the home page when conversation is deleted
            router.replace(
              typeof process.env.NEXT_PUBLIC_URL === "string"
                ? process.env.NEXT_PUBLIC_URL
                : ""
            );
          },
        }),
        {
          loading: "Leaving conversation",
          success: "You left the conversation",
          error: "Failed to leave conversation",
        }
      );
    } catch (error: any) {
      console.log("onLeaveConversation error: " + error);
    }
  }

  // sorting conversations by most recent
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <Box width="100%" position="relative" height="100%" overflow="hidden">
      <CreateConversation isOpen={isOpen} setIsOpen={setIsOpen} />
      <CreateConversationModal
        session={session}
        onClose={onClose}
        isOpen={isOpen}
      />
      {sortedConversations.map((conversation) => {
        // Find current user to see if conversation was read
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );
        return (
          <ConversationItem
            session={session}
            conversation={conversation}
            isSelected={conversation.id === router.query.conversationId}
            onDeleteConversation={onDeleteConversation}
            onLeaveConversation={onLeaveConversation}
            key={conversation.id}
            hasSeenLatestMessage={participant?.hasSeenLatestMessage!}
            userId={userId}
            onClick={() =>
              onViewConversation(
                conversation.id,
                participant?.hasSeenLatestMessage!
              )
            }
          />
        );
      })}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        width="100%"
        px={8}
        py={6}
        onClick={() => signOut()}
      >
        <Button width="100%">Logout</Button>
      </Box>
    </Box>
  );
}
