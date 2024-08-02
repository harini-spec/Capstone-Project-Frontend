import React, { useState, useEffect } from 'react';
import api from '../../Services/Axios';

const GoogleFitData = ({ token, setIsDataLogged }) => {
  const [data, setData] = useState({
    steps: null,
    caloriesExpended: null,
    sleep: null
  });

  useEffect(() => {
    if (!token) return; // Exit if token is not available

    console.log("Access Token:", token);

    const fetchTodayData = async () => {
      const now = new Date();
      const startTime = new Date(now.setHours(0, 0, 0, 0)).toISOString(); // Start of today
      const endTime = new Date().toISOString(); // Current time

      try {
        const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            aggregateBy: [
              { dataTypeName: 'com.google.step_count.delta' },
              { dataTypeName: 'com.google.calories.expended' },
              { dataTypeName: 'com.google.sleep.segment' },
            ],
            bucketByTime: { durationMillis: 86400000 }, // Bucket by day
            startTimeMillis: new Date(startTime).getTime(),
            endTimeMillis: new Date(endTime).getTime(),
          }),
        });

        const result = await response.json();

        const aggregateData = (dataTypeName, isMapVal = false, mapKey = '') => {
          const relevantDataSet = result.bucket.flatMap(bucket => 
            bucket.dataset.filter(dataset => dataset.dataSourceId.includes(dataTypeName))
          );

          return relevantDataSet.reduce((acc, dataSet) => {
            const total = dataSet.point.reduce((pointAcc, point) => {
              if (isMapVal) {
                return pointAcc + (point.value[0].mapVal.find(val => val.key === mapKey)?.value.fpVal || 0);
              }
              return pointAcc + point.value.reduce((valueAcc, value) => {
                return valueAcc + (value.fpVal || value.intVal || 0);
              }, 0);
            }, 0);
            return acc + total;
          }, 0);
        };

        setData({
          steps: aggregateData('com.google.step_count.delta'),
          caloriesExpended: aggregateData('com.google.calories.expended'),
          sleep: aggregateData('com.google.sleep.segment'),
        });

      } catch (error) {
        console.error('Error fetching today\'s data:', error);
      }
    };

    fetchTodayData();
  }, [token]);

  useEffect(() => {
    if (data.steps !== null && data.caloriesExpended !== null && data.sleep !== null) {
      addLogToDB(data);
    }
  }, [data]);

  const addLogToDB = async () => {
    try {
      const yourConfig = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      };
      var logData = [
        { metricType: "Steps_Count", value: data.steps },
        { metricType: "Calories_Burned", value: data.caloriesExpended },
        { metricType: "Sleep_Hours", value: data.sleep }
      ];

      const response = await api.post(`HealthLog/AddHealthLogDataFromGoogleFit`, logData, yourConfig);
      if (response.status === 200) {
        console.log("Log added to DB successfully");
        setIsDataLogged(true); // Update state to indicate data has been logged
      }
    } catch (err) {
      console.log(err);
    }
  };

  return null; // Or some loading indicator if needed
};

export default GoogleFitData;
