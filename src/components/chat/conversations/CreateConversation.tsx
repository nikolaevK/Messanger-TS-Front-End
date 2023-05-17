import { Box, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface CreateConversationProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}

export default function CreateConversation({
  isOpen,
  setIsOpen,
}: CreateConversationProps) {
  const onOpen = () => setIsOpen(true);
  return (
    <Box
      py={2}
      px={4}
      mb={4}
      bg="messageBlue.100"
      borderRadius={4}
      cursor="pointer"
      onClick={onOpen}
    >
      <Text textAlign="center" color="whiteAlpha.900" fontWeight={500}>
        Start a conversation
      </Text>
    </Box>
  );
}
