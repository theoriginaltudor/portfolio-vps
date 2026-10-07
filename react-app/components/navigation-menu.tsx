
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cn } from '@/lib/utils/client';
import { Link } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { components } from '@/types/swagger-types';
import { LogoutButton } from '@/components/logout-button';

export const NavigationMenu = ({
  className,
  onNavigate,
  user,
}: {
  className?: string;
  onNavigate?: () => void;
  user?: components['schemas']['AuthUserDto'];
}) => {
  return (
    <NavigationMenuPrimitive.Root
      className={cn('flex w-full justify-end', className)}
    >
      <NavigationMenuPrimitive.List className='flex w-full flex-col items-center gap-6 md:flex-row md:gap-8'>
        <NavigationMenuPrimitive.Item>
          <NavigationMenuPrimitive.Link asChild>
            <Link to='/' onClick={onNavigate}>
              Home
            </Link>
          </NavigationMenuPrimitive.Link>
        </NavigationMenuPrimitive.Item>
        <NavigationMenuPrimitive.Item>
          <NavigationMenuPrimitive.Link asChild>
            <Link to='/projects' onClick={onNavigate}>
              Projects
            </Link>
          </NavigationMenuPrimitive.Link>
        </NavigationMenuPrimitive.Item>
        <NavigationMenuPrimitive.Item>
          <NavigationMenuPrimitive.Link asChild>
            <Link to='/contact' onClick={onNavigate}>
              Contact
            </Link>
          </NavigationMenuPrimitive.Link>
        </NavigationMenuPrimitive.Item>
        {user && (
          <>
            <NavigationMenuPrimitive.Item>
              <div className='flex flex-row items-center gap-2'>
                <UserIcon /> {user.username ?? 'Unknown user'}
              </div>
            </NavigationMenuPrimitive.Item>
            <NavigationMenuPrimitive.Item>
              <LogoutButton />
            </NavigationMenuPrimitive.Item>
          </>
        )}
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  );
};
