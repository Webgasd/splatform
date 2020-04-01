import React,{Component} from 'react';
import {Form, Input, DatePicker} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

class Output extends Component{
    state={}
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="起始日期" {...formItemLayout}>
                    {
                        getFieldDecorator('start', {
                            initialValue:moment(this.start),
                            rules: [
                                {
                                    required: true,
                                    message: '请正确输入起始日期!',
                                },
                            ],
                        })(
                            <DatePicker showTime={true} placeholder="请输入晨检日期" format="YYYY-MM-DD HH:mm:ss" />
                        )
                    }
                </FormItem>

                <FormItem label="截止日期" {...formItemLayout}>
                    {
                        getFieldDecorator('end', {
                            initialValue:moment(this.end),
                            rules: [
                                {
                                    required: true,
                                    message: '请正确填写截止日期!',
                                },
                            ],
                        })(
                            <DatePicker showTime={true} placeholder="请输入晨检日期" format="YYYY-MM-DD HH:mm:ss" />
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(Output);