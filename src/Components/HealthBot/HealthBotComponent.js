import React, { useState } from 'react';
import api from '../../Services/Axios';
import { toast } from 'react-toastify';
import '../../Styles/HealthBotStyles.css';

export const HealthBotComponent = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const getBotResponse = async () => {
        if (!query.trim()) {
            toast.error("Please enter a query.");
            return;
        }

        displayQueryOnScreen();

        setLoading(true);
        const yourConfig = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        };

        try {
            const response = await api.get(`OpenAI/GetChatGPTResponseData?Query=${encodeURIComponent(query)}`, yourConfig);
            if (response.status === 200) {
                displayResponseOnScreen(response.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.errorMessage || "An error occurred while fetching response.");
        } finally {
            setLoading(false);
            setQuery('');
        }
    };

    const displayResponseOnScreen = (responseData) => {
        const mainContainer = document.getElementById("bot-main-container");
        const responseContainer = document.createElement("div");
        responseContainer.classList.add("response");
        const preTag = document.createElement("pre");
        preTag.textContent = responseData;
        responseContainer.appendChild(preTag);
        mainContainer.appendChild(responseContainer);
    };

    const displayQueryOnScreen = () => {
        const mainContainer = document.getElementById("bot-main-container");
        const queryContainer = document.createElement("div");
        queryContainer.classList.add("query");
        queryContainer.textContent = query;
        mainContainer.appendChild(queryContainer);
    };

    return (
        <div className="bot-container">
            <div className="bot-main-container" id="bot-main-container"></div>

            <div className="query-container">
                <input
                    className="form-control"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query"
                    disabled={loading}
                />
                <button onClick={getBotResponse} disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};
