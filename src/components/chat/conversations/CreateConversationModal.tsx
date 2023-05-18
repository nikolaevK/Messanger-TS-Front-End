import {
  SearchedUser,
  SearchUsersData,
  SearchUsersVariables,
  CreateConversationVariables,
  CreateConversationData,
} from "@/util/types";
import { useLazyQuery, useMutation } from "@apollo/client";
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
import ConversationOperations from "../../../apollographql/operations/conversation";
import UserSearchList from "./UserSearchList";
import Participants from "./Participants";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

interface CreateConversationModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateConversationModal({
  session,
  onClose,
  isOpen,
}: CreateConversationModalProps) {
  const userNameRef = useRef<HTMLInputElement>(null);
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

  const {
    user: { id: userId },
  } = session;
  const router = useRouter();

  // Query searched users from graphql server
  // When useQuery is called by the component, it triggers the query subsequently.
  // But when useLazyQuery is called, it does not trigger the query subsequently,
  // and instead return a function that can be used to trigger the query manually.
  const [searchUsers, { data, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVariables
  >(UserOperations.Queries.searchUsers);

  // Mutation which creates a conversation between participants
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationVariables>(
      ConversationOperations.Mutations.createConversation
    );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userNameRef.current?.value) return;
    // Function which is provided by lazy query
    searchUsers({
      variables: { username: userNameRef.current.value, session },
    });
  }

  function addParticipant(user: SearchedUser) {
    setParticipants((prev) => {
      if (prev.find((participant) => participant.id === user.id)) return prev;
      return [...prev, user];
    });
    if (!userNameRef.current?.value) return;
    userNameRef.current.value = "";
  }

  function removeParticipant(userId: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  }

  async function onCreateConversation() {
    const participantIds = [
      userId,
      ...participants.map((participant) => participant.id),
    ];

    try {
      const { data } = await createConversation({
        variables: {
          participantIds,
          session,
        },
      });

      if (!data?.createConversation)
        throw new Error("Failed to create conversation");

      const {
        createConversation: { conversationId },
      } = data;

      router.push({ query: { conversationId } });

      setParticipants([]);
      onClose(); // closes modal
      if (!userNameRef.current?.value) return;
      userNameRef.current.value = "";
    } catch (error: any) {
      console.log("onConversation error", error);
      toast.error(error?.message);
    }
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
                <Button
                  bg="messageBlue.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: "messageBlue.100" }}
                  isLoading={createConversationLoading}
                  onClick={onCreateConversation}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
