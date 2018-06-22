const expect = require('expect');
const request = require('supertest');
const { app } = require('../index.js');
const axios = require('axios');

const todos = [
    {
        id: 1,
        title: 'test1',
        description: 'test1 description',
        groupId: 1,
        groupName: 'group1',
        sort: 0
    },
    {
        id: 2,
        title: 'test2',
        description: 'test2 description',
        groupId: 2,
        groupName: 'group2',
        sort: 0
    }
]
beforeEach(done => {
    axios.get('http://localhost:5000/todos').then(res => {
        let tasks = [];
        res.data.forEach(todo => {
            tasks.push(axios.delete('http://localhost:5000/todos/' + todo.id));
        });
        return Promise.all(tasks);
    }).then(() => {
        let tasks = [];
        todos.forEach(todo => {
            tasks.push(axios.post('http://localhost:5000/todos', todo));
        });
        return Promise.all(tasks);
    }).then(() => done());
});

describe('Todo API Test', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.length).toBe(2);
            })
            .end(done)
    });

    it('should get a todo by Id', done => {
        request(app)
            .get('/todos/2')
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual({
                    id: 2,
                    title: 'test2',
                    description: 'test2 description',
                    groupId: 2,
                    groupName: 'group2',
                    sort: 0
                })
            })
            .end(done)

    });

    it('should return empty array if get todo by a non-existing id', done => {
        request(app)
            .get('/todos/3')
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })

    it('Should create a todo', done => {
        request(app)
            .post('/todos')
            .send({
                title: 'test3',
                description: 'test3',
                groupId: 1,
                groupName: 'group1',
                sort: 1
            })
            .expect(200)
            .expect(res => {
                expect(res.body).toInclude({
                    title: 'test3',
                    description: 'test3',
                    groupId: 1,
                    groupName: 'group1',
                    sort: 1
                })
            })
            .end(done)
    });

    it('should not create a todo with undefined properties', done => {
        request(app)
            .post('/todos')
            .send({
                testProp: 'test'
            })
            .expect(400)
            .end(done)
    })

    it('should update a todo', done => {
        request(app)
            .patch('/todos/2')
            .send({
                title: 'test2 update'
            })
            .expect(200)
            .expect(res => {
                expect(res.body.title).toBe('test2 update')
            })
            .end(done);
    });

    it('should delete a todo', done => {
        request(app)
            .delete('/todos/2')
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                axios.get('http://localhost:5000/todos/2').then(res => {
                    expect(res.body).toNotExist();
                    done();
                }).catch(e => done(e))
            })
    })



})
