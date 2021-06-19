import axios from 'axios';
import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    DELETE_ACCOUNT,
    GET_PROFILES,
    GET_REPOS

} from './types';
import { setAlert } from './alert';

//Get current users profile

export const getCurrentProfile = () => async dispatch => {

    try {
        console.log("firedOF1F");
        const res = await axios.get('/api/profile/me');
        //  const json = await res.json();

        console.log("Action")
        //    console.log(json)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

    } catch (err) {
        console.log(err.data);
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// get all profile
export const getProfileById = userId => async dispatch => {
    try {

        const res = await axios.get(`/api/profile/user/${userId}`);
        //  const json = await res.json();

        console.log("Action")
        //    console.log(json)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

    } catch (err) {
        console.log(err.data);
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Profiles Githubrepos

export const getGithubRepos = username => async dispatch => {
    try {
        console.log("firedOF1F");
        const res = await axios.get(`/api/profile/github/${username}`);
        //  const json = await res.json();

        console.log(res.data);
        //    console.log(json)
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })

    } catch (err) {
        console.log(err.data);
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//get profiles
export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get('/api/profile');
        //  const json = await res.json();

        console.log("Action")
        //    console.log(json)
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })

    } catch (err) {
        console.log(err.data);
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {


    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/profile', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        if (!edit) {
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error =>
                dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Add experience
export const addExperience = (formData, history) => async dispatch => {
    console.log("add experience is called ofof")
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience  Added', 'success'));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error =>
                dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

//Add experience
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/education', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education  Added', 'success'));

        history.push('/dashboard');

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error =>
                dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }

}

export const deleteExperience = id => async dispatch => {

    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience  removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
};

export const deleteEducation = id => async dispatch => {

    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
};

export const deleteAccount = id => async dispatch => {
    if (window.confirm('Are you sure? This cannot be undone')) {

        try {
            await axios.delete('/api/profile');
            dispatch({
                type: CLEAR_PROFILE
            })
            dispatch({
                type: DELETE_ACCOUNT
            })
            dispatch(setAlert('You account has been permanently deleted'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
            })
        }
    }
};