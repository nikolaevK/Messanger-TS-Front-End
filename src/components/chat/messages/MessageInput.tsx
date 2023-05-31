import { Session } from "next-auth";
import { useRef, useState } from "react";
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { BsSend } from "react-icons/bs";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

export default function MessageInput({
  session,
  conversationId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [emojiModal, setEmojiModal] = useState(false);
  console.log(emojiModal);
  return (
    <Box px={4} py={6} width="100%">
      <form>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          size="md"
          placeholder="New Message"
          position="relative"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAlpha.300",
          }}
        />
        {emojiModal && (
          <Box position="absolute" bottom={"20"} right={5}>
            <Picker data={data} theme="dark" />
          </Box>
        )}
        <Flex position="absolute" right={4} bottom={6}>
          <Button
            size="md"
            bg="transparent"
            zIndex={10}
            onClick={() => setEmojiModal((prev) => !prev)}
          >
            <MdOutlineEmojiEmotions color="#3d84f7" />
          </Button>
          <Button size="md" bg="transparent" zIndex={10}>
            <BsSend color="#3d84f7" />
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
