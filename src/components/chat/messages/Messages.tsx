import SkeletonLoading from "@/components/common/SkeletonLoading";
import {
  MessageData,
  MessageSubscriptionData,
  MessagesVariables,
} from "@/util/types";
import { useQuery } from "@apollo/client";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useEffect } from "react";
import toast from "react-hot-toast";
import MessageOperations from "../../../apollographql/operations/message";
import MessageString from "./MessageString";

interface MessagesProps {
  userId: string;
  conversationId: string;
  screenSize: number;
  session: Session;
}

export default function Messages({
  conversationId,
  userId,
  screenSize,
  session,
}: MessagesProps) {
  // Querying messages together with subscription for newly sent messages
  // To display updated in real time by using subscribeToMore
  const { data, loading, error, subscribeToMore } = useQuery<
    MessageData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
      session,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  // UseEffect will subscribe to a conversation and then
  // When user moves to the other conversation and router will have other conversationId
  // it will unsubscribe from previous conversation and subscribe to new conversation
  // to display messages from that conversation
  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;
        return Object.assign({}, prev, {
          // if user is sender, then we have the value in the cache, no need to update with new value
          // if user is a receiver not the sender, need to fetch new message for him
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
    return () => unsubscribe();
  }, [conversationId]);

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoading
            count={screenSize && Math.floor(screenSize! / 60)}
            height={"60px"}
          />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data?.messages.map((message) => (
            <MessageString
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
}
