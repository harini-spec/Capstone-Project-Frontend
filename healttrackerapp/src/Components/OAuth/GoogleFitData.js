import React, { useState, useEffect } from 'react';
import api from '../../Services/Axios';

const GoogleFitData = ({ token }) => {
  const [data, setData] = useState({
    steps: null,
    caloriesExpended: null,
    calorieIntake: null,
    weight: null,
    height: null,
    sleep: null,
  });

  useEffect(() => {
    addAccessTokenToDB(token);
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
              { dataTypeName: 'com.google.nutrition' },
              { dataTypeName: 'com.google.sleep.segment' },
              { dataTypeName: 'com.google.weight' },
              { dataTypeName: 'com.google.height' },
            ],
            bucketByTime: { durationMillis: 86400000 }, // Bucket by day
            startTimeMillis: new Date(startTime).getTime(),
            endTimeMillis: new Date(endTime).getTime(),
          }),
        });

        // console.log("Start Time:", new Date(startTime).getTime(), "End Time:", new Date(endTime).getTime());
        const result = await response.json();
        // console.log("Today's data:", result);

        const aggregateData = (dataTypeName, isMapVal = false, mapKey = '') => {
          const relevantDataSet = result.bucket.flatMap(bucket => 
            bucket.dataset.filter(dataset => dataset.dataSourceId.includes(dataTypeName))
          );

          return relevantDataSet.reduce((acc, dataSet) => {
            const total = dataSet.point.reduce((pointAcc, point) => {
              if (isMapVal) {
                return pointAcc + (point.value[0].mapVal.find(val => val.key === mapKey)?.value.fpVal || 0);
              }
              if (dataTypeName === 'com.google.height' || dataTypeName === 'com.google.weight') {
                return pointAcc + point.value.slice(-1)[0]?.fpVal || 0;
              }
              return pointAcc + point.value.reduce((valueAcc, value) => {
                return valueAcc + (value.fpVal || value.intVal || 0);
              }, 0);
            }, 0);
            return acc + total;
          }, 0);
        };


        // console.log("Steps:", aggregateData('com.google.step_count.delta'));
        setData({
          steps: aggregateData('com.google.step_count.delta'),
          caloriesExpended: aggregateData('com.google.calories.expended'),
          calorieIntake: aggregateData('com.google.nutrition', true, 'calories'),
          weight: aggregateData('com.google.weight'),
          height: aggregateData('com.google.height'),
          sleep: aggregateData('com.google.sleep.segment'),
        });

      } catch (error) {
        console.error('Error fetching today\'s data:', error);
      }
    };

    if (token) {
      fetchTodayData();
    }
  }, [token]);

    const addAccessTokenToDB = async (token) => {
        try {
            const yourConfig = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };
            const response = await api.post(`OAuth/AddOrUpdateOAuthAccessToken`, {accessToken: token}, yourConfig);
            if(response.status === 200) {
                console.log("Access Token added to DB successfully");
            }
        } catch (err) {
            console.log(err);
        }
    };

  return (
    <div>
      {data.steps !== null ? (
        <div>
          <p>Today's Step Count: {data.steps}</p>
          <p>Today's Calories Expended: {data.caloriesExpended} kcal</p>
          <p>Today's Calorie Intake: {data.calorieIntake} kcal</p>
          <p>Today's Weight: {data.weight} kg</p>
          <p>Today's Height: {data.height} m</p>
          <p>Today's Sleep: {data.sleep} hours</p>
        </div>
      ) : (
        <p>Loading today's data...</p>
      )}
    </div>
  );
};

export default GoogleFitData;
