import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { addGroup, updateGroup } from '../actions/group-action'

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateGroupForm extends Component {
    componentDidMount() {
        if (this.props.mode === 'edit') {
            this.props.form.setFieldsValue({
                name: this.props.group.name
            });
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
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="Group Name">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please input group name!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: 10 }}
                    >
                        {this.props.mode === 'create' ? 'Create' : 'Rename'}
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
                if (this.props.mode === 'create') {
                    axios.post('http://localhost:5000/todoGroup', { name: values.name })
                        .then(res => {
                            message.success('Group Created!');
                            this.props.addGroup(res.data);
                            this.props.closeModal();
                        })
                        .catch(e => { return message.error(e) });
                } else {
                    axios.patch(`http://localhost:5000/todoGroup/${this.props.group.id}`, { name: values.name })
                        .then(res => {
                            message.success('Group Renamed!');
                            this.props.updateGroup(this.props.group.id, { name: res.data.name });
                            this.props.closeModal();
                        })
                }

            }
        })
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addGroup, updateGroup }, dispatch);
}
const container = connect(undefined, mapDispatchToProps)(CreateGroupForm);

export default Form.create()(container);
