import axios from 'axios';

export default axios.create({
    baseURL: 'https://healthsyncbackend.azurewebsites.net/api/'
});