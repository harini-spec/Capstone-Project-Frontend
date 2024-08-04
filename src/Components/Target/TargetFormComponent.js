import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { icons } from '../../Data/IconData.js';
import api from '../../Services/Axios.js';
import { useMetric } from '../hooks/useMetric.js';
import { toast, ToastContainer } from 'react-toastify';
import { useColor } from '../hooks/useColor.js';
import { useAuthService } from '../../Services/useAuthService.js';
import '../../Styles/ErrorStyles.css';

export const TargetFormComponent = (props) =>  {

    const { PrefId, TargetId } = useParams();
    const Navigate = useNavigate();

    const [Role, IsExpired] = useAuthService();
    const [Color, setColor] = useColor();
    const [Metric] = useMetric(PrefId);
    const [Target, setTarget] = useState({
        preferenceId: PrefId,
        targetMinValue: "",
        targetMaxValue: "",
        targetDate: ""
    });

    useEffect(() => {
        const checkAuthentication = () => {
            if (!localStorage.getItem("token") || IsExpired || Role === "Coach") {
                Navigate('/Login');
                return;
            }
    
            if (Role === "Coach" || Role === "Admin") {
                Navigate('/Login');
                return;
            }

            if (localStorage.getItem("IsPreferenceSet") === "false") {
                Navigate('/UserPreferences');
                return;
            }

            if(props.isUpdateMode){
                GetTargetById();
            }
        };

        checkAuthentication();
    }, [IsExpired, Role, Navigate]);

    const GetTargetById = async () => {
        try{
            const yourConfig = {
                headers: {
                   Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            const response = await api.get(`Target/GetTargetById?TargetId=${TargetId}`, yourConfig);
            setTarget(response.data);
        }
        catch(err){
            toast.error("Target Not found!");
            Navigate(`/Alltargets/${PrefId}`);
        }          
    }

    const validateValues = () => {
        var min = document.getElementById("min-form").value;
        var max = document.getElementById("max-form").value;
        var date = document.getElementById("date-form").value;
        if(min === "" || min === null || min === undefined || min < 0 || max === "" || max === null || max === undefined || max < 0 || date === "" || date === null || date === undefined){
            return false;
        }
        return true;
    }

    const onInputChange = (e) => {
        validateValues();
        setTarget({...Target, [e.target.name]: e.target.value});
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(validateValues()){
            const yourConfig = {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            if(props.isUpdateMode){
                try{
                    const updatedTarget = {
                        ...Target,
                        targetId: TargetId
                    };

                    const response = await api.put("Target/UpdateTarget", updatedTarget, yourConfig);
                    if(response.status === 200){
                        toast.success('Target Updated Successfully');
                    }
                    setTimeout(() => {
                        Navigate('/Alltargets/'+PrefId); 
                    }, 4000);
                }
                catch(err){
                    if(err.response && err.response.status === 422){
                        toast.error("Can't add Target in past date");
                    }
                    else if(err.response && err.response.status === 404){
                        toast.error("Target Not Found");
                    }
                    else if(err.response.status === 409){
                        toast.error("Target Already Added for this date!");
                    }
                    else{
                        toast.error("Something went wrong!");
                    }
                }
            }
            else{
                try{
                    const response = await api.post("Target/AddTarget", Target, yourConfig);
                    if(response.status === 200){
                        toast.success('Target Added Successfully');
                    }
                    setTimeout(() => {
                        Navigate('/Alltargets/'+PrefId); 
                    }, 4000);
                }
                catch(err){
                    if(err.response && err.response.status === 422){
                        toast.error("Can't add Target in past date");
                    }
                    else if(err.response && err.response.status === 404){
                        toast.error("Preference Not Found");
                    }
                    else if(err.response && err.response.status === 409){
                        toast.error("Target Already Added for this date!");
                    }
                    else{
                        toast.error("Something went wrong!");
                    }
                }
            }
        }
        else{
            toast.error("Enter correct Target Values");
        }
    }

    return (
        <div>
            <div>
                <ToastContainer />
                <div className='container'>
                    <div className='row'>
                        <div className='card col-md-6 offset-md-3 offset-md-3'>
                            <br/>
                            <h3 className='text-center' style={{color: Color}}> {Metric.metricType && icons[Metric.metricType]} {Metric.metricType && Metric.metricType.replace(/_/g, " ")}</h3>
                            <div className='card-body'>
                                <h6 className="log-header pb-3 text-center">Target Details</h6>

                                <form onSubmit={(e) => onSubmit(e)}>
                                    <div className='form-row pb-4'>
                                            <div className='form-group col1'>
                                                <input type="number" placeholder="Min Value" name="targetMinValue" 
                                                className='form-control' value={Target.targetMinValue}
                                                step="0.01"
                                                id="min-form"
                                                onChange={(e)=>onInputChange(e)}/>
                                            </div>
                                            <div className='col2'>
                                                <p>{Metric.metricUnit}</p>
                                            </div>
                                    </div>
                                    <div className='form-row pb-4'>
                                            <div className='form-group col1'>
                                                <input type="number" placeholder="Max Value" name="targetMaxValue" 
                                                className='form-control' value={Target.targetMaxValue}
                                                step="0.01"
                                                id="max-form"
                                                onChange={(e)=>onInputChange(e)}/>
                                            </div>
                                            <div className='col2'>
                                                <p>{Metric.metricUnit}</p>
                                            </div>
                                    </div>
                                    <div className='form-row pb-4'>
                                            <div className='form-group col1'>
                                                <input type="date" placeholder="Target Date" name="targetDate" 
                                                className='form-control' value={Target.targetDate.slice(0, 10)}
                                                id="date-form"
                                                onChange={(e)=>onInputChange(e)}/>
                                            </div>
                                    </div>
                                    <div className='button-row pb-2'>
                                    <button className='btn' style={{ backgroundColor: Color }}>
                                        {props.isUpdateMode ? "Update" : "Add"}
                                    </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
}  