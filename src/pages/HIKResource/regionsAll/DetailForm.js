import React,{Component} from 'react';
import {Card,Table,Input,DatePicker,Select,Form} from "antd";
import TextArea from 'antd/lib/input/TextArea';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;


export default class DetailForm extends Component {
    render() {
        const userInfo = this.props.userInfo || {};
        const type=this.props.type;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };
        return (


            <Form >

                <FormItem label="索引代码" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.indexCode:
                            getFieldDecorator('indexCode',{
                                initialValue:userInfo.indexCode,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写类别名称',
                                    }]
                            })(
                                <Input/>
                            )
                    }
                </FormItem>

                <FormItem label="名称" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.name:
                            getFieldDecorator('name',{
                                initialValue:userInfo.name,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写类别名称',
                                    }]
                            })(
                                <Input/>
                            )
                    }
                </FormItem>

                <FormItem label="上级索引代码" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.parentIndexCode:
                            getFieldDecorator('parentIndexCode',{
                                initialValue:userInfo.parentIndexCode,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写类别名称',
                                    }]
                            })(
                                <Input/>
                            )
                    }
                </FormItem>

                <FormItem label="树节点代码" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.treeCode:
                            getFieldDecorator('treeCode',{
                                initialValue:userInfo.treeCode,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写类别名称',
                                    }]
                            })(
                                <Input/>
                            )
                    }
                </FormItem>

            </Form>

        );
    }

}
DetailForm = Form.create({})(DetailForm);