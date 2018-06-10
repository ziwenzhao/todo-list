import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { Input, Select, Form, Button, message } from 'antd';
import { addTodo, updateTodo } from '../actions/todo-action';
const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;


class CreateTodoForm extends Component {
    componentDidMount() {
        if (this.props.mode === 'edit') {
            this.props.form.setFieldsValue({
                title: this.props.todo.title,
                description: this.props.todo.description,
                groupId: this.props.todo.groupId
            })
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const groupOptions = this.props.groups.map(group => <Option key={group.id} value={group.id}>{group.name}</Option>)
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="Title">
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: 'Please input title!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="Description">
                    {getFieldDecorator('description')(
                        <TextArea />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="Group">
                    {getFieldDecorator('groupId', {
                        rules: [{ required: true, message: 'Please select a group!' }],
                    })(
                        <Select>
                            {groupOptions}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: 10 }}
                        onClick={this.onCreate}
                    >
                        {this.props.mode === 'create' ? 'Create' : 'Edit'}
                    </Button>
                    <Button onClick={this.onCancel}>
                        Cancel
                    </Button>
                </FormItem>
            </Form>
        );
    }

    onCancel = () => {
        this.props.closeModal();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error('Form has invalid fields');
            } else {
                const todo = {
                    ...this.props.form.getFieldsValue(),
                    groupName: this.props.groups.find(group => group.id === this.props.form.getFieldValue('groupId')).name
                };
                if (this.props.mode === 'create') {
                    axios.post('http://localhost:5000/todos', todo)
                        .then(res => {
                            message.success('Todo Created!');
                            this.props.addTodo(res.data);
                            this.props.closeModal();
                        })
                        .catch(e => { return message.error(e) });
                } else {
                    axios.patch('http://localhost:5000/todos/' + this.props.todo.id, todo)
                        .then(res => {
                            message.success('Todo Updated!');
                            this.props.updateTodo(this.props.todo.id, todo);
                            this.props.closeModal();
                        })
                }

            }
        })
    }
}

function mapStateToProps(state) {
    return {
        groups: state.groups
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addTodo, updateTodo }, dispatch);
}


const container = connect(mapStateToProps, mapDispatchToProps)(CreateTodoForm);

export default Form.create()(container);