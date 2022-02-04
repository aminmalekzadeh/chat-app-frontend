import axios from 'axios';

class HttpService {
    
    constructor() {
        this.client = axios.create({
            baseURL: 'http://localhost:5000/api/v1/',
            timeout: 1000
        });

        this.client.interceptors.response.use(
            (response) => response,
            (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
        );    
 
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            config.headers.Authorization =  token ? `Bearer ${token}` : '';
            return config;
        });
    }

    get(url, config = null) {
        return this.client.get(url, config);
    }

    post(url, params, config = null) {
        return this.client.post(url, params, config);
    }

    delete(url) {
        return this.client.delete(url);
    }

    put(url, params, config = null) {
        return this.client.put(url, params, config);
    }
}

export default HttpService;