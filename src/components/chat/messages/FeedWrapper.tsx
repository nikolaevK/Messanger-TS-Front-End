import { Box, Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { BiMessageDetail } from "react-icons/bi";
import Header from "./Header";
import MessageInput from "./MessageInput";

interface FeedWrapperProps {
  session: Session;
}

export default function FeedWrapper({ session }: FeedWrapperProps) {
  const router = useRouter();
  const { conversationId } = router.query;
  const {
    user: { id: userId },
  } = session;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
    >
      {conversationId && typeof conversationId === "string" ? (
        <>
          <Flex
            color="white"
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            <Header
              session={session}
              userId={userId}
              conversationId={conversationId}
            />
          </Flex>
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <Flex direction="column" height="100%" justify="center" align="center">
          <BiMessageDetail size={100} />
          <Box color="whiteAlpha.800">Choose Conversation</Box>
        </Flex>
      )}
    </Flex>
  );
}
