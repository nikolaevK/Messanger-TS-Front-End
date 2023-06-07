import SkeletonLoading from "@/components/common/SkeletonLoading";
import { MessageData, MessagesVariables } from "@/util/types";
import { useQuery } from "@apollo/client";
import { Box, Flex, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
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

  console.log({ data });

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
            <MessageString key={message.id} message={message} sentByMe={true} />
          ))}
        </Flex>
      )}
    </Flex>
  );
}
