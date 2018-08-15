import axios from 'axios';

import { 
    GET_PROFILE, 
    PROFILE_LOADING, 
    CLEAR_CURRENT_PROFILE, 
    GET_ERRORS, 
    SET_CURRENT_USER, 
    ALERT_MESSAGE, 
    UPDATE_ALERT_MESSAGE, 
    DELETE_ALERT_MESSAGE,
    GET_PROFILES 
} from './types';

import { logoutUser } from './authActions';

//Get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profile')
        .then(res => 
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_PROFILE,
                payload: {}
            })
        );
}

//Get Profile by Handle
export const getProfileByHandle = (handle) => dispatch => {
    dispatch(setProfileLoading());
    axios.get(`/api/profile/handle/${handle}`)
        .then(res => 
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_PROFILE,
                payload: null
            })
        );
}

//create Profile
export const createProfile = (profileData, history, message) => dispatch => {
    axios.post('/api/profile', profileData)
        .then(res => {
            history.push('/dashboard');
            dispatch(setAlertMessage(message));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

//Profile Loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
}

export const setUpdateAlertMessage = () => {
    return {
        type: UPDATE_ALERT_MESSAGE,
        payload: true
    }
}

const setDeleteAlertMessage = () => {
    return {
        type: DELETE_ALERT_MESSAGE,
        payload: true
    }
}

//Alert Message
export const setAlertMessage = (message) => {
    return {
        type: ALERT_MESSAGE,
        payload: message
    }
}



//Add Experience
export const addExperience = (expData, history, message) => dispatch => {
    axios.post("/api/profile/experience", expData)
        .then(res => {
            history.push('/dashboard');
            dispatch(setAlertMessage(message));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

//Delete Experience
export const deleteExperience = (id, message) => dispatch => {
    axios.delete(`/api/profile/experience/${id}`)
        .then(res => {
            
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            });
            dispatch(setDeleteAlertMessage());
            dispatch(setAlertMessage(message));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

//Add Education
export const addEducation = (eduData, history, message) => dispatch => {
    axios.post("/api/profile/education", eduData)
        .then(res => {
            history.push('/dashboard');
            dispatch(setAlertMessage(message));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

//Delete Education
export const deleteEducation = (id, message) => dispatch => {
    axios.delete(`/api/profile/education/${id}`)
        .then(res => {
            
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            });
            dispatch(setDeleteAlertMessage());
            dispatch(setAlertMessage(message));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}

//Get all profiles
export const getProfiles = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profile/all')
        .then(res => {
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            });
        })
        .catch(err => 
            dispatch({
                type: GET_PROFILES,
                payload: null
            })
        );
}

//Delete Account & Profile
export const deleteAccount = () => dispatch => {
    if(window.confirm('Are you sure? This can NOT undone!')) {
        axios.delete('/api/profile')
            .then(res => {
                dispatch({
                    type: SET_CURRENT_USER,
                    payload: {}
                });
                dispatch(logoutUser());
            })
            .catch(err => ({
                type: GET_ERRORS,
                payload: err.response.data
            }));
    }
}

//Clear profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
}