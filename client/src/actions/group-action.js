import axios from 'axios';

export const getAllGroups = () => {
    const request = axios.get('http://localhost:5000/todoGroup');
    return {
        type: 'GET_ALL_GROUPS',
        payload: request
    }
};

export const addGroup = (group) => {
    return {
        type: 'ADD_GROUP',
        payload: group
    }
}

export const updateGroup = (id, group) => {
    return {
        type: 'UPDATE_GROUP',
        id,
        payload: group
    }
}

export const deleteGroup = (id) => {
    return {
        type: 'DELETE_GROUP',
        id
    }
}