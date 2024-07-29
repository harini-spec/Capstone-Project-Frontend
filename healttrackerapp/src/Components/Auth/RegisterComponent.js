import { React, useEffect, useState } from 'react';
import '../../Styles/RegisterStyles.css';
import Tracker from '../../Assets/Register.jpg';
import '../../Styles/ErrorStyles.css';
  
 export const RegisterComponent = () =>  {

	useEffect(() => {
	}, []);

	const [RegisterData, setRegisterData] = useState({});
	const [ErrorData, setErrorData] = useState({});

	const selectRole = (Role) => {
		if(RegisterData.role == Role) {
			setRegisterData({...RegisterData, role	: ""});
			return;
		}
		setRegisterData({...RegisterData, role	: Role});
	}

	const onSubmit = (e) => {
		e.preventDefault();
		console.log(RegisterData);
	}	

	const validateData = (e) => {
		console.log(e.target.name, e.target.value);

		if(e.target.name == "name"){
			setErrorData({...ErrorData, [e.target.name]: ""});
			if(e.target.value.length < 3) {
				setErrorData({...ErrorData, [e.target.name]: "Name must be atleast 3 characters"});
				return false;
			}
			return true;
		}

		if(e.target.name == "age"){
			setErrorData({...ErrorData, [e.target.name]: ""});
			if(e.target.value < 18) {
				console.log("Age must be atleast 18");
				setErrorData({...ErrorData, [e.target.name]: "Age must be atleast 18"});
				return false;
			}
			return true;
		}

		if(e.target.name == "phone"){
			setErrorData({...ErrorData, [e.target.name]: ""});
			const re_phone = /^\d{10}$/;
			if(e.target.value.length != 10 || !re_phone.test(e.target.value)) {
				setErrorData({...ErrorData, [e.target.name]: "Invalid Phone Number"});
				return false;
			}
			return true;
		}

		if(e.target.name == "height"){
			setErrorData({...ErrorData, [e.target.name]: ""});
			if(e.target.value < 0) {
				setErrorData({...ErrorData, [e.target.name]: "Invalid Height"});
				return false;
			}
			return true;
		}

		if(e.target.name == "weight"){
			setErrorData({...ErrorData, [e.target.name]: ""});
			if(e.target.value < 0) {
				setErrorData({...ErrorData, [e.target.name]: "Invalid Weight"});
				return false;
			}
			return true;
		}

		if(e.target.name == "password"){
			setErrorData({...ErrorData, [e.target.name]: ""});
			var re_pwd = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			if(!re_pwd.test(RegisterData.password)) {
				setErrorData({...ErrorData, [e.target.name]: "Password must be atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"});
				return false;
			}
			return true;
		}

		if(e.target.name == "confirm_password"){
			setErrorData({...ErrorData, [e.target.name]: ""});	
			if(e.target.value != RegisterData.password) {
				setErrorData({...ErrorData, [e.target.name]: "Password does not match"});
				return false;
			}
			return true;
		}
	}

	const onInputChange = (e) => {
		setRegisterData({...RegisterData, [e.target.name]: e.target.value});
		setErrorData({...ErrorData, [e.target.name]: ""});
		validateData(e);
	}

	const handleGenderChange = (event) => {
		setRegisterData({...RegisterData, gender: event.target.value});
    };

	return (
	  <div className='register-main-container'>
		<div className="register-container">
			<div className='register-image-container'>
				<img src={Tracker}></img>
			</div>

			<div className="register-form-container">
				<h3 className='text-center'>HOLA! AMIGO</h3>
				<h5 className='text-center'>Let's get started</h5>
				<form onSubmit={(e) => onSubmit(e)}>
					<div className='form-row mt2'>
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
								<select value={RegisterData.gender} className="form-select" onChange={() => handleGenderChange} 
									style={{borderColor: RegisterData.gender ? "green" : "red"}}>
									<option>Gender</option>
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
								<p className='error-msg'>{ErrorData.email}</p>
					</div>
					<div className='form-row mt-2'>
							<div className='form-group col1'>
								<input type="text" placeholder="Password" name="password" 
								className='form-control' 
								style={{borderColor: (RegisterData.password && !ErrorData.password ) ? "green" : "red"}}
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg'>{ErrorData.password}</p>
							</div>
							<div className='form-group col1'>
								<input type="password" placeholder="Confirm Password" name="confirm_password" 
								className='form-control' 
								style={{borderColor: (RegisterData.confirm_password && !ErrorData.confirm_password) ? "green" : "red"}}
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg'>{ErrorData.confirm_password}</p>
							</div>
					</div>
					<div className='form-row mt-2'>
							<div className='form-group col1'>
								<input type="password" placeholder="Height" name="height" 
								className='form-control' 
								style={{borderColor: (RegisterData.height && !ErrorData.height) ? "green" : "red"}}
								step="0.01"
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg'>{ErrorData.height}</p>
							</div>
							<div className='form-group col1'>
								<input type="number" placeholder="Weight" name="weight" 
								className='form-control' 
								style={{borderColor: (RegisterData.weight && !ErrorData.weight) ? "green" : "red"}}
								step="0.01"
								onChange={(e)=>onInputChange(e)}/>
								<p className='error-msg'>{ErrorData.weight}</p>
							</div>
					</div>

					<div className='row role mt-2'>
						<div className='col user-col' style={{backgroundColor: RegisterData.role == "User" ? "rgb(15,39,135)" : "", 
							borderColor: RegisterData.role ? "green" : "red",
							color: RegisterData.role == "User" ? "white" : ""
						 }} onClick={() => selectRole("User")}>
							User
						</div>

						<div className='col coach-col' style={{backgroundColor: RegisterData.role == "Coach" ? "rgb(15,39,135)" : "",
							borderColor: RegisterData.role ? "green" : "red",
							color: RegisterData.role == "Coach" ? "white" : ""
						 }} onClick={() => selectRole("Coach")}>
							Coach
						</div>
					</div>

					<div className='form-row mt-2'>
						<button className='btn btn-primary'>Register</button>
					</div>
				</form>
			</div>
		</div>
	  </div>
	);
  }  