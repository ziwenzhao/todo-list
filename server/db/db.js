var mysql = require('mysql');
const con = mysql.createConnection({
    user: 'ziwenzhao',
    password: '123456',
    database: 'todoList'
});
con.connect((err, arg) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connected');
    }
});

module.exports = con;