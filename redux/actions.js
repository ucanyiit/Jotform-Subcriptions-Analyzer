import { LOGIN, LOGOUT, REGISTER, UPDATE_FORM_DETAILS, UPDATE_SUBMISSON_DETAILS } from "./actionTypes";

export const login = content => ({
    type: LOGIN,
    payload: {
        content
    }
});

export const logout = content => ({
    type: LOGOUT,
    payload: {
        content
    }
});

export const updateFormDetails = content => ({
    type: UPDATE_FORM_DETAILS,
    payload: {
        content
    }
});

export const updateSubmissionDetails = content => ({
    type: UPDATE_SUBMISSON_DETAILS,
    payload: {
        content
    }
});
