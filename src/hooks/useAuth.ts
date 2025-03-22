import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './store';

export const useAuth = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector(state => state.user);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return { isAuthenticated: !!token };
}; 