"use client";

import React, { useActionState, useState } from "react";
import Image from "next/image";
import { unstable_ViewTransition as ViewTransition } from "react";
import { updateArticle } from "./actions/update-article";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/client";

interface ProjectImageHeaderProps {
  title: string;
  id: number;
  image: string;
  edit?: boolean;
}

export const ProjectImageHeader: React.FC<ProjectImageHeaderProps> = ({
  title: projectTitle,
  id,
  image,
  edit = false,
}) => {
  const [title, setTitle] = useState(projectTitle);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const path = usePathname();

  const updateWithPath = async (
    prevState: { success: boolean } | undefined,
    formData: FormData
  ) => {
    const result = await updateArticle(formData, path);
    setHasUserInteracted(false); // Reset interaction state after submission
    return result;
  };
  const [state, formAction] = useActionState(updateWithPath, undefined);
  return (
    <div className="relative w-full min-h-[120px] h-[70dvh]">
      <Image
        src={image}
        alt={projectTitle}
        fill
        className="object-cover w-full h-full absolute inset-0 z-0 object-center"
        priority
        sizes="100vw"
      />
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)",
        }}
        data-dark="true"
      />
      <div
        className="absolute inset-0 z-5 pointer-events-none dark:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 100%)",
        }}
        data-dark="false"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-10 pb-8 px-4">
        {edit ? (
          <form action={formAction} className="w-full">
            <input type="hidden" name="id" value={id} />
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUserInteracted(true);
              }}
              name="title"
              className={cn(
                "text-5xl font-bold text-center drop-shadow-lg rounded-lg py-4 px-6 text-white dark:text-white hover:border-white/30 focus:ring-0 focus:ring-offset-0 w-full bg-transparent border border-transparent",
                {
                  "border-green-500 hover:border-green-500":
                    state?.success === true && !hasUserInteracted,
                  "border-red-500 hover:border-red-500":
                    state?.success === false && !hasUserInteracted,
                }
              )}
            />
          </form>
        ) : (
          <ViewTransition name={`slide-title-description-${id}`}>
            <h1 className="text-5xl font-bold text-center drop-shadow-lg rounded-lg py-4 px-6 text-white dark:text-white">
              {projectTitle}
            </h1>
          </ViewTransition>
        )}
      </div>
    </div>
  );
};
