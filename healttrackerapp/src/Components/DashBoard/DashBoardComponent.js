import React, { useEffect } from 'react';
import { useState } from 'react';
import api from '../../Services/Axios';
import '../../Styles/DashBoardStyles.css';
import MetricComponent from './MetricComponent';
import GraphComponent from './GraphComponent';
import { useUserPreference } from '../hooks/useUserPreference';
import { MonthNamesData } from '../../Data/MonthNamesData';

export const DashBoardComponent = () => {
    
    const [UserPreferences, setUserPreferences] = useUserPreference();

    return (
        <div>
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
    );
};