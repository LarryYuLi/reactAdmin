/*
action creators
synchronized action: object, {type: 'xxx', data}
asynchronized action: function dispatch => {}
*/

import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG, 
    RESET_USER, 
} from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils';

// set head title synchronized action
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle })

// receive user synchronized action
export const receiveUser = (user) => ({ type: RECEIVE_USER, user })

// show error message synchronized action
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

export const logout = () => {
    // delete local user
    storageUtils.removeUser()

    return {type: RESET_USER}
}

// asynchronized action for login
export const login = (username, password) => {
    return async dispatch => {
        // 1. ajax request
        const result = await reqLogin(username, password)
        // 2.1 success, dispatch action
        if (result.status === 0) {
            const user = result.data
            // store in local memory
            storageUtils.saveUser(user)

            dispatch(receiveUser(user))
        }
        // 2.2 failed
        else {
            const msg = result.msg
            dispatch(showErrorMsg(msg))
        }
    }
}