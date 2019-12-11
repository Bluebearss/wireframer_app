import * as actionCreators from '../actions/actionCreators';

const initState = {
    users: []
};

const wireFrameReducer = (state = initState, action) => {
    switch (action.type) {
        /* IF YOU HAVE ANY WIREFRAME EDITING REDUCERS ADD THEM HERE */ 
        case actionCreators.CREATE_WIREFRAME_SUCCESS:
            return state;
        case actionCreators.CREATE_WIREFRAME_ERROR:
            return state;
        case actionCreators.DELETE_WIREFRAME_SUCCESS:
            return state;
        case actionCreators.DELETE_WIREFRAME_ERROR:
            return state;
        default:
            return state;
    }
};

export default wireFrameReducer;