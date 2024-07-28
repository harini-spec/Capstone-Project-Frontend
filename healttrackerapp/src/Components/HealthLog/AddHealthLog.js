import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { icons } from '../../Data/IconData.js';
import '../../Styles/LogStyles.css';
import api from '../../Services/Axios.js';
import { colors } from '../../Data/ColorData.js';
import { toast, ToastContainer } from 'react-toastify';

  export const AddHealthLog = (props) => {

    const { PrefId, HealthLogId } = useParams();
    const Navigate = useNavigate();

    const [Metric, setMetric] = useState({});
    const [Color, setColor] = useState("");
    const [Log, setLog] = useState({
        preferenceId: PrefId,
        value: 0
    });

    useEffect(() => {
        GetMetricData();
        GetColor();
        if(props.isUpdateMode){
            GetHealthLog();
        }
    }, []);

    const GetMetricData = async () => {
        try{
            const yourConfig = {
                headers: {
                   Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            const response = await api.get(`Metric/GetPreferenceDTOByPrefId?PrefId=${PrefId}`, yourConfig);
            setMetric(response.data);
        }
        catch(err){
            setMetric({MetricType: "--", MetricUnit: "--"});
        }
    }

    const GetHealthLog = async () => {
        try{
            const yourConfig = {
                headers: {
                   Authorization: "Bearer " + localStorage.getItem("token")
                }
            }
            const response = await api.get(`HealthLog/GetHealthLog?PrefId=${PrefId}`, yourConfig);
            setLog({
                preferenceId: PrefId,
                value: response.data.value
            });
        }
        catch(err){
            if(err.response && err.response.status === 404)
                toast.error("Log Not Found");
        }
    }

    const GetColor = () => {
        var keys = Object.keys(colors);
        setColor(colors[keys[ keys.length * Math.random() << 0]]);
    }

    const onInputChange = (e) => {
      setLog({...Log, [e.target.name]: e.target.value});
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const yourConfig = {
            headers: {
               Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        if(props.isUpdateMode){
            try{
                const response = await api.put("HealthLog/UpdateHealthLog?logId="+HealthLogId+"&value="+Log.value, "", yourConfig);
                if(response.status === 200){
                    toast.success('Log Updated Successfully', { timeOut: 0 });
                }
                setTimeout(() => {
                    Navigate('/DashBoard'); 
                }, 4000);
            }
            catch(err){
                if(err.response && err.response.status === 404){
                    toast.error("Log Not Found");
                }
            }
        }
        else{
            try{
                const response = await api.post("HealthLog/AddHealthLog", Log, yourConfig);
                if(response.status === 200){
                    toast.success('Log Added Successfully', { timeOut: 0 });
                }
                setTimeout(() => {
                    Navigate('/DashBoard'); 
                }, 4000);
            }
            catch(err){
                if(err.response && err.response.status === 409){
                    toast.error("Log Already Added");
                }
            }
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
                            <div className='form-row pb-4'>
                                    <div className='form-group col1'>
                                        <input placeholder="Log Value" name="value" className='form-control' value={Log.value && Log.value}
                                        onChange={(e)=>onInputChange(e)}/>
                                    </div>
                                    <div className='col2'>
                                        <p>{Metric.metricUnit}</p>
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
  )}