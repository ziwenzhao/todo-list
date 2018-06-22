const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const { findAllTodos, findTodoById, findTodoByGroupId, createTodo, updateTodo, deleteTodo } = require('./db/todo-item');
const { findAllGroups, findGroupById, createGroup, updateGroup, deleteGroup } = require('./db/todo-group');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/todos', async (req, res) => {
    const result = await findAllTodos().catch(e => { return res.status(400).send(e); });
    res.send(result);
});

app.get('/todos/:id', async (req, res) => {
    const result = await findTodoById(req.params.id).catch(e => { return res.status(400).send(e); });
    res.send(result);
});

app.get('/todos/findByGroupId/:id', async (req, res) => {
    const result = await findTodoByGroupId(req.params.id).catch(e => { return res.status(400).send(e); });
    res.send(result);
})

app.post('/todos', async (req, res) => {
    const result = await createTodo(req.body).catch(e => { return res.status(400).send(e); });
    const todo = await findTodoById(result.insertId).catch(e => { return res.status(400).send(e); });
    res.send(todo);
});

app.patch('/todos/:id', async (req, res) => {
    const result = await updateTodo(req.params.id, req.body).catch(e => { return res.status(400).send(e); });
    const todo = await findTodoById(req.params.id).catch(e => { return res.status(400).send(e); });
    res.send(todo);
});

app.delete('/todos/:id', async (req, res) => {
    const result = await deleteTodo(req.params.id).catch(e => { return res.status(400).send(e); });
    res.send({});
});

app.get('/todoGroup', async (req, res) => {
    const result = await findAllGroups().catch(e => { return res.status(400).send(e); });
    res.send(result);
});

app.get('/todoGroup/:id', async (req, res) => {
    const result = await findGroupById(req.params.id).catch(e => { return res.status(400).send(e); });
    res.send(result);
});

app.post('/todoGroup', async (req, res) => {
    const result = await createGroup(req.body).catch(e => { return res.status(400).send(e); });
    const todoGroup = await findGroupById(result.insertId).catch(e => { return res.status(400).send(e); });
    res.send(todoGroup);
});

app.patch('/todoGroup/:id', async (req, res) => {
    await updateGroup(req.params.id, req.body).catch(e => { return res.status(400).send(e); });
    const todoGroup = await findGroupById(req.params.id).catch(e => { return res.status(400).send(e); });
    res.send(todoGroup);
});

app.delete('/todoGroup/:id', async (req, res) => {
    await deleteGroup(req.params.id).catch(e => { return res.status(400).send(e); });
    res.send({});
})



app.listen(5000);
module.exports.app = app;