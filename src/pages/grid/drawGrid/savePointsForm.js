import React from 'react';
import { Form, Select, Input, Button,InputNumber } from 'antd';
import { commonUrl } from "../../../axios/commonSrc";
const { Option } = Select;
class SavePointsForm extends React.Component{
    constructor(props){
        super(props)
    }
    handleSubmit = e => {
        e.preventDefault();
        let points=this.props.data;
        let points1=[]
        points1.push(points.lat);
        points1.push(points.lng);
        let points2=points1.join(",")
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const subdata={...values,point:points2};
                let url=commonUrl+"/points/insert";
                fetch(url,{
                    method : 'POST',
                    mode:"cors",
                    headers:{
                        'Content-type':'application/json'
                    },
                    body:JSON.stringify(subdata),
                }).then(res =>res.json())
                    .then(data=>{
                        if(data.isInsert===true){
                            console.log(data)
                        }
                    })
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
                <Form.Item label="areaid" >
                    {getFieldDecorator('areaid', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(<InputNumber />)}
                </Form.Item>
                <Form.Item label="店名" >
                    {getFieldDecorator('pointname', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="负责人" >
                    {getFieldDecorator('charger', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="联系方式" >
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="地址" >
                    {getFieldDecorator('address', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="店铺信息" >
                    {getFieldDecorator('infomation', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
export const Form1 = Form.create({ name: 'coordinated' })(SavePointsForm);

