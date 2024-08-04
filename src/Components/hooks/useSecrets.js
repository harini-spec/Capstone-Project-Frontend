import React, { useEffect } from 'react';
import { useState } from 'react';
import api from '../../Services/Axios';
  
export const useSecrets = () =>  {

    const [Secrets, setSecrets] = useState({});
    useEffect(() => {
        const getSecrets = async () => {
            try {
                const yourConfig = {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                };
                const response = await api.get(`OAuth/GetOAuthCreds`, yourConfig);
                setSecrets(response.data);
            } catch (err) {
            console.log(err);
            }
        };
        getSecrets();
        }, []);
	return Secrets;
  }