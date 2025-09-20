import { Input } from '@/components/ui/input';
import type { Metadata } from 'next';
import {
  loginUser,
  // registerUser
} from './actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getUser } from '@/lib/utils/server';

export default async function LoginPage({
  searchParams,
}: {
  // In Next.js 15 (React 19), searchParams is provided as a Promise for streaming compat
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const user = await getUser();
  if (user) {
    return (
      <div className='flex h-screen flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold'>
          You are already logged in! {user.username}
        </h1>
      </div>
    );
  }
  const { redirect: rawRedirect } = await searchParams;
  const redirect = Array.isArray(rawRedirect) ? rawRedirect[0] : rawRedirect;
  return (
    <div className='flex flex-row gap-10'>
      <form
        className='mx-auto flex flex-col items-center justify-center gap-6 p-4'
        action={loginUser}
      >
        {redirect && <input type='hidden' name='redirectTo' value={redirect} />}
        <div className='flex w-full gap-2'>
          <Label htmlFor='username' className='flex-1 justify-end'>
            Username:
          </Label>
          <Input
            className='w-[200px]'
            id='username'
            name='username'
            type='text'
            required
            autoComplete='username'
            minLength={3}
            maxLength={254}
          />
        </div>
        <div className='flex w-full gap-2'>
          <Label htmlFor='password' className='flex-1 justify-end'>
            Password:
          </Label>
          <Input
            className='w-[200px]'
            id='password'
            name='password'
            type='password'
            required
            minLength={6}
            maxLength={128}
            autoComplete='current-password'
          />
        </div>
        <Button type='submit'>Log in</Button>
      </form>
      {/* <form
        className='mx-auto flex flex-col items-center justify-center gap-6 p-4'
        action={registerUser}
      >
        <div className='flex w-full gap-2'>
          <Label htmlFor='username' className='flex-1 justify-end'>
            Username:
          </Label>
          <Input
            className='w-[200px]'
            id='username'
            name='username'
            type='text'
            required
            autoComplete='username'
            minLength={3}
            maxLength={254}
          />
        </div>
        <div className='flex w-full gap-2'>
          <Label htmlFor='password' className='flex-1 justify-end'>
            Password:
          </Label>
          <Input
            className='w-[200px]'
            id='password'
            name='password'
            type='password'
            required
            minLength={6}
            maxLength={128}
            autoComplete='current-password'
          />
        </div>
        <Button type='submit'>Sign up</Button>
      </form> */}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Secure access for managing portfolio content and data integration tasks.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Login – Tudor Caseru',
    description: 'Authenticated access to management features.',
    url: 'https://tudor-dev.com/login',
  },
};
