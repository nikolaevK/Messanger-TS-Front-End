import { Message } from "@/util/types";
import { Avatar, Flex, Stack } from "@chakra-ui/react";
import React from "react";

interface MessageStringProps {
  message: Message;
  sentByMe: boolean;
}

export default function MessageString({
  message,
  sentByMe,
}: MessageStringProps) {
  console.log(message);
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
      {true && (
        <Flex align="flex-end">
          <Avatar src={message.imageUrl} />
        </Flex>
      )}
    </Stack>
  );
}
