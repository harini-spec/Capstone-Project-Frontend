import React from 'react';
import NotFound from '../../Assets/NotFound.gif';
import '../../Styles/ErrorStyles.css';
  
export const ErrorPageComponent = () =>  {
	return (
	  <div className='notfound-error-container'>
        <h1 className='mt-4'>404 Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <img className='mt-4' src={NotFound} alt="404 Not Found"/>
	  </div>
	);
  }  