import axios from 'axios';

export const getAllTodos = () => {
    const request = axios.get('http://localhost:5000/todos');
    return {
        type: 'GET_ALL_TODOS',
        payload: request
    }
};

export const addTodo = (todo) => {
    return {
        type: 'ADD_TODO',
        payload: todo
    };
};

export const updateTodo = (id, todo) => {
    return {
        type: 'UPDATE_TODO',
        id,
        payload: todo
    }
};

export const deleteTodo = (id) => {
    return {
        type: 'DELETE_TODO',
        id
    }
};

