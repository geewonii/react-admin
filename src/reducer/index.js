import { combineReducers } from 'redux'
import types from '../action/type'

const httpData = (state = {isFetching:false}, action) => {
    switch (action.type) {
        case types.REQUEST_DATA:
            return {...state, isFetching: action.isFetching}
        case types.RECEIVE_DATA:
            return {
                ...state,
                data:action.data,
                [action.category]:action.category
            }
        case types.LOADUSER_DATA:
            return {
                ...state,
                userList:action.userList
            }
        case types.RENT_DATA:
            return {
                ...state,
                rentList:action.rentList
            }
        case types.DRIVER_DATA:
            return {
                ...state,
                driverList:action.driverList
            }
        case types.VIO_DATA:
            return {
                ...state,
                vioList:action.vioList
            }
        case types.VIOBASIC_DATA:
            return {
                ...state,
                vioBasicList:action.vioBasicList
            }
        case types.MESSAGE_DATA:
            return {
                ...state,
                messageList:action.messageList
            }
        case types.MESSAGEUSER_DATA:
            return {
                ...state,
                messageUserList:action.messageUserList
            }
        case types.USERMESSAGEUSER_DATA:
            return {
                ...state,
                userMessageList:action.userMessageList
            }
        default:
            return {...state};
    }
};

export default combineReducers({
    httpData
});
