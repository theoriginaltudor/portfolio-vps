"use client";

import { redirectWithAI } from "@/feature-components/chat-box/server/redirect-with-ai";

import { cn } from "@/lib/utils/client";

import { useActionState, useRef, useState } from "react";

export const ChatBox: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const isTooLong = message.length > 800;

  const handleSubmit = async (prevState: void, formData: FormData) => {
    if (!message.trim()) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);
    if (!isTooLong) redirectWithAI(formData);
  };

  const [, formAction, pending] = useActionState(handleSubmit, undefined);

  return (
    <form
      ref={formRef}
      className="relative w-[90vw] max-w-[90vw] md:w-[32rem] md:max-w-[32rem]"
      action={formAction}
    >
      <div
        className={cn(
          "rounded-3xl bg-card/80 shadow w-full p-4 flex flex-col gap-2",
          { "border-2 border-red-500": isTooLong || isEmpty }
        )}
      >
        <textarea
          name="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (isEmpty && e.target.value.trim()) setIsEmpty(false);
          }}
          className="w-full min-h-[120px] bg-transparent text-base resize-none placeholder:text-muted-foreground border-none focus:border-none focus:ring-0 focus:outline-none outline-none"
          placeholder="Hi, I'm Tudor. How can I help you today?"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground select-none pointer-events-none">
            <b>Enter</b>: send, <b>Shift+Enter</b>: newline
          </span>
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-3xl px-4 py-2 flex items-center justify-center shadow hover:bg-primary/90 transition-colors text-xs font-semibold cursor-pointer"
            aria-label="Send"
            disabled={pending}
          >
            {pending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </form>
  );
};
