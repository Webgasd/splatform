import React,{Component} from 'react';
import { Input,Select,DatePicker } from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import moment from "moment";
import axios from "../../../../axios";
import NumericInput from "../../../../components/NumericInput";
const Option = Select.Option;
@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class CosmeticsUse extends Component {
    state={categoryList:[],licenceList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getCateAndLicence',
            data:{
                params:{id:9}
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
        let cosmeticsUse = this.props.input.cosmeticsUse||{};
        cosmeticsUse[option]=value;
        let input = {...this.props.input,cosmeticsUse}
        this.props.changeEnterprise(input);
    }
    changeEndDate=(value,option)=>{
        let cosmeticsUse = this.props.input.cosmeticsUse||{};
        cosmeticsUse[option]=value;
        if(cosmeticsUse.startTime){
            cosmeticsUse.endTime=moment(cosmeticsUse.startTime).add(value,'years').subtract(1,'day');
        }
        let input = {...this.props.input,cosmeticsUse}
        this.props.changeEnterprise(input);
    }
    changeGiveTime=(value,option)=>{
        let cosmeticsUse = this.props.input.cosmeticsUse||{};
        cosmeticsUse[option]=value;
        cosmeticsUse.startTime=value;
        let input = {...this.props.input,cosmeticsUse}
        this.props.changeEnterprise(input);
    }
    render(){
        const formData=this.props.input.cosmeticsUse||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return(
            <table>
                <tr>
                    <td>登记号<span style={{color:'#FF3300'}}>*</span></td>
                    <td><Input value={formData.registerCode} onChange={(e)=>this.changeInput(e.target.value,"registerCode")} placeholder={"请输入登记号"}  disabled={checkStatus}/></td>
                    <td>有效期（年）</td>
                    <td><NumericInput value={formData.validityAge} onChange={(value)=>this.changeEndDate(value,"validityAge")} placeholder={"请输入有效期"}  disabled={checkStatus}/></td>
                    <td>发证机关<span style={{color:'#FF3300'}}>*</span></td>
                    <td><Select placeholder={"请选择发证机关"} value={formData.licenseAuthority} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"licenseAuthority")}  disabled={checkStatus}>
                            {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                        </Select></td>
                </tr>
                <tr>
                    <td>仓库地址</td>
                    <td colSpan={5}><Input value={formData.warehouse} onChange={(e)=>this.changeInput(e.target.value,"warehouse")}  disabled={checkStatus}/></td>
                </tr>
                <tr>
                    <td>发证日期<span style={{color:'#FF3300'}}>*</span></td>
                    <td><DatePicker style={{width:'100%'}}
                                    disabled={checkStatus}
                                    value={formData.giveTime==null?null:moment(formData.giveTime)}
                                    onChange={(date)=>this.changeGiveTime(date,'giveTime')}
                                    showTime={true} placeholder="请输入发证时间" format="YYYY-MM-DD"/></td>
                    <td>开始日期<span style={{color:'#FF3300'}}>*</span></td>
                    <td><DatePicker style={{width:'100%'}}
                                    disabled={checkStatus}
                                    value={formData.startTime==null?null:moment(formData.startTime)}
                                    onChange={(date)=>this.changeInput(date,'startTime')}
                                    showTime={true} placeholder="请选择开始时间" format="YYYY-MM-DD"/></td>
                    <td>结束日期<span style={{color:'#FF3300'}}>*</span></td>
                    <td><DatePicker
                        style={{width:'100%'}}
                        disabled={checkStatus}
                        value={formData.endTime==null?null:moment(formData.endTime)}
                        onChange={(date)=>this.changeInput(date,'endTime')}
                        showTime={true} placeholder="请输入截至时间" format="YYYY-MM-DD"/></td>
                </tr>
                <tr>
                    <td>许可项目</td>
                    <td colSpan={5}><Input.TextArea rows={3} value={formData.licenseProject} onChange={(e)=>this.changeInput(e.target.value,"licenseProject")}  disabled={checkStatus}/></td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colSpan={5}><Input.TextArea rows={3} value={formData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")}  disabled={checkStatus}/></td>
                </tr>
            </table>
        );
    }
}
export default CosmeticsUse;