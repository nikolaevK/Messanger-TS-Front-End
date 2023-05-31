interface MessagesProps {
  userId: string;
  conversationId: string;
}

export default function Messages({ conversationId, userId }: MessagesProps) {
  return <div>Messages</div>;
}
