'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Drawer } from '@/components/ui/drawer';
import { Menu } from 'lucide-react';
import { NavigationMenu } from '@/components/navigation-menu';
import { components } from '@/types/swagger-types';

export const MobileNav = ({
  user,
}: {
  user?: components['schemas']['AuthUserDto'] | undefined;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className='md:hidden'>
      <Button
        variant='outline'
        size='icon'
        className='bg-card/80 fixed right-6 bottom-6 z-50 shadow-lg backdrop-blur'
        onClick={() => setOpen(true)}
        aria-label='Open navigation menu'
      >
        <Menu className='h-7 w-7' />
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <NavigationMenu
          className='flex w-full flex-col items-center gap-6'
          onNavigate={() => setOpen(false)}
          {...(user ? { user } : {})}
        />
      </Drawer>
    </div>
  );
};
