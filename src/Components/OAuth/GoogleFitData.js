import React, { useState, useEffect } from 'react';
import api from '../../Services/Axios';

const GoogleFitData = ({ token, setIsDataLogged, setLoggedData }) => {
  const [data, setData] = useState({
    steps_Count: null,
    calories_Burned: null,
    sleep: null,
    weight: null,
    height: null
  });

  useEffect(() => {
    if (!token) return; // Exit if token is not available

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

        return {
          steps_Count: aggregateData('com.google.step_count.delta'),
          calories_Burned: aggregateData('com.google.calories.expended'),
          sleep: aggregateData('com.google.sleep.segment'),
        };
      } catch (error) {
        console.error('Error fetching today\'s data:', error);
        return {};
      }
    };

    const fetchLatestWeightHeight = async () => {
      try {
        const weightResponse = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.weight:com.google.android.gms:merge_weight/datasets/0-9223372036854775807', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const weightResult = await weightResponse.json();
        const latestWeight = weightResult.point.slice(-1)[0]?.value[0]?.fpVal || null;

        const heightResponse = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.height:com.google.android.gms:merge_height/datasets/0-9223372036854775807', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const heightResult = await heightResponse.json();
        const latestHeight = heightResult.point.slice(-1)[0]?.value[0]?.fpVal || null;

        return {
          weight: latestWeight,
          height: latestHeight,
        };
      } catch (error) {
        console.error('Error fetching weight and height data:', error);
        return {};
      }
    };

    const fetchData = async () => {
      const todayData = await fetchTodayData();
      const weightHeightData = await fetchLatestWeightHeight();
      const combinedData = { ...todayData, ...weightHeightData };
      setData(combinedData);
      setLoggedData(combinedData);
    };

    fetchData();
  }, [token, setLoggedData]);

  useEffect(() => {
    if (data.steps_Count !== null && data.calories_Burned !== null && data.sleep !== null && data.weight !== null && data.height !== null) {
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
      const logData = [
        { metricType: "Steps_Count", value: data.steps_Count },
        { metricType: "Calories_Burned", value: data.calories_Burned },
        { metricType: "Sleep_Hours", value: data.sleep },
        { metricType: "Height", value: data.height },
        { metricType: "Weight", value: data.weight }
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
