import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guestbook",
  description:
    "Leave a note in the Novita guestbook — thoughts, suggestions, ideas, or something random.",
  alternates: { canonical: "https://www.novitaguok.com/guestbook" },
};

export default function GuestbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
