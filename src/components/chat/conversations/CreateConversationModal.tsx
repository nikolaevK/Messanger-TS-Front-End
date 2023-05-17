import {
  SearchedUser,
  SearchUsersData,
  SearchUsersVariables,
} from "@/util/types";
import { useLazyQuery } from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import UserOperations from "../../../apollographql/operations/user";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";

interface CreateConversationModalProps {
  session: Session;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateConversationModal({
  session,
  setIsOpen,
  isOpen,
}: CreateConversationModalProps) {
  const userNameRef = useRef<HTMLInputElement>(null);
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const onClose = () => setIsOpen(false);

  // Query searched users from graphql server
  // When useQuery is called by the component, it triggers the query subsequently.
  // But when useLazyQuery is called, it does not trigger the query subsequently,
  // and instead return a function that can be used to trigger the query manually.
  const [searchUsers, { data, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariables
  >(UserOperations.Queries.searchUsers);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userNameRef.current?.value) return;
    // Function which is provided by lazy query
    searchUsers({
      variables: { username: userNameRef.current.value, session },
    });
  }
  console.log(data?.searchUsers);

  function addParticipant(user: SearchedUser) {
    setParticipants((prev) => [...prev, user]);
    if (!userNameRef.current?.value) return;
    userNameRef.current.value = "";
  }

  function removeParticipant(userId: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "xs", md: "lg" }}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader color="white">Create Conversation</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <form onSubmit={onSubmit}>
              <Stack spacing={4}>
                <Input placeholder="Search" ref={userNameRef} color="white" />

                <Button
                  type="submit"
                  disabled={!userNameRef}
                  isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
