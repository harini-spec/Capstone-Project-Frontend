import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "../../../Styles/AdminDashboardStyles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import api from '../../../Services/Axios';
import { useAuthService } from '../../../Services/useAuthService';

const AdminDashboard = () =>  {

  const navigate = useNavigate();
  const [InactiveCoaches, setInactiveCoaches] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [Role, IsExpired] = useAuthService();

  useEffect(() => {
      const checkAuthentication = () => {
        setTimeout(() => {
          console.log("Hello");
        }, 2000);

          if (!localStorage.getItem("token") || IsExpired || Role === "User" || Role === "Coach") {
              navigate('/Login');
              return;
          }
          GetAllInactiveCoaches();
      };
      checkAuthentication();
  }, [IsExpired, Role, navigate]);

  const GetAllInactiveCoaches = async () => {
    const yourConfig = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    };

    try {
      var response = await api.get(`Admin/GetAllInactiveCoaches`, yourConfig);
      setInactiveCoaches(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  const ActivateCoach = async (coachId) => {
	const yourConfig = {
		headers: {
		  Authorization: "Bearer " + localStorage.getItem("token")
		}
	  };
	try{
		var response = await api.put(`Admin/ActivateCoach?coachId=`+coachId, "", yourConfig);
		if(response.status === 200){
			toast.success("Coach Activated Successfully!");
		}
		GetAllInactiveCoaches();
	}
	catch(err){
		if(err.response.status === 422)
			toast.error(err.response.data);
		else 
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
	  <ToastContainer />
      
      <div className="row">
        {InactiveCoaches.length != 0 ? InactiveCoaches.map((coach, index) => {
          return (
            <div className='coach-card col-md-6' key={index}>
              <div className="card admin-card">
                <div className="card-body admin-card-body">
                  <div className='coach-details'>
                    <h5 className="card-title mb-3">{coach.name}</h5>
                    <p className="card-text">Age: {coach.age}</p>
                    <p className="card-text">Gender: {coach.gender}</p>
                    <p className="card-text">Phone: {coach.phone}</p>
                    <p className="card-text">Email: {coach.email}</p>
                    <button className='btn btn-success mt-3' onClick={() => ActivateCoach(coach.coachId)}><FontAwesomeIcon icon={faCheck} /></button>
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
