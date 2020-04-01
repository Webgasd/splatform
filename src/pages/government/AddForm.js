import React,{Component} from 'react';
import {connect} from 'react-redux'
import {changeInputValue, changeSelectValue} from "../../redux/action";
import {Form, Button, Select,Row, Col, Input, Tabs} from 'antd';
import axios from "../../axios";
import Utils from "../../utils";
const Option = Select.Option;
const TabPane=Tabs.TabPane

@connect(
    state=>({
        select:state.select,
        input:state.input
    }),
    {
        changeInputValue,
        changeSelectValue
    }
)

class Add extends Component{
    changeInput(target){
        this.props.changeInputValue(target.name,target.value)
    }
    changeSelect(value,option){
        this.props.changeSelectValue(option,value)
    }


    handleAddSubmit = ()=>{
        console.log(this.props.input,this.props.select)
                axios.ajax({
                    url:'/supervisor/insert',
                    data:{
                        params:{
                            ...this.props.input,
                            ...this.props.select
                        }
                    }
                }).then((res)=>{
                    if(res){
                        console.log(res)
                        // this.setState({
                        //     isaddVisible:false
                        // })
                        // this.requestList();
                    }
                })
    }

    render() {
        return (
            <div className="commonEnterpriseBox">
                <Tabs>
                    <TabPane tab="1.基本信息" key="1">
                <table>
                    <tbody>
                    <Row>
                        <Col span={18}>
                            <card>
                                <tr>
                                    <td>单位名称</td>
                                    <td ><Input placeholder={"请输入单位名称"} name={"unit"} onChange={(e)=>this.changeInput(e.target)}/></td>
                                    <td>部门名称</td>
                                    <td >
                                        <Select placeholder={"请选择部门"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"department")}>
                                            <Option value={"办公室"}>办公室</Option>
                                            <Option value={"科员"}>科员</Option>
                                        </Select>
                                    </td>
                                    <td>姓名</td>
                                    <td ><Input placeholder={"请输入姓名"} name={"name"} onChange={(e)=>this.changeInput(e.target)}/></td>
                                </tr>
                                <tr>
                                    <td>性别</td>
                                    <td >
                                        <Select placeholder={"请选择性别"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"sex")}>
                                            <Option value={"男"}>男</Option>
                                            <Option value={"女"}>女</Option>
                                        </Select>
                                    </td>
                                    <td>职务</td>
                                    <td>
                                        <Select placeholder={"请选择职务"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"duties")}>
                                            <Option value={"科员"}>科员</Option>
                                            <Option value={"监管"}>监管</Option>
                                        </Select>
                                    </td>
                                    <td>类型</td>
                                    <td>
                                        <Select placeholder={"请选择类型"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"type")}>
                                            <Option value={"青岛市黄岛区"}>青岛市黄岛区</Option>
                                            <Option value={"硕士"}>硕士</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>身份证号</td>
                                    <td><Input placeholder={"请输入身份证号"} name={"idNumber"} onChange={(e)=>this.changeInput(e.target)}/></td>
                                    <td>执法证号</td>
                                    <td><Input placeholder={"请输入执法证号"} name={"number"} onChange={(e)=>this.changeInput(e.target)}/></td>
                                    <td>移动电话</td>
                                    <td><Input placeholder={"请输入移动电话"} name={"telephone"} onChange={(e)=>this.changeInput(e.target)}/></td>
                                </tr>
                                <tr>
                                    <td>办公电话</td>
                                    <td><Input placeholder={"请输入办公电话"} name={"officePhone"} onChange={(e)=>this.changeInput(e.target)}/></td>
                                    <td>序号</td>
                                    <td><Input placeholder={"请输入序号"} name={"id"} onChange={(e)=>this.changeInput(e.target)}/></td>
                                    <td>工作移动电话</td>
                                    <td><Input placeholder={"请输入工作移动电话"} name={"workMobilePhone"} onChange={(e)=>this.changeInput(e.target)}/></td>
                                </tr>
                                {/*<tr>*/}
                                    {/*<td>人员类别</td>*/}
                                    {/*<td>*/}
                                        {/*<Select placeholder={"请选择类型"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"ss")}>*/}
                                            {/*<Option value={"青岛市黄岛区"}>青岛市黄岛区</Option>*/}
                                            {/*<Option value={"硕士"}>硕士</Option>*/}
                                        {/*</Select>*/}
                                    {/*</td>*/}
                                {/*</tr>*/}
                            </card>
                        </Col>
                        <Col span={6}>
                            <card>
                                <Button style={{marginTop:170,marginLeft:70}}  className="ant-upload-text" type="primary">Upload</Button>
                            </card>
                        </Col>
                    </Row>
                        <Button style={{marginTop:10,marginLeft:320}} type="primary" onClick={()=>this.handleAddSubmit()}>添加</Button>
                    </tbody>
                </table>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Add;