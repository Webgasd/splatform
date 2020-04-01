import React,{Component} from 'react';
import {Form,Input} from 'antd';

const FormItem = Form.Item;


class AddForm extends Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span:8},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="inline">
                <FormItem label="菜单名称" {...formItemLayout}>
                    {
                        getFieldDecorator('navigation_name',{
                            initialValue:''
                        })(
                            <Input type="text" placeholder="请输入菜单名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="排序" {...formItemLayout}>
                    {
                        getFieldDecorator('navigation_arder',{
                            initialValue:''
                        })(
                            <Input type="text" placeholder="菜单排序"/>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(AddForm);