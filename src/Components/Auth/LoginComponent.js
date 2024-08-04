import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AuthStyles.css';
import Tracker from '../../Assets/Login.jpg';
import '../../Styles/ErrorStyles.css';
import { toast, ToastContainer } from 'react-toastify';
import api from '../../Services/Axios';
  
 export const LoginComponent = () =>  {

	const Navigate = useNavigate();

	const [LoginData, setLoginData] = useState({});
	const [ErrorData, setErrorData] = useState({});

	const onSubmit = async (e) => {
		e.preventDefault();
		if(ErrorData.email || ErrorData.password || !LoginData.email || !LoginData.password) {
			toast.error("Invalid Data");
			return;
		}

		try {
			var response = await api.post(`/User/LoginUser`, LoginData);
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("userID", response.data.userID);
			localStorage.setItem("name", response.data.userName);
			localStorage.setItem("role", response.data.role);
			localStorage.setItem("IsPreferenceSet", response.data.isPreferenceSet);

			if(response.data.role == "Admin")
				Navigate('/AdminDashBoard');
			else if(response.data.isPreferenceSet == true){
				if(response.data.role == "User")
					Navigate('/DashBoard');
				else if(response.data.role == "Coach")
					Navigate('/CoachDashBoard');
			}
			else
				Navigate('/UserPreferences');

		} catch (err) {
			console.log(err);
			if(err.response.data.errorMessage === "Your account is not activated yet")
				toast.error("Your account is not activated yet"); 
			else if(err.response.status == 401)
				toast.error("Invalid Credentials");
			else
				toast.error("Login failed");
		}

	}	

	const validateData = (e) => {
		setErrorData({...ErrorData, [e.target.name]: ""});

		if(e.target.name == "email"){
			const re_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			if(!re_email.test(e.target.value)) {
				setErrorData({...ErrorData, [e.target.name]: "Invalid Email ID"});
				return false;
			}
			return true;
		}
	}

	const onInputChange = (e) => {
		if(e.target.name == "password"){
			setLoginData({...LoginData, [e.target.name]: e.target.value});
			return;
		}
		if(validateData(e)){
			setLoginData({...LoginData, [e.target.name]: e.target.value});
		}
	}

	return (
	  <div className='auth-main-container'>
		<ToastContainer />
		<div className="auth-container">
			<div className='auth-image-container'>
				<img src={Tracker}></img>
			</div>

			<div className="auth-form-container">
				<h2 className='text-center'>WELCOME BACK AMIGO!</h2>
				<h4 className='text-center'>LOGIN</h4>
				<form onSubmit={(e) => onSubmit(e)}>
					<div className='login-container'>
						<div className='form-group col1'>
							<input type="email" placeholder="Email ID" name="email" 
							className='form-control' 
							style={{borderColor: (LoginData.email && !ErrorData.email) ? "green" : "red"}}
							onChange={(e)=>onInputChange(e)}/>
							<p className='error-msg'>{ErrorData.email}</p>
						</div>
						<div className='form-group col1'>
							<input type="password" placeholder="Password" name="password" 
							className='form-control' 
							style={{borderColor: LoginData.password ? "green" : "red"}}
							onChange={(e)=>onInputChange(e)}/>
						</div>
					</div>

					<div className='form-row login-button mt-2'>
						<button className='btn btn-light'>Login</button>
					</div>
				</form>
			</div>
		</div>
	  </div>
	);
  }  