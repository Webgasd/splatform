import React,{Component} from 'react';
import {Form, Input,Select} from 'antd';
import axios from '../../../axios'
const FormItem = Form.Item;
const Option = Select.Option;

class RecordForm extends Component{
    state={
        list:[]
    }
    params = {
        pageNo:1
    }
    componentDidMount() {
        this.getIllegality()
    }
    getIllegality = () =>{
        let _this = this
        axios.PostAjax({
            url:"/inspect/lllegality/getPage",
            data:{
                params:this.params
            }
        }).then((res) => {
            if(res.status == "success"){
                _this.setState({
                    list:res.data.data
                })
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const recordInfo = this.props.recordInfo || {};
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="违法类型" {...formItemLayout}>
                    {
                        getFieldDecorator('name',{
                            initialValue:recordInfo.name
                        })(
                            <Select style={{ width: 200 }}>
                                {this.state.list.map( (item,index) => {
                                    return(
                                        <Option key={index} value={item.id}>{item.name}</Option>
                                    )
                                })}
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