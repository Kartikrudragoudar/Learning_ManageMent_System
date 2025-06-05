import axios from 'axios';
import { API_BASE_URl } from './constants';

const apiInstance = axios.create({
    baseURl: API_BASE_URl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default apiInstance