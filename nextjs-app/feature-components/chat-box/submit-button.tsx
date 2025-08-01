"use client";

import { useFormStatus } from "react-dom";
import { useSubmittingStore } from "./submitting-store";
import { memo, useEffect } from "react";

const SubmitButton: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const { pending } = useFormStatus();
  const { setLoading } = useSubmittingStore();
  useEffect(() => {
    setLoading(pending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  return (
    <button
      type="submit"
      className="bg-primary text-primary-foreground rounded-3xl px-4 py-2 flex items-center justify-center shadow hover:bg-primary/90 transition-colors text-xs font-semibold cursor-pointer"
      aria-label="Send"
      disabled={pending || disabled}
    >
      {pending ? "Sending..." : "Send"}
    </button>
  );
};

export const MemoizedSubmitButton = memo(SubmitButton);
