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
class FoodCommon extends Component {
    state={categoryList:[],licenceList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getCateAndLicence',
            data:{
                params:{id:2}
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
        let foodCommon = this.props.input.foodCommon||{};
        foodCommon[option]=value;
        let input = {...this.props.input,foodCommon}
        this.props.changeEnterprise(input);
    }
    changeEndDate=(value,option)=>{
        let foodCommon = this.props.input.foodCommon||{};
        foodCommon[option]=value;
        if(foodCommon.startTime){
            foodCommon.endTime=moment(foodCommon.startTime).add(value,'years').subtract(1,'day');
        }
        let input = {...this.props.input,foodCommon}
        this.props.changeEnterprise(input);
    }
    changeGiveTime=(value,option)=>{
        let foodCommon = this.props.input.foodCommon||{};
        foodCommon[option]=value;
        foodCommon.startTime=value;
        let input = {...this.props.input,foodCommon}
        this.props.changeEnterprise(input);
    }
    render(){
        const formData=this.props.input.foodCommon||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return(
            <table>
              <tr>
                  <td>证号<span style={{color:'#FF3300'}}>*</span></td>
                  <td colSpan={5}><Input value={formData.number} onChange={(e)=>this.changeInput(e.target.value,"number")} placeholder={"请输入证号"}  disabled={checkStatus}/></td>
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
                        disabled={checkStatus}
                        style={{width:'100%'}}
                        value={formData.endTime==null?null:moment(formData.endTime)}
                        onChange={(date)=>this.changeInput(date,'endTime')}
                        showTime={true} placeholder="请输入截至时间" format="YYYY-MM-DD"/></td>
                </tr>
                <tr>
                    <td>有效期(年)</td>
                    <td><NumericInput value={formData.validityAge} onChange={(value)=>this.changeEndDate(value,"validityAge")}  disabled={checkStatus}/></td>
                    <td>类别<span style={{color:'#FF3300'}}>*</span></td>
                    <td><Select placeholder={"请选择类别"} value={formData.businessType} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"businessType")}  disabled={checkStatus}>
                        {this.state.categoryList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                    </Select></td>
                    <td>发证机关<span style={{color:'#FF3300'}}>*</span></td>
                    <td><Select placeholder={"请选择发证机关"} value={formData.licenseAuthority} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"licenseAuthority")}  disabled={checkStatus}>
                        {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                    </Select></td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colSpan={5}><Input.TextArea value={formData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")} rows={5}  disabled={checkStatus}/></td>
                </tr>
            </table>
        );
    }
}
export default FoodCommon;