import { useState, useEffect } from 'react';
import api from '../../Services/Axios';

export const useGraphData = (category, duration) => {
    const [GraphData, setGraphData] = useState([]);
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        const getGraphData = async () => {
            try {
                setLoading(true);
                const yourConfig = {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                };
                const response = await api.get(`Graph/GetGraphData?MetricType=${category}&Duration=${duration}&UserId=${localStorage.getItem("userID")}`, yourConfig);
                setGraphData(await response.data);
            } catch (err) {
                console.log(err);
            }
            finally {
                setLoading(false);
            }
        };
        getGraphData();
    }, [category, duration]);

    return {GraphData, Loading};
};
