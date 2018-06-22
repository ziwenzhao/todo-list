var mysql = require('mysql');
console.log(process.env.NODE_ENV);
const con = mysql.createConnection({
    user: 'ziwenzhao',
    password: '123456',
    database: process.env.NODE_ENV === 'test' ? 'todoListTest' : 'todoList'
});
con.connect((err, arg) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connected');
    }
});

module.exports = con;