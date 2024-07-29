import React from 'react';
import Tracker from '../Assets/Tracker.jpg';
import '../Styles/HomeStyles.css'; 
  
export const HomeComponent = () =>  {
	return (
	  <div>
        <div className='home-main-container'>
            <div className='text-container'>
                <h1> HEALTHSYNC </h1>
                <h3>A HEALTH TRACKER APPLICATION</h3>
                <p>Welcome to HealthSync, your comprehensive health tracker and wellness companion! Track your daily activities, sleep patterns, nutrition, and more with our user-friendly interface. 
                    Your journey to a healthier, happier you starts here. Let's embark on this journey together!</p>
            </div>
            <div className='image-container text-center'>
                <img src={Tracker} />
            </div>
        </div>
	  </div>
	);
  }