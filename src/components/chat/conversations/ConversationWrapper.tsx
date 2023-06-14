import {
  Conversation,
  ConversationsData,
  ConversationsQueryVariables,
  ConversationUpdatedData,
  MarkConversationAsReadVariables,
  Participant,
} from "@/util/types";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import ConversationsOperations from "../../../apollographql/operations/conversation";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import ConversationList from "./ConversationList";
import SkeletonLoading from "@/components/common/SkeletonLoading";

interface ConversationWrapperProps {
  session: Session;
  screenSize: number;
}

export default function ConversationWrapper({
  session,
  screenSize,
}: ConversationWrapperProps) {
  const router = useRouter();
  const {
    query: { conversationId },
  } = router;
  const {
    user: { id: userId },
  } = session;

  // Querying conversations on component render
  const {
    data: conversationsData,
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
  // Subscribing to Updated field on Conversation entity
  // to display read status and latest message
  useSubscription<ConversationUpdatedData, { session: Session }>(
    ConversationsOperations.Subscriptions.conversationUpdated,
    {
      variables: { session }, // NEED TO PASS VARIABLES INTO THE CONVERSATION_UPDATED SUBSCRIPTION
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;
        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation },
        } = subscriptionData;

        // does conversation matches url id from query
        const currentlyViewingConversation = conversation.id === conversationId; // coming from url

        // The user who is in conversation will not have an indication of unread message
        if (currentlyViewingConversation)
          onViewConversation(conversationId, false);
      },
    }
  );

  // Subscription which is responsible for displaying updates when new conversation is created
  // Uses subscribeToMore function provided by ConversationsOperations.Queries.conversations
  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationsOperations.Subscriptions.conversationCreated,
      variables: { session },
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: Conversation };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;
        if (
          prev.conversations.find(
            (conversation) => conversation.id === newConversation?.id
          )
        ) {
          return prev;
        }

        return Object.assign({}, prev, {
          conversations: [
            subscriptionData.data.conversationCreated,
            ...prev.conversations,
          ],
        });
      },
    });
  };

  // Marking conversation read Mutation
  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    MarkConversationAsReadVariables
  >(ConversationsOperations.Mutations.markConversationAsRead);

  // Function which will be passed down to be used onClick of a particular conversation
  async function onViewConversation(
    conversationId: string,
    hasSeenLatestMessages: boolean
  ) {
    // push to new url
    router.push({ query: { conversationId } });

    // Update Reading Status
    if (hasSeenLatestMessages) return;

    try {
      await markConversationAsRead({
        variables: { session, conversationId, userId },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        // Updating apollo cache in order to display state change without reloading the page

        // Get conversationParticipant from the cache
        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            participants: Array<Participant>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                    image
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          // Making copy of the participants to find index of userParticipant
          const participants = [...participantsFragment.participants];
          const userParticipantIdx = participants.findIndex(
            (participant) => participant.user.id === userId
          );

          if (userParticipantIdx === -1) return; // Not found

          const userParticipant = participants[userParticipantIdx];
          // updating the reading status
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          // Writing updated values to cache
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdateParticipant on Conversation {
                participants
              }
            `,
            // return data
            data: {
              participants,
            },
          });
        },
      });
    } catch (error: any) {
      console.log("onViewConversation", error);
    }
  }

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      // When conversation created or chosen on mobile, whole left component is hidden
      // Only FeedWrapper is visible
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "500px" }}
      bg="whiteAlpha.200"
      flexDirection="column"
      gap={4}
      py={6}
      px={3}
    >
      {conversationLoading ? (
        <SkeletonLoading
          // Will create dummy animation while loading
          // Quantity depends on the size of user's screen
          count={screenSize && Math.floor(screenSize! / 80)}
          height={"80px"}
        />
      ) : (
        <>
          <ConversationList
            session={session}
            conversations={conversationsData?.conversations || []}
            onViewConversation={onViewConversation}
          />
        </>
      )}
    </Box>
  );
}
