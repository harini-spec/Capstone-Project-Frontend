import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../Services/Axios.js';
import '../../Styles/TargetStyles.css';
import { toast, ToastContainer } from 'react-toastify';
import { useMetric } from '../hooks/useMetric.js';
import { useHealthLog } from '../hooks/useHealthLog.js';
import { useAuthService } from '../../Services/useAuthService.js';  

export const GetAllTargetsComponent = () =>  {

    const { PrefId } = useParams();
    const navigate = useNavigate();

    const [HealthLog, setHealthLog] = useHealthLog(PrefId, true, false);
    const [Role, IsExpired] = useAuthService();
    const [Targets, setTargets] = useState([]);
    const [ErrorMsg, setErrorMsg] = useState("");
    const [Metric, setMetric] = useMetric(PrefId);

    useEffect(() => {
        const checkAuthentication = () => {
            if (!localStorage.getItem("token") || IsExpired || Role === "Coach") {
                navigate('/Login');
                return;
            }

                
            if (Role === "Coach" || Role === "Admin") {
                navigate('/Login');
                return;
            }
    
            if (localStorage.getItem("IsPreferenceSet") === "false") {
                navigate('/UserPreferences');
                return;
            }

            GetAllTargets();
        };

        checkAuthentication();
    }, [IsExpired, Role, navigate, Targets]);


    const GetAllTargets = async () => {
        try{
            const yourConfig = {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
                }
            }

            const response = await api.get(`Target/GetAllTargetsByPrefId?PrefId=${PrefId}`, yourConfig);
            setTargets(response.data);
        }
        catch(err){
            setErrorMsg("No Targets found!");
        }
    }

    const DeleteTarget = async (TargetId) => {
        try{
            const yourConfig = {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            const response = await api.delete(`Target/DeleteTargetById?TargetId=${TargetId}`, yourConfig);
            toast.success("Target Deleted Successfully!");
        }
        catch(err){
            setErrorMsg("Targets Not found!");
        }         
    }

    return (
        <div className='target-main-container'>
            <div className='target-container'>
                <ToastContainer />
                <h1 className='text-center'>{Metric.metricType} Targets</h1>
                <div className='button-row d-flex flex-row-reverse'>
                    <button className='btn btn-primary'>
                        <Link className='link' to={`/AddTarget/${PrefId}`}>
                            Add Target
                        </Link>
                    </button>
                </div>
                <hr></hr>
                <div className='row target-header pt-5'>
                    <div className='col'>
                        <h4>Target Date</h4>
                    </div>
                    <div className='col'>
                        <h4>Min Value</h4>
                    </div>
                    <div className='col'>
                        <h4>Max Value</h4>
                    </div>
                    <div className='col'>
                        <h4>Status</h4>
                    </div>
                    <div className='col-2 text-center'>
                        <h4>Actions</h4>
                    </div>
                </div>
                <hr className='target-header' />

                {ErrorMsg ? <div className='alert alert-danger'>{ErrorMsg}</div> : 
                    <div>
                        {Targets.map((target, index) => (
                            <div className='row target-row mt-4' key={target.id}>
                                <div className='col'>
                                    <div className='target-row-header'>Target Date</div>
                                    <p>{target.targetDate.slice(0, 10)}</p>
                                </div>
                                <div className='col'>
                                    <div className='target-row-header'>Min Value</div>
                                    <p>{target.targetMinValue} {Metric.metricUnit}</p>
                                </div>
                                <div className='col'>
                                    <div className='target-row-header'>Max Value</div>
                                    <p>{target.targetMaxValue} {Metric.metricUnit}</p>
                                </div>
                                <div className='col'>
                                    <div className='target-row-header'>Status</div>
                                    <div className="target-status-div">
                                        <p style={{backgroundColor: target.targetStatus === "Achieved" ? "rgb(77, 188, 99)" : "rgb(179, 188, 77)"}}>
                                            {target.targetStatus.replace(/_/g, " ")}
                                        </p>
                                    </div>
                                </div>
                                <div className='col-2 target-action-buttons'>
                                    <div className='target-row-header actions-header-row'>Actions:</div>
                                    <button className='btn btn-primary target-update'>
                                        <Link className='link' to={`/UpdateTarget/${target.preferenceId}/${target.id}`}>
                                            Update
                                        </Link>
                                    </button>
                                    <button className='btn btn-danger target-delete' onClick={() => {DeleteTarget(target.id)}}>Delete</button>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}
