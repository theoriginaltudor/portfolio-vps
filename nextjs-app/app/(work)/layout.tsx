import React, { Suspense } from "react";
import { AvatarWithShadow } from "@/components/avatar-with-shadow";
import { LayoutMessage } from "@/feature-components/work/project-page/layout-message";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50">
        <Suspense>
          <LayoutMessage />
        </Suspense>
        <AvatarWithShadow size="small" />
      </div>
    </>
  );
}
