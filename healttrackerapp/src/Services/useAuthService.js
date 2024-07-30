import { useEffect, useState } from 'react';
import { ParseToken } from './ParseToken';
import { toast } from 'react-toastify';

export const useAuthService = () => {
    const [Role, setRole] = useState('');
    const [IsExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const Auth = () => {
            try{
                if (!localStorage.getItem('token')) {
                    return;
                }
                const decoded = ParseToken();
                if (decoded) {
                    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                    const exp = decoded['exp'] * 1000;
                    const expiryDate = new Date(exp);
                    const currentDate = new Date();
                    setRole(role);
                    setIsExpired(currentDate > expiryDate);
                }
            }
            catch (error) {
                toast.error('Invalid token. Login again!', error);
            }
        };
        Auth();
    }, [localStorage.getItem('token')]);
    return [Role, IsExpired];
};
