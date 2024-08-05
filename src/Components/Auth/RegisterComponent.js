import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import '../../Styles/AuthStyles.css';
import '../../Styles/ErrorStyles.css';
import Tracker from '../../Assets/Register.jpg';
import api from '../../Services/Axios';
  
 export const RegisterComponent = () =>  {

	const Navigate = useNavigate();

	const [RegisterData, setRegisterData] = useState({gender: "Male"});
	const [ErrorData, setErrorData] = useState({});
	const [SelectedFile, setSelectedFile] = useState(null);

	const selectRole = (Role) => {
		if(RegisterData.role == Role) {
			setRegisterData({...RegisterData, role	: ""});
			return;
		}
		setRegisterData({...RegisterData, role	: Role});
	}

	const onSubmit = async (e) => {
		e.preventDefault();
		if(ErrorData.name || ErrorData.age || ErrorData.phone || ErrorData.email || ErrorData.password || ErrorData.confirm_password) {
			toast.error("Invalid Data");
			return;
		}

		if(!RegisterData.name || !RegisterData.age || !RegisterData.phone || !RegisterData.email || !RegisterData.password || !RegisterData.confirm_password || !RegisterData.role) {
			toast.error("Invalid Data");
			return;
		}

		if(RegisterData.role == "Coach" && !SelectedFile) {
			toast.error("Upload Certificate");
			return;
		}

		try {
			var response = await api.post(`User/RegisterUser`, RegisterData);

            if (RegisterData.role === "Coach") {
                const formData = new FormData();
                formData.append('Certificate', SelectedFile);

                await api.post(`Coach/UploadCertificate?CoachId=${response.data}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

			toast.success("Registration successful");
			setTimeout(() => {
				Navigate('/Login'); 
			}, 4000);
		} catch (err) {
			if(err.response.status == 409)
				toast.error("Email ID already exists");
			else
				toast.error("Registration failed");
		}
	}	

	const validateData = (e) => {
		setErrorData({...ErrorData, [e.target.name]: ""});

		if(e.target.name == "name"){
			if(e.target.value.length < 3) {
				setErrorData({...ErrorData, [e.target.name]: "Name must be atleast 3 characters"});
				return false;
			}
			return true;
		}

		if(e.target.name == "age"){
			if(e.target.value < 18) {
				setErrorData({...ErrorData, [e.target.name]: "Age must be atleast 18"});
				return false;
			}
			return true;
		}

		if(e.target.name == "phone"){
			const re_phone = /^\d{10}$/;
			if(e.target.value.length != 10 || !re_phone.test(e.target.value)) {
				setErrorData({...ErrorData, [e.target.name]: "Invalid Phone Number"});
				return false;
			}
			return true;
		}

		if(e.target.name == "email"){
			const re_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
			if(!re_email.test(e.target.value)) {
				setErrorData({...ErrorData, [e.target.name]: "Invalid Email ID"});
				return false;
			}
			return true;
		}

		if(e.target.name == "password"){

			const re_pwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
			if(!re_pwd.test(e.target.value)) {
				setErrorData({...ErrorData, [e.target.name]: "Must be atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"});
				return false;
			}
			return true;
		}

		if(e.target.name == "confirm_password"){
			if(e.target.value != RegisterData.password) {
				setErrorData({...ErrorData, [e.target.name]: "Password does not match"});
				return false;
			}
			return true;
		}
	}

	const onInputChange = (e) => {
		if(validateData(e)){
			setRegisterData({...RegisterData, [e.target.name]: e.target.value});
		}
	}

	const handleGenderChange = (event) => {
		setRegisterData({...RegisterData, gender: event.target.value});
    };

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	return (
	  <div className='auth-main-container'>
		<ToastContainer />
		<div className="auth-container">
			<div className='auth-image-container'>
				<img src={Tracker}></img>
			</div>

			<div className="auth-form-container">
				<h3 className='text-center'>HOLA! AMIGO</h3>
				<h5 className='text-center'>Let's get started</h5>
				<form onSubmit={(e) => onSubmit(e)}>
					<div className='row role mt-4'>
						<div className='col user-col' style={{backgroundColor: RegisterData.role == "User" ? "rgb(203, 133, 41)" : "", 
							borderColor: "gray",
							color: RegisterData.role == "User" ? "white" : ""
						 }} onClick={() => selectRole("User")}>
							User
						</div>

						<div className='col coach-col' style={{backgroundColor: RegisterData.role == "Coach" ? "rgb(203, 133, 41)" : "",
							borderColor: "gray",
							color: RegisterData.role == "Coach" ? "white" : ""
						 }} onClick={() => selectRole("Coach")}>
							Coach
						</div>
					</div>
					<div className='form-row mt-2'>
							<div className='form-group col1'>
								<input type="text" placeholder="Name" name="name" 
								className='form-control' 
								style={{borderColor: (RegisterData.name && !ErrorData.name) ? "green" : "red"}}
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg'>{ErrorData.name}</p>
							</div>
							<div className='form-group col1'>
								<input type="number" placeholder="Age" name="age" 
								className='form-control' 
								style={{borderColor: (RegisterData.age && !ErrorData.age) ? "green" : "red"}}
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg'>{ErrorData.age}</p>
							</div>
					</div>

					<div className='form-row mt-2'>
							<div className='form-group gender col1 pt-2'>
								<select value={RegisterData.gender} className="form-select" onChange={handleGenderChange} 
									style={{borderColor: RegisterData.gender ? "green" : "red"}}>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Others">Others</option>
								</select>
							</div>

							<div className='form-group col1'>
								<input type="text" placeholder="Phone Number" name="phone" 
								className='form-control' 
								style={{borderColor: (RegisterData.phone && !ErrorData.phone) ? "green" : "red"}}
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg'>{ErrorData.phone}</p>
							</div>
					</div>

					<div className='form-row mt-2'>
								<input type="email" placeholder="Email ID" name="email" 
								className='form-control' 
								style={{borderColor: (RegisterData.email && !ErrorData.email ) ? "green" : "red"}}
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg email-error'>{ErrorData.email}</p>
					</div>
					<div className='form-row mt-2'>
							<div className='form-group col1'>
								<input type="password" placeholder="Password" name="password" 
								className='form-control' 
								style={{borderColor: (RegisterData.password && !ErrorData.password ) ? "green" : "red"}}
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg pwd-error'>{ErrorData.password}</p>
							</div>
							<div className='form-group col1'>
								<input type="password" placeholder="Confirm Password" name="confirm_password" 
								className='form-control' 
								style={{borderColor: (RegisterData.confirm_password && !ErrorData.confirm_password) ? "green" : "red"}}
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg pwd-error'>{ErrorData.confirm_password}</p>
							</div>
					</div>

					{
						RegisterData.role == "Coach" && 
							<div className='form-row mt-4 d-flex flex-wrap'>
								<label for="certificate" className='pt-1 mt-2'>Certificate Proof:</label> <input className='form-group' id="certificate" type="file" placeholder='Upload your Certificate' onChange={handleFileChange} />
							</div>
					}

					<div className='form-row mt-2'>
						<button className='btn btn-light'>Register</button>
					</div>
				</form>
			</div>
		</div>
	  </div>
	);
  }  