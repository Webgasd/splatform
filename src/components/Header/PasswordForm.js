import React,{Component} from 'react';
import {Form, Input} from 'antd';
const FormItem = Form.Item;

class PasswordForm extends Component{
    checkPassword = (rule, value, callback) => {
        let reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~.!+@#$%^&*])[\da-zA-Z~.!+@#$%^&*]{8,}$/;
        if (!value) {
            callback('请输入密码!');
        } else if (!reg.test(value)) {
            callback('必须包含英文字母、数字、特殊符号且大于等于8位');
        } else {
            callback();
        }
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span:8},
            wrapperCol: {span: 16}
        };
        return (
            <Form>
                <FormItem label="请输入原密码" {...formItemLayout}>
                    {
                        getFieldDecorator('password',{
                            initialValue:''
                        })(
                            <Input type="password" placeholder="请输入原密码"/>
                        )
                    }
                </FormItem>
                <FormItem label="请输入新密码" {...formItemLayout}>
                    {
                        getFieldDecorator('newPassword1',{
                            initialValue:'',
                            rules: [
                                {validator: this.checkPassword},
                            ]
                        })(
                            <Input type="password" placeholder="请输入新密码"/>
                        )
                    }
                </FormItem>
                <FormItem label="再次输入密码" {...formItemLayout}>
                    {
                        getFieldDecorator('newPassword2',{
                            initialValue:'',
                            rules: [
                                {validator: this.checkPassword},
                            ]
                        })(
                            <Input type="password" placeholder="再次输入密码"/>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}

export default Form.create({})(PasswordForm);