import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuthService } from '../../../Services/useAuthService';
import api from '../../../Services/Axios';
import { toast, ToastContainer } from 'react-toastify';
import '../../../Styles/CoachDashboardStyles.css';
import { ThreeCircles } from 'react-loader-spinner'
  
export const CoachDashBoard = () =>  {

    // UserId 
    const navigate = useNavigate();
    const [Role, IsExpired] = useAuthService();
    const [isLoading, setIsLoading] = useState(true);

    const [ProblemData, setProblemData] = useState([]);
    const [ErrorData, setErrorData] = useState([]);

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
    
            if (Role === "User") {
                navigate('/Login');
                return;
            }

            fetchProblemData();
        };
        checkAuthentication();
    }, [IsExpired, Role, navigate]);

    const fetchProblemData = async () => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };
            const response = await api.get(`Problem/GetProblems`, yourConfig);

            setProblemData(response.data);
        } catch (err) {
            if(err.response.status === 404 && err.response.data === "No Problem Logs for today!") {
                setErrorData("No Problem Logs for today!");
            }
            else{
                toast.error("An error occurred while fetching data!");
            }
        }
        setIsLoading(false);
    }

	return (
	  <div className='coach-dashboard-container'>
        <ToastContainer />
        <h1 className='text-center pt-4 pb-4'>COACH DASHBOARD</h1>
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

        {(ErrorData === "No Problem Logs for today!" || ProblemData.length == 0) && !isLoading ? <div className='alert alert-success mt-4'>No Problem Logs for today!</div>:
            <div className='problems-container'>
                {
                    ProblemData.map((problem, index) => (
                        <div className='problems-card' key={index}>
                            <div className='user-card-body'>
                                <h3>{problem.userName}</h3>
                                <div className='user-row'>
                                    <h6>Age: </h6> 
                                    <p>{problem.age}</p>
                                </div>
                                <div className='user-row'>
                                    <h6>Gender: </h6> 
                                    <p>{problem.gender}</p>
                                </div>
                                <hr></hr>
                            </div>
                            <div className='problems-card-body'>
                                <h6 className='text-center'>Problems</h6>
                                <div className='problems'>  
                                    {
                                        problem.metricsWithProblem.map((metric, index) => (
                                            <div className='problems-row' key={index}>
                                                <p>{metric.replace(/_/g, " ")}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='problems-card-footer text-center'>
                                <button className='btn btn-light'>
                                    <Link className='link' to={`/GetUserGraph/${problem.userId}`}>
                                        View Details
                                    </Link>
                                </button>
                            </div>
                        </div>
                ))}
            </div>
        }
	  </div>
	);
  }  