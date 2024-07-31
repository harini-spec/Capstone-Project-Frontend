import { useState, useEffect } from 'react';
import api from "../../Services/Axios";
import { toast } from 'react-toastify';

export const useUserPreference = (UserId) => {
    const [UserPreferences, setUserPreferences] = useState([]);
    
    useEffect(() => {
        const getUserPreferences = async () => {
            try {
                const yourConfig = {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                };
                const response = await api.get(`Metric/GetPreferenceListOfUser?UserId=${UserId}`, yourConfig);
                setUserPreferences(response.data);
            } catch (err) {
                if (err.response.status === 401) {
                    toast.error("Session Expired! Please Login Again");
                    localStorage.clear();
                    window.location.href = "/Login";
                } else if (err.response.status === 403) {
                    toast.error("You are not authorized to view this page");
                    window.location.href = "/Login";
                } else if (err.response.status === 404) {
                    toast.error("User Preferences Not Found");
                }
            }
        }

        if (UserId) {
            getUserPreferences();
        }
    }, [UserId]);

    return [UserPreferences, setUserPreferences];
};
