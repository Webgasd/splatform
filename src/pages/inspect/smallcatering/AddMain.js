import {Component} from "react";
import {Button, Input, Select} from "antd";
import React from "react";
import {connect} from "react-redux";
import {changeInputValue, changeSelectValue} from "../../../redux/action";
import axios from "../../../axios";


const Option = Select.Option;

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

class AddMain extends Component{
    changeInput(target){
        this.props.changeInputValue(target.name,target.value)
    }
    changeSelect(value,option){
        this.props.changeSelectValue(option,value)
    }
    handleAddSubmit = ()=>{
        console.log(this.props.input,this.props.select)
        axios.ajax({
            url:'/inspect/dailyFood/insert',
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
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td >检查对象类型</td>
                        <td >
                        <Select placeholder={"请选择类型"}style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"checkType")}>
                            <Option value="检查类型">检查类型</Option>
                            <Option value="日常检查">日常检查</Option>
                            <Option value="1">1</Option>
                        </Select>
                        </td>
                        <td>被检查对象</td>
                        <td >
                        <Select placeholder={"请选择对象"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"checkObject")}>
                            <Option value="被检对象">被检对象</Option>
                            <Option value="1">1</Option>
                        </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>所属区域</td>
                        <td >
                            <Select placeholder={"请选择所属区域"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"region")}>
                                <Option value={"所属区域"}>所属区域</Option>
                                <Option value={"大明湖街道"}>大明湖街道</Option>
                                <Option value={"1"}>1</Option>
                            </Select>
                        </td>
                        <td>所属网格</td>
                        <td >
                            <Select placeholder={"请选择所属网格"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"region")}>
                                <Option value={"所属网格"}>所属网格</Option>
                                <Option value={"一区"}>一区</Option>
                                <Option value={"1"}>1</Option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>检查地址</td>
                        <td colSpan={7}><Input placeholder={"请输入检查地址"} name={"checkAddress"} onChange={(e)=>this.changeInput(e.target)}/></td>
                    </tr>
                    <tr>
                        <td>许可证号</td>
                        <td ><Input placeholder={"请输入许可证号"} name={"supervisorNumber"} onChange={(e)=>this.changeInput(e.target)}/></td>
                        <td>被检单位负责人</td>
                        <td ><Input placeholder={"请输入被检单位负责人"} name={"chargePerson"} onChange={(e)=>this.changeInput(e.target)}/></td>
                    </tr>
                    <tr>
                        <td>检查机构</td>
                        <td ><Input placeholder={"请输入检查机构"} name={"checkOrgan"} onChange={(e)=>this.changeInput(e.target)}/></td>
                        <td>联系方式</td>
                        <td ><Input placeholder={"请输入联系方式"} name={"contactPhone"} onChange={(e)=>this.changeInput(e.target)}/></td>
                    </tr>
                    <tr>
                        <td>陪同人员</td>
                        <td><Input placeholder={"请输入陪同人员"} name={"entourage"} onChange={(e)=>this.changeInput(e.target)}/></td>
                        <td>执法证号</td>
                        <td><Input placeholder={"请输入执法证号"} name={"supervisorNumber"} onChange={(e)=>this.changeInput(e.target)}/></td>
                    </tr>
                    <tr>
                        <td>执法人员</td>
                        <td colSpan={7}>
                        <Select placeholder={"请选择执法人员"} style={{width:"100%"}} onChange={(value)=>this.changeSelect(value,"supervisor")}>
                            <Option value={"执法人员"}>执法人员</Option>
                            <Option value={"王兵，陶瑜"}>王兵，陶瑜</Option>
                        </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>检查时间</td>
                        <td colSpan={7}><Input placeholder={"请输入检查时间"} name={"checkDate"} onChange={(e)=>this.changeInput(e.target)}/></td>
                    </tr>
                    <tr>
                        <td>执法证号最后一次检查日期</td>
                        <td colSpan={7}><Input placeholder={"请输入最后一次检查日期"} name={"lastCheckTime"} onChange={(e)=>this.changeInput(e.target)}/></td>
                    </tr>
                    <Button style={{marginTop:10,marginLeft:320}} type="primary" onClick={()=>this.handleAddSubmit()}>添加</Button>
                    </tbody>
                </table>
            </div>
        )
    }
}
export default AddMain