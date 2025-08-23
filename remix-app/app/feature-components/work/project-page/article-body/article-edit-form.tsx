"use client";

import React, { useActionState } from "react";
import { updateArticle } from "../actions/update-article";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/client";
import { Button } from "@/components/ui/button";

interface ArticleEditFormProps {
  children: string;
  projectId?: number;
}

export const ArticleEditForm: React.FC<ArticleEditFormProps> = ({
  children,
  projectId,
}) => {
  const [description, setDescription] = React.useState(children);
  const [hasUserInteracted, setHasUserInteracted] = React.useState(false);
  const path = usePathname();

  const updateWithPath = async (
    prevState: { success: boolean } | undefined,
    formData: FormData
  ) => {
    const result = await updateArticle(formData, path);
    setHasUserInteracted(false); // Reset interaction state after submission
    return result;
  };
  const [state, formAction, pending] = useActionState(
    updateWithPath,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 items-center">
      <input type="hidden" name="id" value={projectId} />
      <textarea
        name="long_description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setHasUserInteracted(true);
        }}
        className={cn(
          "w-full min-h-[300px] p-4 rounded-lg",
          "bg-transparent border",
          "font-sans text-base leading-relaxed",
          "focus:outline-none focus:ring-0",
          "prose prose-lg max-w-none",
          "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full",
          {
            "border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-gray-300 dark:focus:border-gray-600":
              !state || state.success === undefined || hasUserInteracted,
            "border-green-500 hover:border-green-500 focus:border-green-500":
              state?.success === true && !hasUserInteracted,
            "border-red-500 hover:border-red-500 focus:border-red-500":
              state?.success === false && !hasUserInteracted,
          }
        )}
        placeholder="Enter article content in Markdown format..."
        style={{
          fontFamily: "inherit",
          lineHeight: "1.6",
          fontSize: "16px",
        }}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};
