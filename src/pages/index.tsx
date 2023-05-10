import { NextPageContext } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div>
      <button onClick={() => signIn("google")}>SignIn</button>
      <button onClick={() => signOut()}>Signout</button>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
