"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { NavigationMenu } from "@/components/navigation-menu";
import { User } from "@supabase/supabase-js";

export const MobileNav = ({ user }: { user?: User | undefined }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="md:hidden">
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 shadow-lg bg-card/80 backdrop-blur"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-7 h-7" />
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <NavigationMenu
          className="flex flex-col items-center gap-6 w-full"
          onNavigate={() => setOpen(false)}
          {...(user ? { user } : {})}
        />
      </Drawer>
    </div>
  );
};
