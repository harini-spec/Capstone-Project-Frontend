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
import api from '../../../Services/Axios';

export const DashBoardComponent = () => {

    const navigate = useNavigate();
    const [isDataLogged, setIsDataLogged] = useState(false);
    const [token, setToken] = useState(null);

    const addAccessTokenToDB = async (token) => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };
            const response = await api.post(`OAuth/AddOrUpdateOAuthAccessToken`, {accessToken: token}, yourConfig);
            if(response.status === 200) {
                console.log("Access Token added to DB successfully");
                setIsTokenPresent(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleOAuthLoginSuccess = (access_token) => {
      setToken(access_token);
      addAccessTokenToDB(access_token);
      console.log("Yolo:", access_token);
    };  
    
    const [UserPreferences, setUserPreferences] = useUserPreference(localStorage.getItem("userID"));
    const [Loading, setLoading] = useState(true);
    const [Role, IsExpired] = useAuthService();
    const [IsTokenPresent, setIsTokenPresent] = useState(false);

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

            checkIfAccessTokenExistsAndAddGFitDataToDB();
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        };

        checkAuthentication();
    }, [IsExpired, Role]);

    const checkIfAccessTokenExistsAndAddGFitDataToDB = async () => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };
            const response = await api.get(`OAuth/GetValidOAuthAccessToken`, yourConfig);
            if(response.status === 200) {
                setIsTokenPresent(true);
                setToken(response.data.accessToken);
            }
        }
        catch (err) {
            setIsTokenPresent(false);
        }
    }

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
                                {!IsTokenPresent && <GoogleFitComponent handleLoginSuccess={handleOAuthLoginSuccess} />}
                                {token && <GoogleFitData token={token} setIsDataLogged={setIsDataLogged} />}
                            </GoogleOAuthProvider>
                        </div>
                    </div>
                </div>
                <div className="MetricDiv">
                    {
                        UserPreferences.map((preference, key) => {
                            return(
                                <MetricComponent key={preference.id} preference={preference} index={key} isDataLogged={isDataLogged}/>
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