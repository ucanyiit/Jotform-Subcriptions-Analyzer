import { LOGIN_SUCCESS, GET_SUBMISSIONS_SUCCESS, GET_FORMS_SUCCESS, LOGOUT_SUCCESS, REFRESH_ERRORS, REGISTER_SUCCESS, REQUEST_FAILURE, REQUEST_STARTED, UPDATE_FORM_DETAILS, UPDATE_SUBMISSION_DETAILS } from "../actionTypes";

const initialState = { loggedIn: false, content: {}, isLoading: false, error: false, forms: {}, submissions: {}, form: {}, submission: {} };

const user = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case LOGIN_SUCCESS: {
            let copyState = { ...state };
            copyState.content = { ...action.payload.content };
            copyState.loggedIn = true;
            return copyState;
        }
        case LOGOUT_SUCCESS: {
            return initialState
        }
        case REFRESH_ERRORS: {
            let copyState = { ...state };
            copyState.error = false;
            return copyState;
        }
        case REGISTER_SUCCESS: {
            let copyState = { ...state };
            copyState.isLoading = false;
            return copyState;
        }
        case REQUEST_FAILURE: {
            let copyState = { ...state };
            copyState.error = action.payload.content;
            copyState.isLoading = false;
            return copyState;
        }
        case REQUEST_STARTED: {
            let copyState = { ...state };
            copyState.isLoading = true;
            return copyState;
        }
        case GET_FORMS_SUCCESS: {
            let copyState = { ...state };
            copyState.forms = action.payload.content;
            copyState.isLoading = false;
            return copyState;
        }
        case GET_SUBMISSIONS_SUCCESS: {
            let copyState = { ...state };
            copyState.submissions = action.payload.content;
            copyState.isLoading = false;
            return copyState;
        }
        case UPDATE_FORM_DETAILS: {
            let copyState = { ...state };
            copyState.form = action.payload.content;
            copyState.isLoading = false;
            return copyState
        }
        case UPDATE_SUBMISSION_DETAILS: {
            let copyState = { ...state };
            copyState.submission = action.payload.content;
            copyState.isLoading = false;
            return copyState
        }
        default: {
            return state;
        }
    }
};

export default user;
