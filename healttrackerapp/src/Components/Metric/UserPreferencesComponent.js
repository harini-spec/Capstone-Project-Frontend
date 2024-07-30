import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/Axios';
import { icons } from '../../Data/IconData';
import { colors } from '../../Data/ColorData';
  
export const UserPreferencesComponent = () =>  {

    const Navigate = useNavigate();

    const [Metrics, setMetrics] = useState([]);

    useEffect(() => {
        checkIfAlreadySet();
        fetchAllMetrics();
    }, []);

    const fetchAllMetrics = async () => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            };

            var response = await api.get(`Metric/GetAllMetrics`, yourConfig);
            setMetrics(response.data);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const checkIfAlreadySet = () => {
        var IsPreferenceSet = localStorage.getItem("IsPreferenceSet");
        if(IsPreferenceSet == "true")
            Navigate('/DashBoard');
    }

	return (
	  <div>
        <div className="pref-container">
            <div className="row">
                {Metrics.map((metric, index) => (
                    <div className="col-md-4">
                        <div className="card pref-card">
                            <p className="icon text-center" style={{color: colors["color"+ index]}}>{icons[metric]}</p>
                            <h3 className='text-center'>{metric.replace(/_/g, " ")}</h3> 
                        </div>
                    </div>
                ))}
            </div>
            </div>
	  </div>
	);
}  