import React, { useRef } from "react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import {
  Button,
  Center,
  Flex,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { RiMessengerLine } from "react-icons/ri";
import { useMutation } from "@apollo/client";
import { CreateUsernameData, CreateUsernameVariables } from "@/util/types";
import UserOperations from "../apollographql/operations/user";
import { GraphQLError } from "graphql";
import toast from "react-hot-toast";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

export default function Auth({ session, reloadSession }: AuthProps) {
  const userNameRef = useRef<HTMLInputElement>(null);
  // Accessing the mutation
  // First variable is the return values of createUsername Mutation
  // Second variable is the variables that function takes
  const [createUsername, { loading }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  async function onSubmit() {
    // checking if there is input
    if (!userNameRef.current?.value) return;

    try {
      const username = userNameRef.current.value;

      // passing variable to the mutation
      const { data } = await createUsername({
        variables: { username, session },
      });

      // Check if Mutation has executed
      if (!data?.createUsername) throw new Error();

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      toast.success("Username successfully created");
      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);
      console.log("createUsernameOnSubmit error", error);
    }
  }

  return (
    <Center height="100vh">
      <Stack align="center" spacing={8}>
        {session ? (
          <>
            <Text fontSize="3xl" color="white">
              Create a Username
            </Text>
            <Input
              color="white"
              placeholder="Enter a username"
              ref={userNameRef}
            />
            <Button width="100%" onClick={onSubmit} isLoading={loading}>
              Save
            </Button>
            {/* <Button onClick={signOut()}>drsfds</Button> */}
          </>
        ) : (
          <>
            <Flex align="center" gap={3}>
              <Text fontSize="3xl" color="white">
                Messenger
              </Text>
              <RiMessengerLine size={40} />
            </Flex>
            <Button
              leftIcon={<Image height="20px" src="/images/googlelogo.png" />}
              background="gray"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
}
