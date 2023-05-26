import { Participant } from "./types";

// Returns all participants of the conversation but the the current user
export function formatUsernames(
  participants: Array<Participant>,
  myUserId: string
): string {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames.join(", ");
}

export function formatUsernamesStrings(
  participants: Array<Participant>,
  myUserId: string
): Array<string> {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames;
}

// Returns all participants URLS but the the current user
export function formatUserImageURL(
  participants: Array<Participant>,
  myUserId: string
): Array<string> {
  return participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.image);
}
