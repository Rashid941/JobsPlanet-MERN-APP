import {
    SET_CURRENT_USER,
    USER_LOADING
} from "../actions/types";

const isEmpty = require("is-empty");

const initialsetState = {
    isAuthenticated: false,
    user: {},
    loading: false
};

export default function(setState = initialsetState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
        return {
            ...setState,
            isAuthenticated: !isEmpty(action.payload),
            user: action.payload
        };
        case USER_LOADING:
        return {
            ...setState,
            loading: true
        };
        default:
        return setState;
    }
}