import React,{Component} from 'react';
import {Select,Input} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";

const Option = Select.Option;
const { TextArea } = Input;
@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class Manager extends Component{
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div  className='commonEnterpriseBox'>
                <div className='commonEnterpriseBoxHead'>食品安全管理人员</div>
                <table>
                    <tbody>
                    <tr>
                        <td>姓名<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.spName} onChange={(e)=>this.changeInput(e.target.value,"spName")} placeholder={"请输入姓名"} disabled={checkStatus}/></td>
                        <td>身份证号码<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={4}><Input value={formData.spidNumber} onChange={(e)=>this.changeInput(e.target.value,"spidNumber")} placeholder={"请输入身份证号码"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>固定电话</td>
                        <td><Input value={formData.spOfficePhone} onChange={(e)=>this.changeInput(e.target.value,"spOfficePhone")} placeholder={"请输入固定电话"} disabled={checkStatus}/></td>
                        <td>移动电话<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.spMobilePhone} onChange={(e)=>this.changeInput(e.target.value,"spMobilePhone")} placeholder={"请输入移动电话"} disabled={checkStatus}/></td>
                        <td>电子邮箱</td>
                        <td><Input value={formData.spEmail} onChange={(e)=>this.changeInput(e.target.value,"spEmail")} placeholder={"请输入电子邮箱"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>性别</td>
                        <td ><Select value={formData.spSexy} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"spSexy")}placeholder={"请选择性别"} disabled={checkStatus} >
                            <Option value="男" >男</Option>
                            <Option value="女">女</Option>
                        </Select></td>
                        <td>学历</td>
                        <td><Select value={formData.spEducation} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"spEducation")} placeholder={"请选择学历"} disabled={checkStatus}>
                            <Option value="博士研究生">博士研究生</Option>
                            <Option value="硕士研究生">硕士研究生</Option>
                            <Option value="本科">本科</Option>
                            <Option value="大专">大专</Option>
                            <Option value="高中">高中</Option>
                            <Option value="初中">初中</Option>
                            <Option value="小学">小学</Option>
                            <Option value="其他">其他</Option>
                        </Select></td>
                        <td>住所</td>
                        <td><Input value={formData.spCurrentAddress} onChange={(e)=>this.changeInput(e.target.value,"spCurrentAddress")} placeholder={"请输入住所"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>培训情况</td>
                        <td colSpan={5}><TextArea rows={5} value={formData.spTraining} onChange={(e)=>this.changeInput(e.target.value,"spTraining")} placeholder={"请输入培训情况"} disabled={checkStatus}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Manager;

