import React,{Component} from 'react'
import { Input,Select,DatePicker } from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import moment from "moment";
import axios from "../../../../axios";
const Option = Select.Option;
@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class MedicalUse extends Component {
    state={categoryList:[],licenceList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getCateAndLicence',
            data:{
                params:{id:8}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    categoryList:res.data.categoryList,
                    licenceList:res.data.licenceList
                })
            }
        })
    }
    changeInput=(value,option)=>{
        let medicalUse = this.props.input.medicalUse||{};
        medicalUse[option]=value;
        let input = {...this.props.input,medicalUse}
        this.props.changeEnterprise(input);
    }
    changeGiveTime=(value,option)=>{
        let medicalUse = this.props.input.medicalUse||{};
        medicalUse[option]=value;
        medicalUse.startTime=value;
        let input = {...this.props.input,medicalUse}
        this.props.changeEnterprise(input);
    }
    render(){
        const formData=this.props.input.medicalUse||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return(
            <table>
                <tr>
                    <td>登记号<span style={{color:'#FF3300'}}>*</span></td>
                    <td><Input value={formData.registerNumber} onChange={(e)=>this.changeInput(e.target.value,"registerNumber")} placeholder={"请输入登记号"}  disabled={checkStatus}/></td>
                    <td>监管类别</td>
                    <td><Input value={formData.superviseCategory} onChange={(e)=>this.changeInput(e.target.value,"superviseCategory")} placeholder={"请输入监管类别"}  disabled={checkStatus}/></td>
                    <td>发证机关<span style={{color:'#FF3300'}}>*</span></td>
                    <td><Select placeholder={"请选择发证机关"} value={formData.lssueAuthority} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"lssueAuthority")}  disabled={checkStatus}>
                        {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                    </Select></td>
                </tr>
                <tr>
                    <td>发证日期<span style={{color:'#FF3300'}}>*</span></td>
                    <td><DatePicker style={{width:'100%'}}
                                    disabled={checkStatus}
                                    value={formData.giveTime==null?null:moment(formData.giveTime)}
                                    onChange={(date)=>this.changeGiveTime(date,'giveTime')}
                                    placeholder="请输入发证时间" format="YYYY-MM-DD"/></td>
                    <td>开始日期<span style={{color:'#FF3300'}}>*</span></td>
                    <td><DatePicker style={{width:'100%'}}
                                    disabled={checkStatus}
                                    value={formData.startTime==null?null:moment(formData.startTime)}
                                    onChange={(date)=>this.changeInput(date,'startTime')}
                                    placeholder="请选择开始时间" format="YYYY-MM-DD"/></td>
                    <td>结束日期<span style={{color:'#FF3300'}}>*</span></td>
                    <td><DatePicker
                        style={{width:'100%'}}
                        disabled={checkStatus}
                        value={formData.endTime==null?null:moment(formData.endTime)}
                        onChange={(date)=>this.changeInput(date,'endTime')}
                        placeholder="请输入截至时间" format="YYYY-MM-DD"/></td>
                </tr>
                <tr>
                    <td>诊疗科目</td>
                    <td colSpan={5}><Input.TextArea rows={3} value={formData.medicalSubject} onChange={(e)=>this.changeInput(e.target.value,"medicalSubject")}  disabled={checkStatus}/></td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colSpan={5}><Input.TextArea rows={3} value={formData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")}  disabled={checkStatus}/></td>
                </tr>
            </table>
        );
    }
}
export default MedicalUse;