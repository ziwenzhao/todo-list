import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { Card, Row, Col, Button, Menu, Icon, Dropdown, Modal, message } from 'antd';
import _ from 'lodash';
import update from 'react-addons-update';
import GroupForm from './group-form';
import TodoList from './todo-list';
import { deleteGroup } from '../actions/group-action';

class TodoGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editGroup: false,
            selectedGroup: null,
            sortTodos: {}
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (props.groups && props.groups.length !== 0 && _.isEmpty(state.sortTodos)) {
            props.groups.forEach(group => {
                state.sortTodos[group.id] = false;
            });
            return { sortTodos: state.sortTodos }
        }
        return state;
    }
    render() {
        return (
            <div>
                <Modal
                    visible={this.state.editGroup}
                    title="Rename Group"
                    closable={false}
                    footer={null}
                    destroyOnClose={true}
                >
                    <GroupForm mode="edit" group={this.state.selectedGroup} closeModal={() => this.setState({ editGroup: false })}></GroupForm>
                </Modal>
                {this.renderGroups()}
            </div>
        )
    }

    renderGroups() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a href="javascript:void(0);" onClick={() => this.setState({ editGroup: true })}>Rename</a>
                </Menu.Item>
                <Menu.Item>
                    <a href="javascript:void(0);" onClick={this.onDelete}>Delete</a>
                </Menu.Item>
            </Menu>
        );
        return this.props.groups.map(group => {
            return (
                <Card className="todo-item" key={group.id} bordered={false} >
                    <div className="group-header">
                        <Row>
                            <Col span={12}>
                                <p className="group-title">{group.name}</p>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Dropdown className="group-button" overlay={menu} onVisibleChange={() => this.setState({ selectedGroup: group })} placement="bottomLeft">
                                    <a href="javascript:void(0);" className="group-button">
                                        Edit
                                        <Icon style={{ marginLeft: 4 }} type="down" />
                                    </a>
                                </Dropdown>
                                <a href="javascript:void(0);" onClick={() => { this.toggleSortTodos(group.id) }} className="group-button">
                                    {this.state.sortTodos[group.id] === true ? 'Done' : 'Sort'}
                                </a>
                            </Col>
                        </Row>
                    </div>
                    <TodoList groupId={group.id} sortTodos={this.state.sortTodos[group.id]} />
                </Card>
            )
        })
    }

    onDelete = () => {
        const deleteConfirmModal = Modal.confirm({
            title: 'Delete Confirmation',
            content: 'Do you want to delete this group?',
            onOk: async () => {
                const res = await axios.get('http://localhost:5000/todos/findByGroupId/' + this.state.selectedGroup.id).catch(e => { return message.error(e) });
                if (res.data.length !== 0) {
                    Modal.error({
                        title: 'Delete Error',
                        content: 'The group cannot be deleted because it has todos in it!',
                        width: 500
                    });
                } else {
                    await axios.delete('/todoGroup/' + this.state.selectedGroup.id).catch(e => { return message.error(e) });
                    message.success('Group Deleted!');
                    this.props.deleteGroup(this.state.selectedGroup.id);
                }
            }
        })
    }

    toggleSortTodos(id) {
        const sortTodos = this.state.sortTodos;
        sortTodos[id] = !sortTodos[id];
        this.setState({ sortTodos: sortTodos });
    }

}

function mapStateToProps(state) {
    return {
        groups: state.groups,
        todos: state.todos
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteGroup }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoGroups);