import { Input } from '@/components/ui/input';
import type { Metadata } from 'next';
import { loginUser } from './actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getUser } from '@/lib/utils/server';
import { PageProps } from '../../.next/types/app/login/page';

export default async function LoginPage({ searchParams }: PageProps) {
  const user = await getUser();
  if (user) {
    return (
      <div className='flex h-screen flex-col items-center justify-center'>
        <h1 className='fon t-bold text-2xl'>
          You are already logged in! {user.username}
        </h1>
      </div>
    );
  }
  const redirect = (await searchParams).redirect;
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
        className="flex flex-col gap-6 p-4 justify-center items-center mx-auto"
        action={registerUser}
      >
        <div className="flex gap-2 w-full">
          <Label htmlFor="username" className="flex-1 justify-end">
            Username:
          </Label>
          <Input
            className="w-[200px]"
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            minLength={3}
            maxLength={254}
          />
        </div>
        <div className="flex gap-2 w-full">
          <Label htmlFor="password" className="flex-1 justify-end">
            Password:
          </Label>
          <Input
            className="w-[200px]"
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            maxLength={128}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit">Sign up</Button>
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
