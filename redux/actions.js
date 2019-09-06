import axios from 'axios';
import qs from 'qs';
import { GET_FORMS_SUCCESS, GET_SUBMISSIONS_SUCCESS, LOAD_NAVIGATION, LOGIN_SUCCESS, LOGOUT_SUCCESS, REFRESH_ERRORS, REGISTER_SUCCESS, REQUEST_FAILURE, REQUEST_STARTED, UPDATE_FORM_DETAILS, UPDATE_SUBMISSION_DETAILS } from "./actionTypes";

export const noLogin = ({ apikey }) => dispatch => {
    dispatch(loginSuccess({ appKey: apikey }));
    dispatch(navigateTo({ page: 'Submissions' }));
};

export const loginRequest = ({ username, password }) => dispatch => {
    dispatch(requestStarted());
    axios.post('https://api.jotform.com/user/login', qs.stringify({ username, password, access: 'full', appName: 'ucanyiit' }))
        .then((res) => {
            dispatch(loginSuccess(res.data.content));
            dispatch(navigateTo({ page: "Submissions" }));
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

export const navigateTo = ({ page, id }) => (dispatch, getState) => {
    let nav = getState().nav;
    switch (page) {
        case "FormDetails": {
            dispatch(updateFormDetails(id));
            nav.push(page);
            break;
        }
        case "SubmissionDetails": {
            dispatch(updateSubmissionDetails(id));
            nav.push(page);
            break;
        }
        default: {
            nav.navigate(page);
        }
    }
    dispatch(refreshErrors());
}

export const formDetailsRequest = id => (dispatch, getState) => {
    dispatch(requestStarted());
    axios.get(`https://api.jotform.com/form/${id}`, { params: { apikey: { ...getState().user }.content.appKey } })
        .then(res => {
            let form = res.data.content;
            axios.get(`https://api.jotform.com/form/${form.id}/submissions`, { params: { apikey: { ...getState().user }.content.appKey } })
                .then(res => {
                    let payments = [];
                    for (submission of res.data.content) payments.push(getPaymentFromSubmission(submission));
                    form.payments = payments;
                    dispatch(updateFormDetails(form));
                })
                .catch(err => { dispatch(requestFailure(err)) })
        })
        .catch(err => { dispatch(requestFailure(err)) })
}

export const formsRequest = (type) => (dispatch, getState) => {
    dispatch(requestStarted());
    axios.get('https://api.jotform.com/user/forms', { params: { apikey: { ...getState().user }.content.appKey } })
        .then(res => {
            let forms = res.data.content, requestArr = [];
            if (type == "all") {
                dispatch(getFormsSuccess(forms));
                return;
            }
            for (form of forms) requestArr.push(axios.get(`https://api.jotform.com/form/${form.id}/submissions`, { params: { apikey: { ...getState().user }.content.appKey } }));
            axios.all(requestArr)
                .then(axios.spread((...res) => {
                    let filteredForms = [];
                    for (form of forms) form.submissions = res[i].data.content;
                    for (form of forms) if (filterForm(form, type)) filteredForms.push(form);
                    dispatch(getFormsSuccess(filteredForms));
                    console.log("filtered forms", type, filteredForms);
                }))
                .catch(axios.spread((err) => { dispatch(requestFailure(err)) }))
        })
        .catch(err => { dispatch(requestFailure(err)) })
}

export const submissionDetailsRequest = id => (dispatch, getState) => {
    dispatch(requestStarted());
    axios.get(`https://api.jotform.com/submission/${id}`, { params: { apikey: { ...getState().user }.content.appKey } })
        .then(res => {
            let submission = res.data.content;
            axios.get(`https://api.jotform.com/form/${submission.form_id}`, { params: { apikey: { ...getState().user }.content.appKey } })
                .then(res => {
                    submission.form = res.data.content;
                    submission.payment = getPaymentFromSubmission(submission);
                    dispatch(updateSubmissionDetails(submission));
                })
                .catch(err => { dispatch(requestFailure(err)) })
                .catch(err => { dispatch(requestFailure(err)) })
        })
}


export const submissonsRequest = type => (dispatch, getState) => {
    dispatch(requestStarted());
    axios.get('https://api.jotform.com/user/submissions', { params: { apikey: { ...getState().user }.content.appKey } })
        .then(res => {
            let submissions = res.data.content, requestArr = [], filteredSubmissions = [];
            if (type != "all") {
                for (submission of submissions) if (filterSubmission(submission, type)) filteredSubmissions.push(submission);
                submissions = filteredSubmissions;
            }
            for (submission of submissions) requestArr.push(axios.get(`https://api.jotform.com/form/${submission.form_id}`, { params: { apikey: { ...getState().user }.content.appKey } }));
            axios.all(requestArr)
                .then(axios.spread((...res) => {
                    for (let i = 0; i < res.length; i++) submissions[i].form = res[i].data.content;
                    dispatch(getSubmissionsSuccess(submissions));
                }))
                .catch(axios.spread((err) => { dispatch(requestFailure(err)) }))
        })
        .catch(err => { dispatch(requestFailure(err)) })
}

const filterSubmission = (submission, type) => {
    console.log(getPaymentFromSubmission(submission), submission, type);
    if (type == getPaymentFromSubmission(submission).paymentType) return 1;
    return 0;
}

const filterForm = (form, type) => {
    for (submission of form.submissions) if (type == getPaymentFromSubmission(submission).paymentType) return 1;
    return 0;
}

const getPaymentFromSubmission = (submission) => {
    let payment = false;
    if (typeof submission === "string") return false;
    else for (let answerID in submission.answers) {
        if (submission.answers[answerID].paymentType) {
            let answer = submission.answers[answerID].answer
            for (a in answer) if (a == "1") payment = JSON.parse(answer[a]);
            let time = submission.created_at;
            time = time.split(' ');
            payment.date = time[0];
            payment.time = time[1];
            payment.submission_id = submission.id;
            payment.form_id = submission.form_id;
        }
    }
    return payment
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

export const loadNavigation = content => ({
    type: LOAD_NAVIGATION,
    payload: { content }
});