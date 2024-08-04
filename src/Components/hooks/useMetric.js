import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../Services/Axios";
import { toast } from 'react-toastify';

export const useMetric = (PrefId) => {
    const [Metric, setMetric] = useState({});
    const Navigate = useNavigate();

    useEffect(() => {
        const fetchMetricData = async () => {
            try {
                const yourConfig = {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                };
                const response = await api.get(`Metric/GetPreferenceDTOByPrefId?PrefId=${PrefId}`, yourConfig);
                if(response.data.metricType){
                    response.data.metricType = response.data.metricType.replace(/_/g, " ")
                }
                setMetric(response.data);
            } catch (err) {
                toast.error("Failed to Fetch Metric Data");
                setMetric({ MetricType: "--", MetricUnit: "--" });
                Navigate(`/DashBoard`);
            }
        };

        fetchMetricData();
    }, [PrefId]);

    return [Metric, setMetric];
};