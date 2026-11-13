import { Avatar, AvatarFallback, AvatarImage } from "@aureus-core/ui/shadcn/avatar";
import { Bubble, BubbleContent } from "@aureus-core/ui/shadcn/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@aureus-core/ui/shadcn/message";
import type { ChatMessage } from "@fixtures/chat-messages";
import { currentUser } from "@fixtures/users";
import { SparklesIcon } from "lucide-react";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

/** One chat message as the AI & Chat stories render it: avatar, author, bubble and time. */
export function ChatRow({ message }: { message: ChatMessage }) {
  const mine = message.role === "user";
  return (
    <Message align={mine ? "end" : "start"}>
      <MessageAvatar>
        {mine ? (
          <Avatar size="sm">
            <AvatarImage src={currentUser.avatar} alt="" />
            <AvatarFallback>{currentUser.initials}</AvatarFallback>
          </Avatar>
        ) : (
          <span className="flex size-6 items-center justify-center rounded-full bg-muted">
            <SparklesIcon className="size-3.5" aria-hidden />
          </span>
        )}
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>{message.author}</MessageHeader>
        <Bubble variant={mine ? "default" : "muted"} align={mine ? "end" : "start"}>
          <BubbleContent>{message.content}</BubbleContent>
        </Bubble>
        <MessageFooter>
          <time dateTime={message.time}>{timeFormat.format(new Date(message.time))}</time>
        </MessageFooter>
      </MessageContent>
    </Message>
  );
}
