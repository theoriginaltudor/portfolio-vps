import { useRef, useState } from "react";
import { redirectWithAI } from "@/feature-components/chat-box/server/redirect-with-ai";

export function useChatBox() {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  const isTooLong = message.length > 800;

  const handleSubmit = async (prevState: void, formData: FormData) => {
    if (!message.trim()) {
      setIsEmpty(true);
      return;
    }
    if (isTooLong) {
      return;
    }
    setIsEmpty(false);
    redirectWithAI(formData);
  };

  return {
    formRef,
    message,
    setMessage,
    isEmpty,
    setIsEmpty,
    isTooLong,
    handleSubmit,
  };
}
