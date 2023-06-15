import { formatUserImageURL, formatUsernames } from "@/util/functions";
import { Conversation } from "@/util/types";
import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";

interface ConversationItemProps {
  conversation: Conversation;
  userId: string;
  onClick: () => void;
  isSelected: boolean;
  hasSeenLatestMessage: boolean;
  session: Session;
  onDeleteConversation: (conversationId: string) => void;
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
  onDeleteConversation,
}: ConversationItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { participants } = conversation;
  const {
    query: { conversationId },
  } = useRouter();

  // Right mouse click or left mouse click
  const handleClick = (event: React.MouseEvent) => {
    if (event.type === "click") {
      onClick();
    } else if (event.type === "contextmenu") {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

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
      borderBottom={!conversationId ? "1px" : ""}
      borderColor="whiteAlpha.300"
      _hover={{ bg: "whiteAlpha.200" }}
      position="relative"
      onClick={onClick}
      onContextMenu={handleClick}
      height="80px"
    >
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuList bg="#2d2d2d">
          {conversation.participants.length > 2 ? (
            <MenuItem
              icon={<BiLogOut fontSize={20} />}
              onClick={(event) => {
                event.stopPropagation();
                // onLeaveConversation(conversation);
              }}
              bg="#2d2d2d"
              _hover={{ bg: "whiteAlpha.300" }}
            >
              Leave
            </MenuItem>
          ) : (
            <MenuItem
              icon={<MdDeleteOutline fontSize={20} />}
              onClick={(event) => {
                event.stopPropagation();
                onDeleteConversation(conversation.id);
              }}
              bg="#2d2d2d"
              _hover={{ bg: "whiteAlpha.300" }}
            >
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <Flex position="absolute" left="px">
        {hasSeenLatestMessage === false && (
          <GoPrimitiveDot fontSize={18} color="#3d84f7" />
        )}
      </Flex>

      {participants.length <= 2 ? (
        formatUserImageURL(participants, userId).map((url, index) => (
          <Avatar src={url} key={index} />
        ))
      ) : (
        <AvatarGroup
          size={participants.length > 3 ? "sm" : "md"}
          max={2}
          borderColor="transparent"
        >
          {formatUserImageURL(participants, userId).map((url, index) => (
            <Avatar src={url} key={index} />
          ))}
        </AvatarGroup>
      )}
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
