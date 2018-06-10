import axios from 'axios';

export default (state = [], action) => {
    let groups = state.slice();
    switch (action.type) {
        case 'GET_ALL_GROUPS':
            return action.payload.data;
        case 'ADD_GROUP':
            return [
                ...state,
                action.payload
            ];
        case 'UPDATE_GROUP':
            let group = groups.find(group => group.id === action.id);
            group = Object.assign(group, action.payload);
            return groups;
        case 'DELETE_GROUP':
            const idx = groups.findIndex(group => group.id === action.id);
            groups.splice(idx, 1);
            return groups;
        default:
            return state
    }
}