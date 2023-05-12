import Auth from "@/components/Auth";
import Chat from "@/components/chat/Chat";
import { Box, Button } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { getSession, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  // Once username created, next auth needs to be reloaded
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {session?.user.username ? (
        <Chat session={session} />
      ) : (
        <>
          <Auth session={session} reloadSession={reloadSession} />
        </>
      )}
    </Box>
  );
}

// Server side renders session
export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
