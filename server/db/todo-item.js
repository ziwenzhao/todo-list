const con = require('./db');

const findAllTodos = () => {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM TodoItem', (err, result, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
};

const findTodoById = (id) => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM TodoItem WHERE id = ${id}`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]);
        })
    })
}

const findTodoByGroupId = (groupId) => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM todoItem WHERE groupId = ${groupId}`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
}

const createTodo = (todo) => {
    return new Promise((resolve, reject) => {
        let colCollection = ''; // column collection stirng used in sql;
        let valArr = []; // value collection string used in sql;
        for (let key in todo) {
            colCollection += key + ',';
            valArr.push(todo[key]);
        };
        values = [valArr];
        colCollection = colCollection.slice(0, colCollection.length - 1);
        con.query("INSERT INTO TODOITEM (" + colCollection + ")  VALUES ?", [values], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
};

const updateTodo = (id, todo) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE TodoItem SET ';
        const values = [];
        for (let key in todo) {
            sql += key + ' = ?, ';
            values.push(todo[key]);
        }
        sql = sql.slice(0, sql.length - 2);
        sql += ' WHERE id = ?';
        values.push(id);
        con.query(sql, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
}

const deleteTodo = (id) => {
    return new Promise((resolve, reject) => {
        con.query(`DELETE FROM TodoItem WHERE id = ${id}`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    });
}


module.exports = { findAllTodos, findTodoById, findTodoByGroupId, createTodo, updateTodo, deleteTodo };