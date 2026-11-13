import { asset } from "./asset";
/** People used across stories. Avatars are local SVGs in `public/avatars/` (no network in tests). */
export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  avatar: string;
}

export const users: readonly User[] = [
  {
    id: "u1",
    name: "Ada Lovelace",
    initials: "AL",
    email: "ada@example.com",
    role: "Owner",
    avatar: asset("/avatars/ada.svg"),
  },
  {
    id: "u2",
    name: "Grace Hopper",
    initials: "GH",
    email: "grace@example.com",
    role: "Admin",
    avatar: asset("/avatars/grace.svg"),
  },
  {
    id: "u3",
    name: "Alan Turing",
    initials: "AT",
    email: "alan@example.com",
    role: "Member",
    avatar: asset("/avatars/alan.svg"),
  },
  {
    id: "u4",
    name: "Linus Torvalds",
    initials: "LT",
    email: "linus@example.com",
    role: "Member",
    avatar: asset("/avatars/linus.svg"),
  },
  {
    id: "u5",
    name: "Margaret Hamilton",
    initials: "MH",
    email: "margaret@example.com",
    role: "Admin",
    avatar: asset("/avatars/margaret.svg"),
  },
  {
    id: "u6",
    name: "Katherine Johnson",
    initials: "KJ",
    email: "katherine@example.com",
    role: "Viewer",
    avatar: asset("/avatars/katherine.svg"),
  },
];

/** First user, typed as defined (stories use it as "the current user"). */
export const currentUser: User = users[0] as User;
