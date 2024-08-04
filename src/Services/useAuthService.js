import { useEffect, useState } from 'react';
import { ParseToken } from './ParseToken';

export const useAuthService = () => {
    const [Role, setRole] = useState('');
    const [IsExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const Auth = () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Token from localStorage:", token);

                if (!token) {
                    return;
                }

                const decoded = ParseToken(token);
                console.log("Decoded token:", decoded);

                if (decoded) {
                    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                    console.log("Role from decoded token:", role);
                    
                    const exp = decoded['exp'] * 1000;
                    const expiryDate = new Date(exp);
                    const currentDate = new Date();
                    
                    setRole(role);
                    setIsExpired(currentDate > expiryDate);

                    console.log("Role set to:", role); // This should log the correct role
                }
            } catch (error) {
                console.error('Invalid token. Login again!', error);
            }
        };
        Auth();
    }, []); // Only run once on mount

    return [Role, IsExpired];
};
