import { React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthService } from '../../Services/useAuthService.js';
import api from '../../Services/Axios.js';
import '../../Styles/SuggestionStyles.css';
  
  const GetAllUserSuggestions = () =>  {

    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState([]);
    const [ErrorMsg, setErrorMsg] = useState("");
    const [Role, IsExpired] = useAuthService();

    useEffect(() => {
        const checkAuthentication = () => {
            if (!localStorage.getItem("token") || IsExpired || Role === "Coach") {
                navigate('/Login');
                return;
            }
    
            if (localStorage.getItem("IsPreferenceSet") === "false") {
                navigate('/UserPreferences');
                return;
            }
    
            if (Role === "Coach") {
                navigate('/Login');
                return;
            }

            fetchUserSuggestions();
        };

        checkAuthentication();
    }, [IsExpired, Role, navigate, suggestions]);

    const fetchUserSuggestions = async () => {
        try{
            const yourConfig = {
                headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
                }
            }

            const response = await api.get(`Problem/GetUserSuggestions`, yourConfig);
            setSuggestions(response.data);
        }
        catch(err){
            setErrorMsg("No Suggestions found!");
        }
    }

	return (
	  <div>
            <div className="suggestion-main-container">
                <div className="suggestion-container">
                    <div className="suggestion-header">
                        <h2>Your Suggestions</h2>
                    </div>
                    <hr/>
                    {ErrorMsg ? <div className='alert alert-danger mt-4 pt-4'>{ErrorMsg}</div> : 

                            <div className="suggestion-list">
                                {suggestions.map((suggestion) => (
                                    <div className='suggestion-desc-container'>
                                        <div className='suggestion-list-items' key={suggestion.SuggestionId}>
                                            <p className='suggestion-coach-name mr-2 pl-2'>{suggestion.coachName}:</p>
                                            <p className='suggestion-desc'>{suggestion.description}</p>
                                            <p className='suggestion-date'>{suggestion.created_at.split("T")[0]}</p>
                                        </div>
                                        <hr></hr>
                                    </div>
                                ))}
                            </div>
                    }
                </div>
            </div>
	  </div>
	);
  }
  
  export default GetAllUserSuggestions;
  