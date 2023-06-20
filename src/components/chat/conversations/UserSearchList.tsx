import { SearchedUser } from "@/util/types";
import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface UserSearchListProps {
  users: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
}

export default function UserSearchList({
  users,
  addParticipant,
}: UserSearchListProps) {
  return (
    <>
      {users.length == 0 ? (
        <Flex mt={6} justify="center">
          <Text>No Users Found</Text>
        </Flex>
      ) : (
        <Stack>
          {users.map((user) => (
            <Stack
              key={user.id}
              direction="row"
              align="center"
              spacing={4}
              py={2}
              px={4}
              borderRadius={4}
              mt={4}
              _hover={{ bg: "whiteAlpha.200" }}
            >
              <Avatar src={user.image} />
              <Flex justify="space-between" align="center" width="100%">
                <Text color="whiteAlpha.700">{user.username}</Text>
                <Button
                  bg="messageBlue.100"
                  color="white"
                  _hover={{ bg: "messageBlue.100" }}
                  onClick={() => addParticipant(user)}
                >
                  Select
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
}
