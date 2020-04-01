import React,{Component} from 'react';
import {Form, Input, DatePicker} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

class CheckForm extends Component{
    state={}
    render(){
        const { getFieldDecorator } = this.props.form;
        const checkInfo = this.props.checkInfo || {};
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="晨检日期" {...formItemLayout}>
                    {
                        getFieldDecorator('morningcheckTime',{
                            initialValue:checkInfo.morningcheckTime===''?moment():moment(checkInfo.morningcheckTime)
                        })(
                            <DatePicker showTime={true} placeholder="请输入晨检日期" format="YYYY-MM-DD HH:mm:ss" />
                        )
                    }
                </FormItem>

                        <FormItem label="晨检记录：" {...formItemLayout}>
                            {
                                getFieldDecorator('morningcheckContent',{
                                    initialValue:checkInfo.morningcheckContent
                                })(
                                    <Input type="text" placeholder="请输入内容"/>
                                )
                            }
                        </FormItem>
                        <FormItem label="原因" {...formItemLayout}>
                            {
                                getFieldDecorator('reason',{
                                    initialValue:checkInfo.reason
                                })(
                                    <Input type="text" placeholder="请输入原因"/>
                                )
                            }
                        </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('id',{
                            initialValue:checkInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(CheckForm);