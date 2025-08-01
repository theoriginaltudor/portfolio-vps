"use client";

import React from "react";
import { MinusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils/client";

interface RemoveButtonProps {
  error?: boolean;
  id: number;
  handleClick?: (id: number) => void;
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({
  id,
  error,
  handleClick,
}) => {
  return (
    <span className="inline-flex items-center">
      <button
        type="submit"
        aria-label="Remove"
        onClick={() => handleClick?.(id)}
      >
        <MinusCircleIcon
          className={cn("cursor-pointer", {
            "text-red-500": error === true,
          })}
        />
      </button>
    </span>
  );
};
