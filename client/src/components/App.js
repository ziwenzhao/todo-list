import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Button, Icon, Collapse, Modal, message, Divider } from 'antd';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import axios from 'axios';
import { getAllGroups, updateGroup } from '../actions/group-action';
import { getAllTodos } from '../actions/todo-action';
import TodoList from './todo-list';
import TodoGroups from './todo-groups';
import GroupForm from './group-form';
import TodoForm from './todo-form';
import './App.css';

const Panel = Collapse.Panel;
const compareFunc = (a, b) => {
    if (a.sort < b.sort) {
        return -1;
    }
    if (a.sort === b.sort) {
        return 0;
    }
    return 1;
}
class App extends Component {
    constructor(props) {
        super(props);
        this.props.getAllTodos();
        this.props.getAllGroups();
        this.state = {
            createGroup: false,
            createTodo: false,
            sortGroups: false,
            groups: this.props.groups
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.groups.length !== state.groups.length) {
            state.groups = props.groups;
            return { groups: state.groups }
        }
        return state;
    }

    render() {
        if (!this.state.sortGroups) {
            const title = [
                <Button style={{ width: 150, marginRight: 20 }} key={0} onClick={this.onCreateGroup}><Icon type="plus-circle-o" />Create Group</Button>,
                <Button style={{ width: 150 }} key={1} onClick={() => this.setState({ sortGroups: true })}><Icon type="swap" />Sort Group</Button>
            ];
            const extra = <Button style={{ width: 150 }} type="primary" onClick={this.onCreateTodo}><Icon type="plus" />Create Todo</Button>;

            return (
                <Card title={title} extra={extra}>
                    <TodoGroups></TodoGroups>
                    <Modal
                        visible={this.state.createGroup}
                        title="Create New Group"
                        closable={false}
                        footer={null}
                        destroyOnClose={true}
                    >
                        <GroupForm mode="create" closeModal={this.closeCreateGroupModel} />
                    </Modal>
                    <Modal
                        visible={this.state.createTodo}
                        title="Create New Todo"
                        closable={false}
                        footer={null}
                        destroyOnClose={true}
                    >
                        <TodoForm mode="create" closeModal={this.closeCreateTodoModel} />
                    </Modal>
                </Card>
            )
        }
        const extra = [
            <Button key={0} style={{ width: 100, marginRight: 20 }} onClick={this.onCancleSortGroup}>Cancel</Button>,
            <Button key={1} style={{ width: 100 }} type="primary" onClick={this.onSaveSortGroup}>Save</Button>
        ]
        const SortableItem = SortableElement(({ group }) => <Card><Icon style={{ fontSize: 16, marginRight: 4 }} type="bars" />{group.name}</Card>);
        const SortableList = SortableContainer(({ groups }) => (
            <div>
                {groups.map((group, index) => <SortableItem key={index} index={index} group={group} />)}
            </div>
        ));
        const onSortEnd = ({ oldIndex, newIndex }) => {
            this.setState({
                groups: arrayMove(this.state.groups, oldIndex, newIndex)
            });
        }
        return (
            <Card extra={extra}>
                <SortableList groups={this.state.groups} onSortEnd={onSortEnd} />
            </Card>
        )

    }

    onCreateGroup = () => {
        this.setState({ createGroup: true });
    }

    onCreateTodo = () => {
        this.setState({ createTodo: true });
    }

    closeCreateGroupModel = () => {
        this.setState({ createGroup: false });
    }

    closeCreateTodoModel = () => {
        this.setState({ createTodo: false });
    }

    onCancleSortGroup = () => {
        this.setState({ groups: this.props.groups, sortGroups: false });
    }

    onSaveSortGroup = async () => {
        const tasks = [];
        this.state.groups.forEach((group, idx) => {
            this.props.updateGroup(group.id, { sort: idx });
            tasks.push(axios.patch('http://localhost:5000/todoGroup/' + group.id, { sort: idx }))
        });
        const res = await Promise.all(tasks).catch(e => { return message.error('Sorted failed') });
        message.success('Groups Sorted!');
        this.setState({ sortGroups: false })
    }
}

function mapStateToProps(state) {
    return {
        groups: state.groups.sort(compareFunc),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getAllTodos, getAllGroups, updateGroup }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

