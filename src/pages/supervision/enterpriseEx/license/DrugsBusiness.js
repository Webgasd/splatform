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
class DrugsBusiness extends Component {
    state={categoryList:[],licenceList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getCateAndLicence',
            data:{
                params:{id:7}
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
        let drugsBusiness = this.props.input.drugsBusiness||{};
        drugsBusiness[option]=value;
        let input = {...this.props.input,drugsBusiness}
        this.props.changeEnterprise(input);
    }
    changeEndDate=(value,option)=>{
        let drugsBusiness = this.props.input.drugsBusiness||{};
        drugsBusiness[option]=value;
        if(drugsBusiness.startTime){
            drugsBusiness.endTime=moment(drugsBusiness.startTime).add(value,'years').subtract(1,'day');
        }
        let input = {...this.props.input,drugsBusiness}
        this.props.changeEnterprise(input);
    }
    changeGiveTime=(value,option)=>{
        let drugsBusiness = this.props.input.drugsBusiness||{};
        drugsBusiness[option]=value;
        drugsBusiness.startTime=value;
        let input = {...this.props.input,drugsBusiness}
        this.props.changeEnterprise(input);
    }
    render(){
        const formData=this.props.input.drugsBusiness||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return(
            <table>
               <tr>
                   <td>证号<span style={{color:'#FF3300'}}>*</span></td>
                   <td><Input value={formData.number} onChange={(e)=>this.changeInput(e.target.value,"number")} placeholder={"请输入证号"}  disabled={checkStatus}/></td>
                   <td>质量负责人</td>
                   <td><Input value={formData.qualityPerson} onChange={(e)=>this.changeInput(e.target.value,"qualityPerson")} placeholder={"请输入质量负责人"}  disabled={checkStatus}/></td>
                   <td>经营方式</td>
                   <td> <Select value={formData.operationMode} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"operationMode")}  disabled={checkStatus}>
                       <Option value="批发">批发</Option>
                       <Option value="零售（连锁总部）">零售（连锁总部）</Option>
                       <Option value="零售（连锁）">零售（连锁）</Option>
                       <Option value="零售">零售</Option>
                   </Select></td>
               </tr>
                <tr>
                    <td>仓库地址</td>
                    <td colSpan={5}><Input value={formData.warehouseAddress} onChange={(e)=>this.changeInput(e.target.value,"warehouseAddress")} placeholder={"请输入仓库地址"}  disabled={checkStatus}/></td>
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
                    <td>Gsp证号</td>
                    <td><Input value={formData.gspNumber} onChange={(e)=>this.changeInput(e.target.value,"gspNumber")} placeholder={"请输入证号"}  disabled={checkStatus}/></td>
                    <td>Gsp开始日期</td>
                    <td><DatePicker
                        style={{width:'100%'}}
                        disabled={checkStatus}
                        value={formData.gspStartTime==null?null:moment(formData.gspStartTime)}
                        onChange={(date)=>this.changeInput(date,'gspStartTime')}
                        showTime={true} placeholder="请输入截至时间" format="YYYY-MM-DD"/></td>
                    <td>Gsp结束日期</td>
                    <td><DatePicker
                        style={{width:'100%'}}
                        disabled={checkStatus}
                        value={formData.gspFinishTime==null?null:moment(formData.gspFinishTime)}
                        onChange={(date)=>this.changeInput(date,'gspFinishTime')}
                        showTime={true} placeholder="请输入截至时间" format="YYYY-MM-DD"/></td>
                </tr>
                <tr>
                    <td>有效期（年）</td>
                    <td><NumericInput value={formData.validityTime} onChange={(value)=>this.changeEndDate(value,"validityTime")}  disabled={checkStatus}/></td>
                    <td>发证机关<span style={{color:'#FF3300'}}>*</span></td>
                    <td> <Select placeholder={"请选择发证机关"} value={formData.licenseAuthority} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"licenseAuthority")}  disabled={checkStatus}>
                        {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                    </Select></td>
                </tr>
                <tr>
                    <td>经营范围</td>
                    <td colSpan={5}>
                        <Input.TextArea rows={1} value={formData.businessScope} onChange={(e)=>this.changeInput(e.target.value,"businessScope")}  disabled={checkStatus}/>
                    </td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colSpan={5}>
                        <Input.TextArea rows={3} value={formData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")}  disabled={checkStatus}/>
                    </td>
                </tr>
            </table>
        );
    }
}
export default DrugsBusiness;