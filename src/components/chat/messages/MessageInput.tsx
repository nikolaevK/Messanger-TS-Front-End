import { Session } from "next-auth";
import { useState } from "react";
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { BsSend } from "react-icons/bs";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { EmojiProps, SendMessageArgs } from "@/util/types";
import { useMutation } from "@apollo/client";
import MessageOperations from "../../../apollographql/operations/message";
import toast from "react-hot-toast";
import { ObjectId } from "bson";

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

  // Send new message mutation
  const [sendMessage] = useMutation<{ sendMessage: boolean }, SendMessageArgs>(
    MessageOperations.Mutation.sendMessage
  );

  async function onSendMessage(event: React.FormEvent) {
    event.preventDefault();

    if (message.length < 1) return;

    try {
      const { id: senderId } = session.user;
      const messageId = new ObjectId().toString(); //Creates random id

      // Creating a message item object
      const newMessage: SendMessageArgs = {
        id: messageId,
        conversationId,
        session,
        senderId,
        body: message,
      };

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
      });
      if (!data?.sendMessage) throw new Error("sendMessage");
      setMessage("");
      setEmojiModal(false);
    } catch (error: any) {
      console.log("onSendMessage", error);
      toast.error("message input", error?.message);
    }
  }

  function addEmoji(e: EmojiProps) {
    setMessage(message + e.native);
  }

  return (
    <Box px={4} py={6} width="100%" position="relative">
      <form onSubmit={onSendMessage}>
        <Flex>
          <Button
            size="md"
            bg="transparent"
            zIndex={10}
            onClick={() => setEmojiModal((prev) => !prev)}
          >
            <MdOutlineEmojiEmotions color="#3d84f7" size={30} />
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
          onClick={onSendMessage}
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
