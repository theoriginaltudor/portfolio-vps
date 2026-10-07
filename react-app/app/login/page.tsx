import { Suspense, useState, useTransition } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/utils/api';

function LoginForm() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const target = searchParams.get('redirectTo') || '/';
    const redirectTo =
      target.startsWith('/') &&
      !target.startsWith('//') &&
      !target.includes('\\')
        ? target
        : '/';

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    startTransition(async () => {
      const result = await login(username, password);

      if (!result.ok) {
        setError(result.error || 'Login failed');
        return;
      }

      await refreshUser();
      navigate(redirectTo);
    });
  };

  return (
    <div className='flex flex-row gap-10'>
      <form
        className='mx-auto flex flex-col items-center justify-center gap-6 p-4'
        onSubmit={handleSubmit}
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
            disabled={isPending}
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
            disabled={isPending}
          />
        </div>
        {error && <p className='text-sm text-red-500'>{error}</p>}
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
