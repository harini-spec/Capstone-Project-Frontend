import React, { useEffect } from 'react';
import { useState } from 'react';
import api from '../Services/Axios';
import '../Styles/DashBoardStyles.css';
import MetricComponent from './MetricComponent';

const DashBoard = () => {
    
    const [UserPreferences, setUserPreferences] = useState([])

    useEffect(() => {
        getUserPreferences();
    }, [])

    const getUserPreferences = async () => {
        try{
            const yourConfig = {
                headers: {
                   Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            const response = await api.get(`Metric/GetPreferenceListOfUser`, yourConfig);
            setUserPreferences(response.data);
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div>
            <div className="MetricDiv">
                {
                    UserPreferences.map((preference, key) => {
                        return(
                                <MetricComponent key={preference.id} preference={preference} index={key}/>
                        )
                })
                }
            </div>
        </div>
    );
};

export default DashBoard;