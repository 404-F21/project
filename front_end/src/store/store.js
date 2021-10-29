import {
    createStore,
    combineReducers,
    applyMiddleware,
    compose
} from 'redux';
import thunk from 'redux-thunk';

const loginReducer = (state=JSON.parse(localStorage.getItem('userinfo')),action)=>{
    switch (action.type) {
        case 'loginSuccess':
            return action.payload;
        default:
            return state;
    }
}
const homeReducer = (state={},action)=>{
    switch (action.type) {
        default:
            return state;
    }
}
const rootReducer = combineReducers({
    login:loginReducer,
    home:homeReducer
})
const store = createStore( 
    rootReducer, 
    applyMiddleware(thunk),
);
export default store;