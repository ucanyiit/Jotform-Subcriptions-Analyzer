import axios from 'axios';
import qs from 'qs';
import { GET_FORMS_SUCCESS, GET_SUBMISSIONS_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS, REFRESH_ERRORS, REGISTER_SUCCESS, REQUEST_FAILURE, REQUEST_STARTED, UPDATE_FORM_DETAILS, UPDATE_SUBMISSION_DETAILS } from "./actionTypes";

export const loginRequest = ({ username, password, navigation }) => dispatch => {
    dispatch(requestStarted());
    axios.post('https://api.jotform.com/user/login', qs.stringify({ username, password, access: 'full', appName: 'ucanyiit' }))
        .then((res) => {
            dispatch(loginSuccess(res.data.content));
            console.log(res);
            dispatch(navigateTo({ navigation, page: "Forms", apikey: res.data.content.appKey }));
        })
        .catch((err) => { dispatch(requestFailure(err)) })
};

export const logoutRequest = () => dispatch => {
    dispatch(requestStarted());
    axios.post('https://api.jotform.com/user/logout')
        .then(res => { dispatch(logoutSuccess(res.data.content)) })
        .catch(err => { dispatch(requestFailure(err)) })
};

export const registerRequest = ({ username, password, email }) => dispatch => {
    dispatch(requestStarted());
    axios.post('https://api.jotform.com/user/register', qs.stringify({ username, password, email }))
        .then(res => { dispatch(registerSuccess(res.data.content)) })
        .catch(err => { dispatch(requestFailure(err)) })
};

export const navigateTo = ({ navigation, page, id, apikey }) => dispatch => {
    switch (page) {
        case "Forms": {
            dispatch(requestStarted());
            navigation(page);
            axios.get('https://api.jotform.com/user/forms', { params: { apikey } })
                .then(res => { dispatch(getFormsSuccess(res.data.content)) })
                .catch(err => { dispatch(requestFailure(err)) })
            break;
        }
        case "Submissions": {
            dispatch(requestStarted());
            navigation(page);
            axios.get('https://api.jotform.com/user/submissions', { params: { apikey } })
                .then(res => { dispatch(getSubmissionsSuccess(res.data.content)) })
                .catch(err => { dispatch(requestFailure(err)) })
            break;
        }
        case "FormDetails": {
            dispatch(requestStarted());
            navigation(page);
            console.log(apikey);
            console.log(id);
            axios.get(`https://api.jotform.com/form/${id}`, { params: { apikey } })
                .then(res => { dispatch(updateFormDetails(res.data.content)) })
                .catch(err => { dispatch(requestFailure(err)) })
            break;
        }
        case "SubmissionDetails": {
            dispatch(requestStarted());
            navigation(page);
            axios.get(`https://api.jotform.com/submission/${id}`, { params: { apikey } })
                .then(res => { dispatch(updateSubmissionDetails(res.data.content)) })
                .catch(err => { dispatch(requestFailure(err)) })
            break;
        }
        default: {
            navigation(page);
            dispatch(refreshErrors());
        }

    }
}

const updateFormDetails = content => ({
    type: UPDATE_FORM_DETAILS,
    payload: { content }
});

const updateSubmissionDetails = content => ({
    type: UPDATE_SUBMISSION_DETAILS,
    payload: { content }
});

const refreshErrors = () => ({
    type: REFRESH_ERRORS
})

const loginSuccess = content => ({
    type: LOGIN_SUCCESS,
    payload: { content }
});

const registerSuccess = () => ({
    type: REGISTER_SUCCESS
});

const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS
});

const requestStarted = () => ({
    type: REQUEST_STARTED
});

const getFormsSuccess = content => ({
    type: GET_FORMS_SUCCESS,
    payload: { content }
});

const getSubmissionsSuccess = content => ({
    type: GET_SUBMISSIONS_SUCCESS,
    payload: { content }
});

const requestFailure = content => ({
    type: REQUEST_FAILURE,
    payload: { content }
});