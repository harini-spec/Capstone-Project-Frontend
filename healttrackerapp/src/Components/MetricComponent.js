import React, { useEffect, useState } from 'react';
import api from '../Services/Axios';
import '../Styles/MetricComponentStyles.css';
import { colors } from '../Data/ColorData';
import { icons } from '../Data/IconData';
  
const MetricComponent = (props) =>  {

    const [HealthLog, setHealthLog] = useState({});

    useEffect(() => {
        GetHealthLog(props.preference.preferenceId);
    }, [])

    const GetHealthLog = async (prefId) => {
        try{
            const yourConfig = {
                headers: {
                   Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            const response = await api.get(`HealthLog/GetHealthLog?PrefId=${prefId}`, yourConfig);

            if(response.data.healthStatus){
                response.data.healthStatus = response.data.healthStatus.replace(/_/g, " ")
            }
            else{
                response.data.targetStatus = "--";
            }

            if(response.data.targetStatus){
                response.data.targetStatus = response.data.targetStatus.replace(/_/g, " ")
            }
            else{
                response.data.targetStatus = "No Target Set";
            }

            setHealthLog(response.data);
        }
        catch(err){
            setHealthLog({value: "--", healthStatus: "--", targetStatus: "--"});
        }
    }

    return (
        <div className="MetricComponent" id={props.preference.preferenceId}>
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
                <div className="row">
                    <div className="col">
                        <p>Health Status</p>
                    </div>
                    <div className="col">
                        <p>Target Status</p>
                    </div>
                </div>
                <div className="row status-row">
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

                <div className="buttons-row">
                    {
                        HealthLog.healthStatus == "--"?
                            <button className="btn" style={{backgroundColor: colors["color" + props.index]}}>Add</button>
                        :
                            <button className="btn" style={{backgroundColor: colors["color" + props.index]}}>Update</button>
                    }
                </div>

            </div>
        </div>
    );
}
  
export default MetricComponent;  