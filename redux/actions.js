import { LOGIN, LOGOUT, UPDATE_FORM_DETAILS, UPDATE_SUBMISSION_DETAILS } from "./actionTypes";

export const login = content => ({
    type: LOGIN,
    payload: {
        content
    }
});

export const logout = content => ({
    type: LOGOUT
});

export const updateFormDetails = formID => ({
    type: UPDATE_FORM_DETAILS,
    payload: {
        formID
    }
});

export const updateSubmissionDetails = submissionID => ({
    type: UPDATE_SUBMISSION_DETAILS,
    payload: {
        submissionID
    }
});
