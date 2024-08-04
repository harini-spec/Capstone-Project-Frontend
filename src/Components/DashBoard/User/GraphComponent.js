import React, { useEffect, useState, useRef } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import { CChart } from '@coreui/react-chartjs';
import { ToastContainer } from 'react-toastify';
import "../../../Styles/ComponentStyles.css";
import '../../../Styles/GraphStyles.css';
import { useUserPreference } from '../../hooks/useUserPreference';
import api from '../../../Services/Axios';

const GraphComponent = (props) => {
    
    const [UserPreferences] = useUserPreference(props.UserId);
    const [Category, setCategory] = useState("Sleep_Hours");
    const [Duration, setDuration] = useState("Overall");
    const [ErrorMsg, setErrorMsg] = useState("");

    const [Dates, setDates] = useState([]);
    const [LogValue, setLogValue] = useState([]);
    const [MinRequirement, setMinRequirement] = useState([]);
    const [MaxRequirement, setMaxRequirement] = useState([]);

    const [Loading, setLoading] = useState(true);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            if (isFetchingRef.current) return; 
            isFetchingRef.current = true;
            setLoading(true);

            try {
                const yourConfig = {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                };

                setErrorMsg("");

                // Fetch Graph Data
                const response = await api.get(`Graph/GetGraphData?MetricType=${Category}&Duration=${Duration}&UserId=${props.UserId}`, yourConfig);

                // Process Graph Data
                const dates = [];
                const logValues = [];
                if (Array.isArray(response.data) && response.data.length > 0) {
                    response.data.forEach(item => {
                        dates.push(item.logDate.split("T")[0]);
                        logValues.push(item.value);
                    });
                    setDates(dates);
                    setLogValue(logValues);
                }

                // Fetch Min and Max Data
                if(Category === "Height" || Category === "Weight") {
                    setMinRequirement([]);
                    setMaxRequirement([]);
                    return;
                }
                const minMaxResponse = await api.get(`Graph/GetGraphDataRange?MetricType=${Category}`, yourConfig);
                const minRequirement = [];
                const maxRequirement = [];
                if (Array.isArray(response.data) && response.data.length > 0) {
                    for (let i = 0; i < response.data.length; i++) {
                        minRequirement.push(minMaxResponse.data.minValue);
                        maxRequirement.push(minMaxResponse.data.maxValue);
                    }
                    setMinRequirement(minRequirement);
                    setMaxRequirement(maxRequirement);
                }
            } catch (err) {
                if(err.response && err.response.status === 404) {
                    setErrorMsg("No data found!");
                }
            } finally {
                isFetchingRef.current = false;
                setLoading(false);
            }
        };

        fetchData();
    }, [Category, Duration, props.UserId]);

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <div className='graph-div'>
            <ToastContainer />
            <div className='category-div'>
                <h2 className='category-header'>Activity Growth</h2>
                <div className='category'>
                    <select value={Category} onChange={handleCategoryChange} id="category">
                        {UserPreferences.map(preference => (
                            <option key={preference.preferenceId} value={preference.metricType}>
                                {preference.metricType.replace(/_/g, " ")}
                            </option>
                        ))}
                    </select>

                    <select value={Duration} onChange={handleDurationChange} id="duration">
                        <option value="This Week">This Week</option>
                        <option value="Last Week">Last Week</option>
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="Overall">Overall</option>
                    </select>
                </div>
            </div>

            {(!Loading && !ErrorMsg) && (
                <CChart
                    type="line" 
                    data={{
                        labels: Dates,
                        datasets: [
                            {
                                label: Category.replace(/_/g, " "),
                                backgroundColor: "rgb(203, 133, 41)",
                                borderColor: "rgb(203, 133, 41)",
                                pointBackgroundColor: "rgb(203, 133, 41)",
                                pointBorderColor: "#fff",
                                pointRadius: 7,
                                data: LogValue
                            },
                            ...(Category !== "Height" && Category !== "Weight" ? [
                                {
                                    label: "Min Requirement",
                                    backgroundColor: "rgba(161, 158, 158, 0.2)",
                                    borderColor: "rgba(220, 220, 220, 1)",
                                    pointBackgroundColor: "rgba(220, 220, 220, 1)",
                                    pointBorderColor: "#fff",
                                    pointRadius: 7,
                                    data: MinRequirement,
                                    fill: {
                                        target: 2,
                                        below: 'rgba(150, 150, 150, 0.2)'
                                    }
                                },
                                {
                                    label: "Max Requirement",
                                    backgroundColor: "rgba(161, 158, 158, 0.2)",
                                    borderColor: "rgba(220, 220, 220, 1)",
                                    pointBackgroundColor: "rgba(220, 220, 220, 1)",
                                    pointBorderColor: "#fff",
                                    pointRadius: 7,
                                    data: MaxRequirement,
                                }
                            ] : [])
                        ],
                    }}
                />
            )}
            {
                ErrorMsg &&
                <div className='alert alert-danger'>{ErrorMsg}</div>
            }
            {Loading && <div className='loading-container'>
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
        </div>
    );
};

export default GraphComponent;
