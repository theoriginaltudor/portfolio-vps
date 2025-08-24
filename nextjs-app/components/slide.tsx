import * as React from "react";
import Image from "next/image";
import { unstable_ViewTransition as ViewTransition } from "react";
import { getImageUrl } from "@/lib/utils/get-url";

interface SlideProps {
  id: number;
  imagePath?: string;
  title: string;
  description: string;
}

export const Slide: React.FC<SlideProps> = async ({
  id,
  title,
  imagePath,
  description,
}: SlideProps) => {
  let publicUrl: string | undefined = undefined;
  if (imagePath) {
    publicUrl = getImageUrl(imagePath);
  }

  return (
    <div className="relative h-[70dvh] w-full md:w-96">
      <div className="w-full h-full max-w-5xl rounded-xl overflow-hidden bg-card flex items-start justify-start mb-4 shrink-0 relative">
        {publicUrl && (
          <Image
            src={publicUrl}
            alt={title}
            fill
            className="object-cover w-full h-full absolute inset-0 z-0"
            priority
          />
        )}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white dark:from-black to-transparent flex items-start">
          <div className="p-6 w-1/2">
            <ViewTransition name={`slide-title-description-${id}`}>
              <h2 className="text-xl font-semibold mb-1 text-black dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-left text-black dark:text-white">
                {description}
              </p>
            </ViewTransition>
          </div>
        </div>
      </div>
    </div>
  );
};
