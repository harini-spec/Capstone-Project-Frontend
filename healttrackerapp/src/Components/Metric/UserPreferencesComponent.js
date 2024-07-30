import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/Axios';
import { icons } from '../../Data/IconData';
import { colors } from '../../Data/ColorData';
import '../../Styles/PrefStyles.css';
import { toast, ToastContainer } from 'react-toastify';
  
export const UserPreferencesComponent = () =>  {

    const Navigate = useNavigate();

    const [Metrics, setMetrics] = useState([]);
    const [SelectedMetrics, setSelectedMetrics] = useState([]);

    useEffect(() => {
        if(!localStorage.getItem("token"))
            Navigate('/Login');
        fetchAllMetrics();
    }, [Metrics]);

    const fetchAllMetrics = async () => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            };

            var response = await api.get(`Metric/GetAllMetrics`, yourConfig);
            setMetrics(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const SavePreferences = async () => {
        console.log(SelectedMetrics);

        try {
            const yourConfig = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            };

            var response = await api.post(`Metric/AddPreferenceListOfUser`, SelectedMetrics, yourConfig);
            if(response.status == 200)
                toast.success("Preferences Saved Successfully");
            localStorage.setItem("IsPreferenceSet", "true");

            if(localStorage.getItem("role") == "User")
                Navigate('/DashBoard');
            else
                Navigate('/CoachDashBoard');
        }
        catch (err) {
            if(err.response.status == 409)
                toast.error("Some of the preferences already exists");
            else toast.error(err.response.data.errorMessage);
        }
    }

    const AddPref = (metric) => {
        if(SelectedMetrics.includes(metric))
            setSelectedMetrics(SelectedMetrics.filter(item => item !== metric));
        else
            setSelectedMetrics([...SelectedMetrics, metric]);
    }

	return (
	  <div className='pref-main-container'>
        <ToastContainer />
        <div className="pref-container">
            <h1 className="text-center pt-4 mb-4">CHOOSE WHAT YOU WANT TO MONITOR!</h1>
            <div className="row">
                {Metrics.map((metric, index) => (
                    <div className="col-md-4">
                        <div className="card pref-card" onClick={() => AddPref(metric)} style={{backgroundColor: colors["color"+ index],
                            border: SelectedMetrics.includes(metric) ? "4px solid #000" : "4px solid #fff"
                        }}>
                            <p className="icon text-center">{icons[metric]}</p>
                            <h3 className='text-center'>{metric.replace(/_/g, " ")}</h3> 
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center pref-button-div mt-5">
                <button className="btn btn-light" onClick={SavePreferences}>Save Preferences</button>
            </div>
            </div>
	  </div>
	);
}  