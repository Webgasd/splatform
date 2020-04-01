import  React from 'react'
import { Form, Select, Input, Button } from 'antd';
import InputNumber from "antd/es/input-number";
import { commonUrl } from "../../../axios/commonSrc";
import axios from "../../../axios";
import { ChromePicker } from 'react-color';
import ColorSelect from './ColorPicker'
const { Option } = Select;
class Saveform  extends React.Component{
    constructor(props){
        super(props)
        this.state={
            color:this.props.color,
            border:this.props.border
        }
    }
    componentDidMount() {
        console.log(this.props.areaId)
        console.log(this.props.data.length)
    }
    handleSubmit = e => {
        const data=this.props.data;
        let data1=[];
        data.map((item,index)=>{
            data1.push(item.lat);
            data1.push(item.lng);
        });
        let data2=data1.join(',');
        // data1 = JSON.stringify(data2)//不要用stringify ,不然会有很麻烦
        ////计算中心点
        let oooo=this.calculateCenter(data)
        //////
        let center1=[];
        center1.push(oooo.lat);
        center1.push(oooo.lng);
        let center2=center1.join(",")
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.PostAjax({
                    url:this.props.state=='add'?"/grid/grid/insert":"/grid/grid/update",
                    data: {
                        params:{
                            polygon:data2,center:center2,areaId:this.props.areaId[0],
                           ...values
                        }
                    }
                }).then((res)=>{
                    if(res.status == "success"){
                        this.props.cancelModal()
                    }
                })
            }
        });
    };
    calculateCenter=(lnglatarr)=>{
        var total = lnglatarr.length;
        var X=0,Y=0,Z=0;
        lnglatarr.map((lnglat,index)=>{
            var lng = lnglat.lng * Math.PI / 180;
            var lat = lnglat.lat * Math.PI / 180;
            var x,y,z;
            x = Math.cos(lat) * Math.cos(lng);
            y = Math.cos(lat) * Math.sin(lng);
            z = Math.sin(lat);
            X += x;
            Y += y;
            Z += z;
        })
        X = X/total;
        Y = Y/total;
        Z = Z/total;
        var Lng = Math.atan2(Y,X);
        var Hyp = Math.sqrt(X*X + Y*Y);
        var Lat = Math.atan2(Z,Hyp);
        return new window.AMap.LngLat(Lng*180/Math.PI,Lat*180/Math.PI);
    }
    updateColor=(key,color)=>{
        this.setState({
            color,
            key
        })
        this.props.form.setFieldsValue({["color"]:color})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return(
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
                <Form.Item label="网格颜色">
                    {getFieldDecorator('color', {
                        initialValue:this.state.color,
                        rules: [{ required: true, message: '输入网格颜色' }],
                    })(
                        <ColorSelect
                           style={{ verticalAlign: "middle" }}
                           color={this.state.color} //编辑的时候，用于颜色的回显
                           objKey = {this.state.color} //因页面多次使用，传入key值，用于区分色块更新，因key是关键字，这里使用了objKey作为属性名
                           updateColor = {this.updateColor} //传入父组件方法，更新颜色的拾取
                        />
                    )}
                </Form.Item>
                <Form.Item label="网格框边宽">
                    {getFieldDecorator('border', {
                        rules: [{ required: true, message: '输入网格边宽' }],
                        initialValue:'1'
                    })(
                        <InputNumber min={1} max={4}/>
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
        )
    }
}
export const Saveform1 = Form.create({ name: 'coordinated' })(Saveform);