import axios from 'axios'; //Prevent have to manually make sure for each req is need

const setAuthToken = token => {
    if(token) {
        //Apply to every request
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        //Delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;