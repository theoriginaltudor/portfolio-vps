
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/utils/api';

export function LogoutButton() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleLogout = async () => {
    const result = await logout();

    if (result.ok) {
      await refreshUser();
      navigate('/');
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  return (
    <button
      type='button'
      onClick={handleLogout}
      aria-label='Log out'
      className='flex cursor-pointer items-center gap-2'
    >
      <LogOut />
    </button>
  );
}
