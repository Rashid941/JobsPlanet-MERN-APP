import { GET_ERRORS } from "../actions/types";
const initialsetState = {};
export default function(setState = initialsetState, action) {
    switch (action.type) {
    case GET_ERRORS:
        return action.payload;
    default:
        return setState;
    }
}