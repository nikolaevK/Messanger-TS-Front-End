import Auth from "@/components/Auth";
import Chat from "@/components/chat/Chat";
import { Box } from "@chakra-ui/react";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";

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
export async function getServerSideProps({ req, res }: any) {
  const session = await getServerSession(req, res, authOptions);

  return {
    props: {
      session,
    },
  };
}
