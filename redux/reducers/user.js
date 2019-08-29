import { LOGIN, LOGOUT, UPDATE_FORM_DETAILS, UPDATE_SUBMISSION_DETAILS } from "../actionTypes";

const initialState = { loggedIn: false, content: {}, formID: "", submissionID: "" };

const visibilityFilter = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case LOGIN: {
            let copyState = { ...state };
            copyState.loggedIn = true;
            copyState.content = { ...action.payload.content };
            return copyState;
        }
        case LOGOUT: {
            return initialState
        }
        case UPDATE_FORM_DETAILS: {
            let copyState = { ...state };
            copyState.formID = action.payload.formID;
            return copyState
        }
        case UPDATE_SUBMISSION_DETAILS: {
            let copyState = { ...state };
            copyState.submissionID = action.payload.submissionID;
            return copyState
        }
        default: {
            return state;
        }
    }
};

export default visibilityFilter;
