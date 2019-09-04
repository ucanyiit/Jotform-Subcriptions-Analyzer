import { LOAD_NAVIGATION } from "../actionTypes";

const initialState = false;

const nav = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case LOAD_NAVIGATION: {
            return  { ...action.payload.content };
        }
        default: {
            return state;
        }
    }
};

export default nav;
