"use client";

import { FC } from "react";
import { useSearchParams } from "next/navigation";

import { useState } from "react";

export const LayoutMessage: FC = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const [visible, setVisible] = useState(true);

  if (!message || !visible) return null;

  return (
    <div className="absolute left-0 bottom-0 -translate-x-full px-4 py-2 rounded-xl mb-14 bg-blue-600 text-white text-sm shadow-lg w-64 whitespace-pre-line">
      <button
        aria-label="Close message"
        className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold transition-colors translate-x-1/2 -translate-y-1/2 cursor-pointer"
        onClick={() => setVisible(false)}
        type="button"
      >
        <span className="text-white">X</span>
      </button>
      {message}
    </div>
  );
};
