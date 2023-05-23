import { formatUsernames } from "@/util/functions";
import { Conversation } from "@/util/types";
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React from "react";
import { GoPrimitiveDot } from "react-icons/go";

interface ConversationItemProps {
  conversation: Conversation;
  userId: string;
  onClick: () => void;
  isSelected: boolean;
  hasSeenLatestMessage: boolean;
}

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

export default function ConversationItem({
  isSelected,
  hasSeenLatestMessage,
  userId,
  conversation,
  onClick,
}: ConversationItemProps) {
  return (
    <Stack
      mt={1}
      direction="row"
      align="center"
      justify="space-between"
      p={4}
      cursor="pointer"
      borderRadius={4}
      bg={isSelected ? "whiteAlpha.200" : "none"}
      _hover={{ bg: "whiteAlpha.200" }}
      position="relative"
      onClick={onClick}
    >
      <Flex position="absolute" left="px">
        {hasSeenLatestMessage === false && (
          <GoPrimitiveDot fontSize={18} color="#3d84f7" />
        )}
      </Flex>
      <Avatar />
      <Flex justify="space-between" width="80%" height="100%">
        <Flex direction="column" width="70%" height="100%">
          <Text
            fontWeight={600}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {formatUsernames(conversation.participants, userId)}
          </Text>
          {conversation.latestMessage && (
            <Box>
              <Text
                color="whiteAlpha.700"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {conversation.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text
          color="whiteAlpha.700"
          textAlign="right"
          position="absolute"
          right={4}
        >
          {formatRelative(new Date(conversation.updatedAt), new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token) =>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            },
          })}
        </Text>
      </Flex>
    </Stack>
  );
}
