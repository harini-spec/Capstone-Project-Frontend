import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../Styles/MetricComponentStyles.css';
import { colors } from '../../../Data/ColorData';
import { icons } from '../../../Data/IconData';
import { useHealthLog } from '../../hooks/useHealthLog';
import { ToastContainer } from 'react-toastify';
  
const MetricComponent = (props) =>  {

    const [HealthLog, setHealthLog] = useHealthLog(props.preference.preferenceId, true);

    return (
        <div className="MetricComponent" id={props.preference.preferenceId}>
            <ToastContainer />
            <div className="header-row flex-row">
                <p className="icon" style={{color: colors["color"+ props.index]}}>{icons[props.preference.metricType]}</p>
                <p className="title">{props.preference.metricType.replace(/_/g, " ")}</p>
            </div>

            <div className="value-row flex-row">
                <p className="value">{HealthLog.value}</p>
                <p className="unit">{props.preference.metricUnit}</p>
            </div>  

            <hr></hr>

            <div className="status-div">
                <div className="row pb-2">
                    <div className="col">
                        <p>Health Status</p>
                    </div>
                    <div className="col">
                        <p>Target Status</p>
                    </div>
                </div>
                <div className="row status-row pb-3">
                    <div className="col">
                        <p className="status" 
                            style={{
                                color: HealthLog.healthStatus !== "--" ? "white" : "black",
                                backgroundColor: HealthLog.healthStatus !== "--" ? colors["color" + props.index] : undefined
                            }}>
                            {HealthLog.healthStatus}
                        </p>
                    </div>
                    <div className="col">
                        <p className="status" 
                            style={{
                                color: HealthLog.targetStatus !== "--" ? "white" : "black",
                                backgroundColor: HealthLog.targetStatus !== "--" ? colors["color" + props.index] : undefined
                            }}>
                            {HealthLog.targetStatus}
                        </p>
                    </div>
                </div>

                <div className="row">
                    <div className='col'>
                        {
                            HealthLog.healthStatus == "--"?
                                <button className="btn" style={{backgroundColor: colors["color" + props.index]}}>
                                    <Link className='link' to={`/AddHealthLog/${props.preference.preferenceId}`}>
                                        Add
                                    </Link>
                                </button>
                            :
                                <button className="btn" style={{backgroundColor: colors["color" + props.index]}}>
                                    <Link className='link' to={`/UpdateHealthLog/${props.preference.preferenceId}/${HealthLog.id}`}>
                                        Update
                                    </Link>
                                </button>
                        }
                    </div>
                    <div className='col'>
                        <button className="btn" style={{backgroundColor: colors["color" + props.index]}}>
                            <Link className='link' to={`/Alltargets/${props.preference.preferenceId}`}>
                                Targets
                            </Link>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
  
export default MetricComponent;  