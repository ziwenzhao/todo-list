import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { Modal, Card, Row, Col, Button, Icon, notification, message } from 'antd';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import TodoForm from './todo-form';
import { deleteTodo, updateTodo } from '../actions/todo-action';

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editTodo: false,
            selectedTodo: null,
            todos: props.todos.filter(todo => todo.groupId === props.groupId).sort(this.compareFunc)
        }
    }
    static getDerivedStateFromProps = (props, state) => {
        const todos = props.todos.filter(todo => todo.groupId === props.groupId).sort(this.compareFunc);
        if (todos.length !== state.todos.length) {
            return { todos };
        }
        return state;
    }
    render() {
        return (
            <div>
                {this.getTodoList()}
                <Modal
                    visible={this.state.editTodo}
                    title="Edit Group"
                    closable={false}
                    footer={null}
                    destroyOnClose={true}
                >
                    <TodoForm mode="edit" todo={this.state.selectedTodo} closeModal={() => this.setState({ editTodo: false })} />
                </Modal>
            </div>
        );
    }

    getTodoList() {
        const getItem = (todo) => {
            return (
                <li className="list-group-item" key={todo.id}>
                    <Row>
                        <Col span={6}>
                            <p> {this.props.sortTodos ? <Icon style={{ marginRight: 4, fontSize: 16 }} type="bars" /> : null}{todo.title}</p>
                        </Col>
                        <Col style={{ textAlign: 'center' }} span={12}>
                            <p style={{ color: '#8c8c8c' }}>{todo.description}</p>
                        </Col>
                        <Col style={{ textAlign: 'right' }} span={6}>
                            <Button className="item-button" onClick={() => { this.setState({ selectedTodo: todo, editTodo: true }) }}>
                                <Icon style={{ fontSize: 16 }} type="edit"></Icon>
                            </Button>
                            <Button className="item-button" onClick={() => { this.onDelete(todo.id) }}>
                                <Icon style={{ fontSize: 16, color: 'red' }} type="delete"></Icon>
                            </Button>
                        </Col>
                    </Row>
                </li>
            )
        }
        if (this.props.sortTodos) {
            const SortableItem = SortableElement(({ todo }) => getItem(todo));
            const SortableList = SortableContainer(({ todos }) => (
                <ul className="list-group list-group-flush">
                    {todos.map((todo, index) => <SortableItem key={todo.id} index={index} todo={todo} />)}
                </ul>
            ));
            const onSortEnd = async ({ oldIndex, newIndex }) => {
                this.setState({
                    todos: arrayMove(this.state.todos, oldIndex, newIndex),
                });
                const tasks = [];
                this.state.todos.forEach((todo, idx) => {
                    this.props.updateTodo(todo.id, { sort: idx });
                    console.log(this.state.todos);
                    tasks.push(axios.patch('http://localhost:5000/todos/' + todo.id, { sort: idx }))
                });
                const res = await Promise.all(tasks).catch(e => { return message.error('Sorted failed') });
                message.success('Todos Sorted!');
            };
            return <SortableList todos={this.state.todos} onSortEnd={onSortEnd}></SortableList>
        }
        return (
            <ul className="list-group list-group-flush">
                {this.state.todos.map(todo => getItem(todo))}
            </ul>
        )
    }

    onDelete(id) {
        Modal.confirm({
            title: 'Delete Confirmation',
            content: 'Do you want to delete this item?',
            onOk: async () => {
                await axios.delete('http://localhost:5000/todos/' + id).catch(e => { return message.error(e) });
                message.success('Todo Deleted!');
                this.props.deleteTodo(id);
            }
        })
    }

    compareFunc = (a, b) => {
        if (a.sort < b.sort) {
            return -1;
        }
        if (a.sort === b.sort) {
            return 0;
        }
        return 1;
    }
}

function mapStateToProps(state) {
    return {
        todos: state.todos
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteTodo, updateTodo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);