import React, { useEffect, useState } from 'react';
import '../../Styles/DashBoardStyles.css';
import MetricComponent from './MetricComponent';
import GraphComponent from './GraphComponent';
import { useUserPreference } from '../hooks/useUserPreference';
import { MonthNamesData } from '../../Data/MonthNamesData';
import { ThreeCircles } from 'react-loader-spinner'
import "../../Styles/ComponentStyles.css";
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthService } from '../../Services/useAuthService';

export const DashBoardComponent = () => {

    const navigate = useNavigate();
    
    const [UserPreferences, setUserPreferences] = useUserPreference();
    const [Loading, setLoading] = useState(true);
    const [Role, IsExpired] = useAuthService();

    useEffect(() => {
        const checkAuthentication = () => {
            if (!localStorage.getItem("token") || IsExpired) {
                navigate('/Login');
                return;
            }
    
            if (localStorage.getItem("IsPreferenceSet") === "false") {
                navigate('/UserPreferences');
                return;
            }
    
            if (Role === "Coach") {
                navigate('/Login');
                return;
            }

            setTimeout(() => {
                setLoading(false);
            }, 3000);
        };

        checkAuthentication();
    }, [IsExpired, Role, navigate]);

    return (
        <div>
            <ToastContainer />
            {Loading ? 
                <div className='loading-container'>
                        <ThreeCircles
                            visible={true}
                            height="100"
                            width="100"
                            color="rgb(203, 133, 41)"
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