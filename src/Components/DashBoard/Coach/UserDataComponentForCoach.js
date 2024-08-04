import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThreeCircles } from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import { useAuthService } from '../../../Services/useAuthService';
import GraphComponent from '../User/GraphComponent';
import '../../../Styles/UserDataStyles.css';
import '../../../Styles/UserDataStyles.css';
import api from '../../../Services/Axios';
  
export const UserDataComponentForCoach = () =>  {

    const { UserId } = useParams();
    const navigate = useNavigate();
    const [Role, IsExpired] = useAuthService();

    const [UserData, setUserData] = useState({});
    const [SuggestionData, setSuggestionData] = useState({userId: UserId, suggestion: ""});
    const [ErrorData, setErrorData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [CoachSuggestions, setCoachSuggestions] = useState([]);

    useEffect(() => {
        const checkAuthentication = () => {
            if (!localStorage.getItem("token") || IsExpired) {
                navigate('/Login');
                return;
            }

            if (Role === "User" || Role === "Admin") {
                navigate('/Login');
                return;
            }
    
            if (localStorage.getItem("IsPreferenceSet") === "false") {
                navigate('/UserPreferences');
                return;
            }
            
            if(Role == "Coach"){
                fetchUserData();
                fetchSuggestionData();
                setIsLoading(false);
            }
        };
        checkAuthentication();
    }, [IsExpired, Role, navigate, SuggestionData]);

    const fetchUserData = async () => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };
            const response = await api.get(`Problem/GetProblemsOfUserId?UserId=${UserId}`, yourConfig);

            setUserData(response.data);
        } catch (err) {
            if(err.response.status === 404 && err.response.data === "No Problem Logs for today!") {
                setErrorData({LogError:"No Problem Logs for today!"});
            }
            else{
                toast.error("An error occurred while fetching data!");
            }
        }
    }

    const fetchSuggestionData = async () => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };
            const response = await api.get(`Problem/GetCoachSuggestionsForUser?UserId=${UserId}`, yourConfig);

            setCoachSuggestions(response.data);
        } catch (err) {
            if(err.response.status === 404) {
                setErrorData({SuggestionError: "No Suggestions found!"});
            }
            else{
                toast.error("An error occurred while fetching data!");
            }
        }
    }

    const addSuggestion = async () => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };
            const response = await api.post(`Problem/AddSuggestion`, SuggestionData, yourConfig);
            setTimeout(() => {
                toast.success("Suggestion added successfully!");
            }, 2000);
            navigate('/CoachDashBoard');
        } catch (err) {
            if(err.response.status === 422) {
                toast.error("Can't add suggestions for Coach!");
            }
            else{
                toast.error("An error occurred while adding suggestion!");
            }
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(SuggestionData.suggestion === ""){
            toast.error("Please enter a suggestion!");
            return;
        }
        addSuggestion();
    }

    const onInputChange = (e) => {
        setSuggestionData({...SuggestionData, [e.target.name]: e.target.value});
    }

	return (
	  <div>
        <ToastContainer />
        {isLoading && <div className='loading-container'>
                    <ThreeCircles
                    visible={true}
                    height="100"
                    width="100"
                    color="rgb(203, 133, 41)"
                    ariaLabel="three-circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />
            </div>}

        {ErrorData.LogError && !isLoading ? <div className='alert alert-success mt-4'>No Problem Logs for today!</div>:
            <div className="userdata-main-container">
                <h2 className='text-center mt-4 mb-4'>User Report</h2>
                <div className='userdata-container' id={UserId}>
                    <div className='userdata-row'>
                        <div className='userdata-item-row'>
                            <h4>Name: </h4>
                            <p>{UserData.userName}</p>
                        </div>
                        <div className='userdata-item-row'>
                            <h4>Age: </h4>
                            <p>{UserData.age}</p>
                        </div>
                        <div className='userdata-item-row'>
                            <h4>Gender: </h4>
                            <p>{UserData.gender}</p>
                        </div>
                    </div>

                    <h4>Problems</h4>
                    <div className='problem-container'>
                        {UserData.metricsWithProblem && UserData.metricsWithProblem.map((problemMetric, index) => {
                            return (
                                <div key={index} className='problem-row'>
                                    {problemMetric.replace(/_/g, " ")}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='graph-container'>
                    <GraphComponent UserId={UserId}/>
                </div>
                <div className='Suggestion-container'>
                    <h2 className='text-center mt-4 mb-4'>Your Suggestions</h2>
                    {
                        ErrorData.SuggestionError && !isLoading ? <div className='alert alert-success mt-4'>No Suggestions found!</div>:
                        <div className='coach-suggestion-container'>
                            {CoachSuggestions && CoachSuggestions.map((suggestion, index) => {
                                return (
                                    <div key={index} className='coach-suggestion-row'>
                                        <p className='coach-sugg-desc'>{suggestion.description}</p>
                                        <p className='coach-sugg-date'>{suggestion.created_at.split("T")[0]}</p>
                                    </div>
                                )
                         })}
                        </div>
                    }
                    
                        <form onSubmit={(e) => onSubmit(e)}>
                            <div className='suggestion-form-container'>
                                <div className='form-group input-col'>
                                    <input type="text" placeholder="Your Suggestion" name="suggestion" 
                                    className='form-control' 
                                    onChange={(e)=>onInputChange(e)}/>
                                </div>
                                <div className='form-group btn-col'>
                                    <button className='btn btn-primary'>Add Suggestion</button>
                                </div>
                            </div>
                        </form>

                </div>

            </div>
        }

	  </div>
	);
  }  