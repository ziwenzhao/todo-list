import { combineReducers } from 'redux';
import groupReducer from './group-reducer';
import todoReducer from './todo-reducer';

export default combineReducers({
    todos: todoReducer,
    groups: groupReducer
});