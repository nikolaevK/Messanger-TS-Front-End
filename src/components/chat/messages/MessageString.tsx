import { Message } from "@/util/types";
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

interface MessageStringProps {
  message: Message;
  sentByMe: boolean;
}
const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: "p",
  other: "MM/dd/yy",
};

export default function MessageString({
  message,
  sentByMe,
}: MessageStringProps) {
  return (
    <Stack
      direction="row"
      p={4}
      spacing={4}
      _hover={{
        bg: "whiteAlpha.200",
      }}
      wordBreak="break-word"
    >
      {!sentByMe && (
        <Flex align="flex-end">
          <Avatar src={message?.imageUrl} />
        </Flex>
      )}
      <Stack spacing={1} width="100%">
        <Stack
          direction="row"
          align="center"
          justify={sentByMe ? "flex-end" : "flex-start"}
        >
          {!sentByMe && <Text>{message.sender.username}</Text>}
          <Text fontSize={14} color="whiteAlpha.700">
            {formatRelative(new Date(message.createdAt), new Date(), {
              locale: {
                ...enUS,
                formatRelative: (token) =>
                  formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                  ],
              },
            })}
          </Text>
        </Stack>
        <Flex justify={sentByMe ? "flex-end" : "flex-start"}>
          <Box
            bg={sentByMe ? "messageBlue.100" : "whiteAlpha.300"}
            px={2}
            py={1}
            borderRadius={14}
            maxWidth="65%"
          >
            <Text>{message.body}</Text>
          </Box>
        </Flex>
      </Stack>
    </Stack>
  );
}
