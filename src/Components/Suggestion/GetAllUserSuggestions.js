import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/SuggestionStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useAuthService } from '../../Services/useAuthService.js';
import api from '../../Services/Axios.js';

const GetAllUserSuggestions = () => {

  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [Role, IsExpired] = useAuthService();
  const [sortOrder, setSortOrder] = useState('asc'); // State to manage sort order
  const [searchTerm, setSearchTerm] = useState(''); // State to manage search term

  useEffect(() => {
    const checkAuthentication = () => {
      if (!localStorage.getItem("token") || IsExpired || Role === "Coach") {
        navigate('/Login');
        return;
      }

      if (Role === "Coach" || Role === "Admin") {
        navigate('/Login');
        return;
      }

      if (localStorage.getItem("IsPreferenceSet") === "false") {
        navigate('/UserPreferences');
        return;
      }

      fetchUserSuggestions();
    };

    checkAuthentication();
  }, [IsExpired, Role, navigate]);

  const fetchUserSuggestions = async () => {
    try {
      const yourConfig = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }

      const response = await api.get(`Problem/GetUserSuggestions`, yourConfig);
      setSuggestions(response.data);
    } catch (err) {
      setErrorMsg("No Suggestions found!");
    }
  }

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Function to filter and sort suggestions
  const filteredAndSortedSuggestions = [...suggestions]
    .filter(suggestion => suggestion.coachName.toLowerCase().includes(searchTerm))
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div>
      <div className="suggestion-main-container">
        <div className="suggestion-container">
          <div className="suggestion-header">
            <h2>Suggestions for You</h2>
            <div className='suggestion-controls'>
                <div className="search-controls">
                    <input className='form-control'
                        type="text"
                        placeholder="Search by coach name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="sort-controls">
                    <button onClick={() => handleSortChange('asc')}><FontAwesomeIcon icon={faArrowUp} /></button>
                    <button onClick={() => handleSortChange('desc')}><FontAwesomeIcon icon={faArrowDown} /></button>
                </div>
            </div>
            <hr/>
          </div>

          {ErrorMsg ? (
            <div className='alert alert-danger mt-4 pt-4'>{ErrorMsg}</div>
          ) : (
            <div className="suggestion-list">
              {filteredAndSortedSuggestions.map((suggestion) => (
                <div className='suggestion-desc-container' key={suggestion.SuggestionId}>
                  <div className='suggestion-list-items'>
                    <p className='suggestion-coach-name mr-2 pl-2'>{suggestion.coachName}:</p>
                    <p className='suggestion-desc'>{suggestion.description}</p>
                    <p className='suggestion-date'>{suggestion.created_at.split("T")[0]}</p>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetAllUserSuggestions;
