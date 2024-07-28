import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../Services/Axios.js';
import '../../Styles/TargetStyles.css';
import { toast, ToastContainer } from 'react-toastify';
import { useMetric } from '../hooks/useMetric.js';
import { useHealthLog } from '../hooks/useHealthLog.js';

export const GetAllTargetsComponent = () =>  {

    const { PrefId } = useParams();

    const [HealthLog, setHealthLog] = useHealthLog(PrefId, true);
    const [Targets, setTargets] = useState([]);
    const [ErrorMsg, setErrorMsg] = useState("");
    const [Metric, setMetric] = useMetric(PrefId);

    useEffect(() => {
        GetAllTargets();
    }, [Targets]);

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
	  <div className='target-container'>
        <ToastContainer />
        <h1 className='text-center pt-5'>{Metric.metricType} Targets</h1>
            <div className='button-row d-flex flex-row-reverse'>
                <button className='btn btn-primary'>
                    <Link className='link' to={`/AddTarget/${PrefId}`}>
                        Add Target
                    </Link>
                </button>
            </div>

            <div className='row pt-5'>
                <div className='col'>
                    <h4>Target No.</h4>
                </div>
                <div className='col'>
                    <h4> Min Value </h4>
                </div>
                <div className='col'>
                    <h4> Max Value </h4>
                </div>
                <div className='col'>
                    <h4> Target Date </h4>
                </div>
                <div className='col'>
                    <h4> Status </h4>
                </div>
                <div className='col-2 text-center'>
                    <h4> Actions </h4>
                </div>
            </div>
            <hr></hr>

            {ErrorMsg ? <div className='alert alert-danger'>{ErrorMsg}</div> : 
                <div>
                    {Targets.map((target, index) => (
                        <div className='row mt-4' id={target.id}>
                            <div className='col'>
                                <p>{index + 1}</p>
                            </div>
                            <div className='col'>
                                <p>{target.targetMinValue} {Metric.metricUnit} {}</p>
                            </div>
                            <div className='col'>
                                <p>{target.targetMaxValue} {Metric.metricUnit}</p>
                            </div>
                            <div className='col'>
                                <p>{target.targetDate.slice(0,10)}</p>
                            </div>
                            <div className='col'>
                                <div className="target-status-div">
                                    <p style={{backgroundColor: target.targetStatus == "Achieved" ? "rgb(77, 188, 99)" : "rgb(179, 188, 77)"}}>
                                        {target.targetStatus.replace("_", " ")}
                                    </p>
                                </div>
                            </div>
                            <div className='col-2 text-center'>
                                <button className='btn btn-primary update'>
                                    <Link className='link' to={`/UpdateTarget/${target.preferenceId}/${target.id}`}>
                                        Update
                                    </Link>
                                </button>
                                <button className='btn btn-danger' onClick={() => {DeleteTarget(target.id)}}>Delete</button>
                            </div>
                            <hr></hr>
                        </div>
                    ))}
                </div>
            }
	  </div>
	);
  }  