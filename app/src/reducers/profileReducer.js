import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, ALERT_MESSAGE, UPDATE_ALERT_MESSAGE, DELETE_ALERT_MESSAGE } from '../actions/types';

const initialState = {
    profile: null,
    profiles: null,
    loading: false,
    update: false,
    deleted: false,
    alertMessage: ""
}

export default function(state = initialState, action) {
    switch(action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true,
                alertMessage: "",
                deleted: false
            }
        case GET_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            }
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                profile: null
            }
        case ALERT_MESSAGE:
            return {
                ...state,
                alertMessage: action.payload
            }
        case UPDATE_ALERT_MESSAGE:
            return {
                ...state,
                update: action.payload
            }
        case DELETE_ALERT_MESSAGE:
            return {
                ...state,
                deleted: action.payload,
            }
        default:
            return state;
    }
}