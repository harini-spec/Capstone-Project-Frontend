import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { icons } from '../../Data/IconData.js';
import api from '../../Services/Axios.js';
import { toast, ToastContainer } from 'react-toastify';
import '../../Styles/LogStyles.css';
import { useMetric } from '../hooks/useMetric.js';
import { useHealthLog } from '../hooks/useHealthLog.js';
import { useColor } from '../hooks/useColor.js';
import '../../Styles/ErrorStyles.css';
import { useAuthService } from '../../Services/useAuthService.js';

export const HealthLogComponent = (props) => {

    const navigate = useNavigate();

    const [Role, IsExpired] = useAuthService();
    const { PrefId, HealthLogId } = useParams();
    const Navigate = useNavigate();

    const [Color, setColor] = useColor();
    const [Metric] = useMetric(PrefId);
    const [ErrorMsg, setErrorMsg] = useState("");
    const [Log, setLog] = useHealthLog(PrefId, props.isUpdateMode);

    useEffect(() => {
        const checkAuthentication = () => {
            if (!localStorage.getItem("token") || IsExpired || Role === "Coach") {
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
            console.log("Role: " + Role);
        };

        checkAuthentication();
    }, [IsExpired, Role, navigate]);

    const onInputChange = (e) => {
        setLog({...Log, [e.target.name]: e.target.value});
        validateValue();
    }

    const validateValue = () => {
        var value = document.getElementById("value-form").value;
        if(value === "" || value === null || value === undefined){
            setErrorMsg("Enter Log Value");
            return false;
        }
        else if(value < 0){
            setErrorMsg("Enter Positive Value");
            return false;
        }
        setErrorMsg("");
        return true;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(validateValue()){
            const yourConfig = {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            if(props.isUpdateMode){
                try{
                    const response = await api.put("HealthLog/UpdateHealthLog?logId="+HealthLogId+"&value="+Log.value, "", yourConfig);
                    if(response.status === 200){
                        toast.success('Log Updated Successfully');
                    }
                    setTimeout(() => {
                        Navigate('/DashBoard'); 
                    }, 4000);
                }
                catch(err){
                    if(err.response && err.response.status === 404){
                        toast.error("Log Not Found");
                    }
                    else if(err.response && err.response.status === 400 && err.response.data.errorMessage === "Height value is wrong!"){
                        toast.error("Enter correct Height!");
                    }
                }
            }
            else{
                try{
                    const response = await api.post("HealthLog/AddHealthLog", Log, yourConfig);
                    if(response.status === 200){
                        toast.success('Log Added Successfully');
                    }
                    setTimeout(() => {
                        Navigate('/DashBoard'); 
                    }, 4000);
                }
                catch(err){
                    if(err.response && err.response.status === 404 && err.response.data.errorMessage === "Height Log not entered"){
                        toast.error("Enter your Height First!");
                    }
                    else if(err.response && err.response.status === 409){
                        toast.error("Log Already Added");
                    }
                    else if(err.response && err.response.status === 400 && err.response.data.errorMessage === "Height value is wrong!"){
                        toast.error("Enter correct Height!");
                    }
                }
            }
        }
        else{
            toast.error("Enter correct Log Value");
        }
    }
  
    return (
      <div>
        <ToastContainer />
          <div className='container'>
              <div className='row'>
                  <div className='card col-md-6 offset-md-3 offset-md-3'>
                      <br/>
                      <h3 className='text-center' style={{color: Color}}> {Metric.metricType && icons[Metric.metricType]} {Metric.metricType && Metric.metricType.replace(/_/g, " ")}</h3>
                      <div className='card-body'>
                        <h6 className="log-header pb-3 text-center">{new Date().toJSON().slice(0, 10)} Log Details</h6>

                          <form onSubmit={(e) => onSubmit(e)}>
                            <div className='form-row'>
                                    <div className='form-group col1'>
                                        <input placeholder="Log Value" name="value" className={`form-control ${ErrorMsg ? "error" : ""}`} 
                                        value={Log.value && Log.value}
                                        step="0.01"
                                        type="number"
                                        id="value-form" onChange={(e)=>onInputChange(e)}/>
                                    </div>
                                    <div className='col2'>
                                        <p>{Metric.metricUnit}</p>
                                    </div>
                            </div>
                            <p className="error-msg pd-4" id="error-msg">{ErrorMsg}</p>
                            <div className='button-row pb-2'>
                            <button className='btn mt-4' style={{ backgroundColor: Color }}>
                                {props.isUpdateMode ? "Update" : "Add"}
                            </button>
                            </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>  
  )}