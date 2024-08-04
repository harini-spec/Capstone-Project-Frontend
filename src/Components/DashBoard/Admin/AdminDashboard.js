import React, { useEffect, useState } from 'react';
import api from '../../../Services/Axios';
import "../../../Styles/AdminDashboardStyles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () =>  {
  const [InactiveCoaches, setInactiveCoaches] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    GetAllInactiveCoaches();
  }, []);

  const GetAllInactiveCoaches = async () => {
    const yourConfig = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    };

    try {
      var response = await api.get(`Admin/GetAllInactiveCoaches`, yourConfig);
      console.log(response.data);
      setInactiveCoaches(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  const ActivateCoach = async () => {
	const yourConfig = {
		headers: {
			Authorization: "Bearer " + localStorage.getItem("token")
		}
	};
	try{
		var response = await api.get(`Admin/GetAllInactiveCoaches`, yourConfig);
		console.log(response.data);
		setInactiveCoaches(response.data);
	}
	catch(err){
		console.log(err);
	}
}

  const handleImageClick = (imageSrc) => {
    setFullscreenImage(imageSrc);
    document.body.classList.add('blur-background');
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
    document.body.classList.remove('blur-background');
  };

  return (
    <div className="admin-dashboard-container">
      {fullscreenImage && (
        <>
          <div className="backdrop" onClick={handleCloseFullscreen}></div>
          <div className="fullscreen-container" onClick={handleCloseFullscreen}>
            <img src={fullscreenImage} alt="Fullscreen" />
          </div>
        </>
      )}
      <h1>Admin Dashboard</h1>
      <h5 className='text-center mb-4'>These Coaches are waiting for your approval</h5>
      
      <div className="row">
        {InactiveCoaches.length != 0 ? InactiveCoaches.map((coach, index) => {
          return (
            <div className='coach-card col-md-6' key={index}>
              <div className="card">
                <div className="card-body">
                  <div className='coach-details'>
                    <h5 className="card-title mb-3">{coach.name}</h5>
                    <p className="card-text">Age: {coach.age}</p>
                    <p className="card-text">Gender: {coach.gender}</p>
                    <p className="card-text">Phone: {coach.phone}</p>
                    <p className="card-text">Email: {coach.email}</p>
                    <button className='btn btn-success mt-3' onClick={ActivateCoach}><FontAwesomeIcon icon={faCheck} /></button>
                  </div>
                  <div className='coach-certificate'>
                    {
                      coach.certificate === null 
                        ? <p>No certificate uploaded</p> 
                        : <img src={coach.certificate} alt="Uploaded" onClick={() => handleImageClick(coach.certificate)} />
                    }
                  </div>
                </div>
              </div>
            </div>
          );
        })
		:
			<div className='alert alert-success'>No Coaches to Approve!</div>
	}
      </div>
    </div>
  );
}

export default AdminDashboard;
