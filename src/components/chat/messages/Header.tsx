import { ConversationsData, ConversationsQueryVariables } from "@/util/types";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import ConversationsOperations from "../../../apollographql/operations/conversation";
import React from "react";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import SkeletonLoading from "@/components/common/SkeletonLoading";
import {
  formatUserImageURL,
  formatUsernames,
  formatUsernamesStrings,
} from "@/util/functions";
import { IoIosArrowBack } from "react-icons/io";

interface HeaderProps {
  userId: string;
  conversationId: string;
  session: Session;
}

export default function Header({
  conversationId,
  userId,
  session,
}: HeaderProps) {
  const router = useRouter();

  // Querying conversations on component render
  const { data, loading } = useQuery<
    ConversationsData,
    ConversationsQueryVariables
  >(ConversationsOperations.Queries.conversations, {
    variables: { session },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const conversation = data?.conversations.find(
    (conversation) => conversation.id === conversationId
  );

  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      justify={{ base: "space-between", md: "center" }}
      py={5}
      bg={{ base: "whiteAlpha.300", md: "none" }}
      px={{ base: 1, md: 0 }}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Button
        display={{ md: "none" }}
        color="black"
        bg="none"
        width="50px"
        onClick={() =>
          router.replace("?conversationId", "/", { shallow: true })
        }
      >
        <IoIosArrowBack size={30} color="#3d84f7" />
      </Button>
      {loading && <SkeletonLoading count={1} height={"30px"} width="90%" />}
      {!conversation && !loading && <Text>Conversation Not Found</Text>}
      {conversation && (
        <Stack direction="row" width={{ base: "50px" }} justify="center">
          {conversation.participants.length > 2 ? (
            <Stack direction="column" align="center" width="100vw" spacing={0}>
              <AvatarGroup
                size={conversation.participants.length > 3 ? "sm" : "md"}
                max={3}
                borderColor="transparent"
              >
                {formatUserImageURL(conversation.participants, userId).map(
                  (url, index) => (
                    <Avatar src={url} key={index} />
                  )
                )}
              </AvatarGroup>

              <Flex direction="row" fontSize="sm">
                {formatUsernamesStrings(conversation.participants, userId).map(
                  (s) => (
                    <Box>{s}&ensp;</Box>
                  )
                )}
              </Flex>
            </Stack>
          ) : (
            <Stack direction="column" align="center" spacing={0}>
              {formatUserImageURL(conversation.participants, userId).map(
                (url, index) => (
                  <Avatar src={url} key={index} />
                )
              )}

              <Text fontSize="sm">
                {formatUsernames(conversation.participants, userId)}
              </Text>
            </Stack>
          )}
        </Stack>
      )}
      <Box width="50px"></Box>
    </Stack>
  );
}
