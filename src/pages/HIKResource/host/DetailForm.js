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

                <FormItem label="host" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.hostNumber:
                            getFieldDecorator('hostNumber',{
                                initialValue:userInfo.hostNumber,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写host',
                                    }]
                            })(
                                <Input/>
                            )
                    }
                </FormItem>

                <FormItem label="appkey" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.appkey:
                            getFieldDecorator('appkey',{
                                initialValue:userInfo.appkey,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写appkey',
                                    }]
                            })(
                                <Input/>
                            )
                    }
                </FormItem>

                <FormItem label="appsecret" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.appsecret:
                            getFieldDecorator('appsecret',{
                                initialValue:userInfo.appsecret,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写appsecret',
                                    }]
                            })(
                                <Input/>
                            )
                    }
                </FormItem>

                <FormItem {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.id:
                            getFieldDecorator('id',{
                                initialValue:userInfo.id
                            })(
                                <Input type="hidden"/>
                            )
                    }
                </FormItem>

            </Form>

        );
    }

}
DetailForm = Form.create({})(DetailForm);