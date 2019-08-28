import { LOGIN, LOGOUT, UPDATE_FORM_DETAILS, UPDATE_SUBMISSION_DETAILS } from "../actionTypes";

const initialState = { loggedIn: false, content: {}, formID: "", submissionID: "" };

const visibilityFilter = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            let copyState = { ...state };
            copyState.loggedIn = true;
            copyState.content = action.payload
            console.log("state");
            console.log(state);
            console.log("copystate");
            console.log(copyState);
            return copyState;
        }
        case LOGOUT: {
            return initialState
        }
        case UPDATE_SUBMISSION_DETAILS: {
            let copyState = { ...state };
            copyState.formID = action.payload;
            return copyState
        }
        case UPDATE_FORM_DETAILS: {
            let copyState = { ...state };
            copyState.submissionID = action.payload;
            return copyState
        }
        default: {
            return state;
        }
    }
};

export default visibilityFilter;
