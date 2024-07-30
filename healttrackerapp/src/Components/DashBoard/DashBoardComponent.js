import React, { useEffect } from 'react';
import { useState } from 'react';
import '../../Styles/DashBoardStyles.css';
import MetricComponent from './MetricComponent';
import GraphComponent from './GraphComponent';
import { useUserPreference } from '../hooks/useUserPreference';
import { MonthNamesData } from '../../Data/MonthNamesData';
import { ThreeCircles } from 'react-loader-spinner'
import "../../Styles/ComponentStyles.css";

export const DashBoardComponent = () => {
    
    const [UserPreferences, setUserPreferences] = useUserPreference();
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    return (
        <div>
            {Loading ? 
                <div className='loading-container'>
                        <ThreeCircles
                            visible={true}
                            height="100"
                            width="100"
                            color="rgb(83,178,225)"
                            ariaLabel="three-circles-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                </div>
                        :
            <div className='dashboard-main-container'>
                <div className='overview-header'>
                    <h2>Health Overview</h2>
                    <p className='date-para'>{MonthNamesData[new Date().getMonth()]} {new Date().getDate()}, {new Date().getFullYear()}</p>
                </div>
                <div className="MetricDiv">
                    {
                        UserPreferences.map((preference, key) => {
                            return(
                                <MetricComponent key={preference.id} preference={preference} index={key}/>
                            )
                    })
                    }
                </div>
                <GraphComponent UserId={localStorage.getItem("userID")}/>
            </div>
            }
        </div>
    );
};