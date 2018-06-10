export default (state = [], action) => {
    let todos = state.slice();
    switch (action.type) {
        case 'GET_ALL_TODOS':
            return action.payload.data;
        case 'ADD_TODO':
            return [
                ...state,
                action.payload
            ];
        case 'UPDATE_TODO':
            let todo = todos.find(todo => todo.id === action.id);
            todo = Object.assign(todo, action.payload);
            return todos;
        case 'DELETE_TODO':
            const idx = todos.findIndex(todo => todo.id === action.id);
            todos.splice(idx, 1);
            return todos;
        default:
            return state;
    }
}