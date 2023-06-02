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

interface EmojiProps {
  id: string;
  keywords: Array<string>;
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

export default function MessageInput({
  session,
  conversationId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [emojiModal, setEmojiModal] = useState(false);

  function addEmoji(e: EmojiProps) {
    setMessage(message + e.native);
  }

  return (
    <Box px={4} py={6} width="100%" position="relative">
      <form>
        <Flex>
          <Button
            size="md"
            bg="transparent"
            zIndex={10}
            onClick={() => setEmojiModal((prev) => !prev)}
          >
            <MdOutlineEmojiEmotions color="#3d84f7" size={25} />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            size="md"
            placeholder="New Message"
            _focus={{
              boxShadow: "none",
              border: "1px solid",
              borderColor: "whiteAlpha.300",
            }}
          />
        </Flex>

        {emojiModal && (
          <Box position="absolute" bottom={"20"} left={0}>
            <Picker data={data} theme="dark" onEmojiSelect={addEmoji} />
          </Box>
        )}

        <Button
          size="md"
          bg="transparent"
          zIndex={10}
          position="absolute"
          right={4}
          bottom={6}
        >
          <BsSend color="#3d84f7" size={25} />
        </Button>
      </form>
    </Box>
  );
}
