import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../Styles/NavbarStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthService } from '../Services/useAuthService';
import { ClearSessionItems } from '../Services/ClearSessionItems';

export const Navbar = () => {

	const [Role, isExpired] = useAuthService();

	useEffect(() => {
		if(isExpired){
			ClearSessionItems();
			toast.error('Session Expired! Please Login Again');
			navigate('/Login');
		}
	},[localStorage.getItem('token')]);

	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('name');
		localStorage.removeItem('role');
		localStorage.removeItem('userID');
		localStorage.removeItem('IsPreferenceSet');
		
        navigate('/Login');
	}

    return (
        <div className='nav-container'>
            <nav className="navbar  navbar-expand-lg navbar-light">
			<Link to = "/" className='navbar-brand'>HEALTHSYNC</Link>
			
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse nav-content" id="navbarNav">
                    <ul className="navbar-nav">
						<div className='auth-navs'>
							<li className="nav-item">
								<Link to = "/">Home</Link>
							</li>

						{
							!localStorage.getItem('token')?(
								<div className='auth-navs'>
									<li className="nav-item">
										<Link to = "/Register">Register</Link>
									</li>
									<li className="nav-item">
										<Link to = "/Login">Login</Link>
									</li>
								</div>
							)
							:
							(
								<div className='auth-navs'>
									{
										localStorage.getItem("role") === 'User'
										?
											(
												<div className='auth-navs'>
													<li className="nav-item">
														<Link to = "/DashBoard">DashBoard</Link>
													</li>
													<li>
														<Link to = "/UserSuggestions">Suggestions</Link>
													</li>
													<li>
														<Link to = "/HealthBot">HealthBot</Link>
													</li>
												</div>
											)
										:
										localStorage.getItem("role") == 'Coach' ?
											(<li className="nav-item">
												<Link to = "/CoachDashBoard">Coach DashBoard</Link>
											</li>)
										:
										localStorage.getItem("role") == 'Admin' &&
											(<li className="nav-item">
												<Link to = "/AdminDashboard">Admin DashBoard</Link>
											</li>)
									}
									
									{
										(Role == 'User' || Role == "Coach") &&
										(
											<li className="nav-item">
												<Link to = "/UserPreferences">Monitor Preferences</Link>
											</li>
										)
									}
									</div>
							)
						}
						</div>
					</ul>
					{
						localStorage.getItem('token') &&
						(
							<div className='logout-nav-div'>
								<li className="nav-item logout-nav" onClick={handleLogout}>
									Logout
								</li>
							</div>
						)
					}
									
                </div>
            </nav>
        </div>
    );
}
