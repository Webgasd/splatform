import React,{Component} from 'react';
import {Form, Input, DatePicker} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;

class RecordForm extends Component{
    state={}
    render(){
        const { getFieldDecorator } = this.props.form;
        const recordInfo = this.props.recordInfo || {};
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="顺序" labelCol={{span:4}} wrapperCol={{span:18}}>
                    {
                        getFieldDecorator('seq',{
                            initialValue:recordInfo.seq
                        })(
                            <Input type="text" placeholder="顺序"/>
                        )
                    }
                </FormItem>
                <FormItem label="调离时间" {...formItemLayout}>
                    {
                        getFieldDecorator('transferTime',{
                            initialValue:recordInfo.transferTime===''?moment():moment(recordInfo.transferTime)
                        })(
                            <DatePicker showTime={true} placeholder="请输入调离时间" format="YYYY-MM-DD HH:mm:ss" />
                        )
                    }
                </FormItem>

                <FormItem label="调离原因" {...formItemLayout}>
                    {
                        getFieldDecorator('transferReason',{
                            initialValue:recordInfo.transferReason
                        })(
                            <Input type="text" placeholder="请输入调离原因"/>
                        )
                    }
                </FormItem>

                <FormItem label="原岗位" {...formItemLayout}>
                    {
                        getFieldDecorator('primaryPost',{
                            initialValue:recordInfo.primaryPost
                        })(
                            <Input type="text" placeholder="请输入原岗位"/>
                        )
                    }
                </FormItem>
                <FormItem label="新岗位" {...formItemLayout}>
                    {
                        getFieldDecorator('presentPost',{
                            initialValue:recordInfo.presentPost
                        })(
                            <Input type="text" placeholder="请输入新岗位"/>
                        )
                    }
                </FormItem>
                <FormItem label="登记时间" {...formItemLayout}>
                    {
                        getFieldDecorator('boardingTime',{
                            initialValue:recordInfo.boardingTime===''?moment():moment(recordInfo.boardingTime)
                        })(
                            <DatePicker showTime={true} placeholder="请输入开始时间" format="YYYY-MM-DD HH:mm:ss" />
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('id',{
                            initialValue:recordInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(RecordForm);