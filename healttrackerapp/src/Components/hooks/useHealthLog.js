import { useState, useEffect } from 'react';
import api from '../../Services/Axios.js';
import { toast } from 'react-toastify';

export const useHealthLog = (PrefId, isUpdateMode) => {
    const [Log, setLog] = useState({});

    useEffect(() => {
        if(!isUpdateMode) return null;
        const fetchHealthLogData = async () => {
            try {
                const yourConfig = {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                };
                const response = await api.get(`HealthLog/GetHealthLog?PrefId=${PrefId}`, yourConfig);
                if(response.data.healthStatus){
                    response.data.healthStatus = response.data.healthStatus.replace(/_/g, " ")
                }
                else{
                    response.data.targetStatus = "--";
                }
    
                if(response.data.targetStatus){
                    response.data.targetStatus = response.data.targetStatus.replace(/_/g, " ")
                }
                else{
                    response.data.targetStatus = "No Target Set";
                }
                setLog({
                    id: response.data.id,
                    preferenceId: PrefId,
                    unit: response.data.unit,
                    healthStatus: response.data.healthStatus,
                    targetStatus: response.data.targetStatus,
                    value: response.data.value
                });
            } catch (err) {
                setLog({value: "--", healthStatus: "--", targetStatus: "--"});
            }
        };

        fetchHealthLogData();
    }, [PrefId]);

    return [Log, setLog];
};