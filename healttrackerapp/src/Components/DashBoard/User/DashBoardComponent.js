import React, { useEffect, useState } from 'react';
import MetricComponent from './MetricComponent';
import GraphComponent from './GraphComponent';
import { useUserPreference } from '../../hooks/useUserPreference';
import { MonthNamesData } from '../../../Data/MonthNamesData';
import { useAuthService } from '../../../Services/useAuthService';
import "../../../Styles/ComponentStyles.css";
import '../../../Styles/DashBoardStyles.css';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ThreeCircles } from 'react-loader-spinner'
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleFitComponent from '../../OAuth/GoogleFitComponent';
import GoogleFitData from '../../OAuth/GoogleFitData';

export const DashBoardComponent = () => {

    const navigate = useNavigate();
    const [token, setToken] = useState(null);

    const handleOAuthLoginSuccess = (access_token) => {
      setToken(access_token);
      console.log("Yolo:", access_token);
    };  
    
    const [UserPreferences, setUserPreferences] = useUserPreference(localStorage.getItem("userID"));
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
            }, 2000);
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
                    <div className='overview-header-line'>
                        <p className='date-para'>{MonthNamesData[new Date().getMonth()]} {new Date().getDate()}, {new Date().getFullYear()}</p>
                        <div className='google-fit-container'>
                            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                                <GoogleFitComponent handleLoginSuccess={handleOAuthLoginSuccess} />
                                {token && <GoogleFitData token={token} />}
                            </GoogleOAuthProvider>
                        </div>
                    </div>
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