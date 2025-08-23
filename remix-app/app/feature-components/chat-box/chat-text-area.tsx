import { cn } from "@/lib/utils/client";
import React from "react";

const ChatTextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error: boolean }
> = ({ children, error, ...props }) => (
  <div
    className={cn(
      "rounded-3xl bg-card/80 shadow w-full p-4 flex flex-col gap-2",
      { "border-2 border-red-500": error }
    )}
  >
    <textarea
      name="message"
      className="w-full min-h-[120px] bg-transparent text-base resize-none placeholder:text-muted-foreground border-none focus:border-none focus:ring-0 focus:outline-none outline-none"
      {...props}
    />
    {children}
  </div>
);

export default ChatTextArea;
