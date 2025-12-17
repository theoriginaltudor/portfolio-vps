import { authApiCall } from './auth-api';

export const getUser = async () => {
  const { ok, data: user } = await authApiCall('/api/Login/me', {
    method: 'GET',
  });
  if (!ok) return null;
  return user;
};
