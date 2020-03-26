import React, { useReducer } from 'react';
import uuid from 'uuid';
import alertContext from './alertContext';
import alertReducer from './alertReducer';
import {
   SET_ALERT,
   REMOVE_ALERT
} from '../types';

const AlertState = props => {
    const initialState = []

    const [state, dispatch] = useReducer(alertReducer, initialState);

    // Set Alert
    const setAlert = (msg, type) => {
        const id =  uuid.v4();
        dispatch({
            type: SET_ALERT,
            payload: { msg, type, id}
        });

        setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), 5000)
    }

    return (
        <alertContext.Provider value={{
            alerts: state,
            setAlert
        }}>
            { props.children }
        </alertContext.Provider>
    )
}

export default AlertState;