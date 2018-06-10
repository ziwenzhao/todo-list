const con = require('./db');

const findAllGroups = () => {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM todoGroup', (err, result, fields) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
}

const findGroupById = (id) => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM todoGroup WHERE ID = ${id}`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]);
        })
    })
}

const createGroup = (group) => {
    let colColl = '';
    let values = [];
    for (let key in group) {
        colColl += key + ', ';
        values.push(group[key]);
    }
    colColl = colColl.slice(0, colColl.length - 2);
    return new Promise((resolve, reject) => {
        con.query('INSERT INTO todoGroup (' + colColl + ') VALUES ?', [[values]], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
}

const updateGroup = (id, group) => {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE todoGroup SET ';
        let values = [];
        for (let key in group) {
            sql += key + ' = ?, ';
            values.push(group[key]);
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

const deleteGroup = (id) => {
    return new Promise((resolve, reject) => {
        con.query(`DELETE FROM todoGroup WHERE id = ${id}`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
}

module.exports = { findAllGroups, findGroupById, createGroup, updateGroup, deleteGroup };