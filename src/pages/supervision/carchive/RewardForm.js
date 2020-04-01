import React,{Component} from 'react';
import {Form, Input,Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

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
                <FormItem label="顺序" {...formItemLayout}>
                    {
                        getFieldDecorator('name',{
                            initialValue:recordInfo.name
                        })(
                            <Select style={{ width: 200 }}>
                                <Option value={"1"}>行政处罚</Option>
                                <Option value={"2"}>别的处罚</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="内容" {...formItemLayout}>
                    {
                        getFieldDecorator('content',{
                            initialValue:recordInfo.seq
                        })(
                            <Input.TextArea rows={3}/>
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