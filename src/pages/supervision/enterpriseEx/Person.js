import React,{Component} from 'react';
import {Select,Input} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";
const Option = Select.Option;
@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class Person extends Component{
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div className='commonEnterpriseBox'>
                <div className='commonEnterpriseBoxHead'>法定代表人信息</div>
                <table>
                    <tbody>
                    <tr>
                        <td>姓名<span style={{color:'#FF3300'}}>*</span></td>
                        <td ><Input value={formData.legalPerson} placeholder={"法人姓名"} disabled={true}/></td>
                        <td>证件号码<span style={{color:'#FF3300'}}>*</span></td>
                        <td ><Input value={formData.ipIdNumber} onChange={(e)=>this.changeInput(e.target.value,"ipIdNumber")} placeholder={"请输入法人证件号码"} disabled={checkStatus}/></td>
                        <td>移动电话<span style={{color:'#FF3300'}}>*</span></td>
                        <td ><Input value={formData.ipMobilePhone} onChange={(e)=>this.changeInput(e.target.value,"ipMobilePhone")}  placeholder={"请输入法人移动电话"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>性别</td>
                        <td ><Select value={formData.ipSexy} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"ipSexy")} placeholder={"请选择性别"} disabled={checkStatus}>
                        <Option value="男">男</Option>
                         <Option value="女">女</Option>
                           </Select></td>
                        <td>学历</td>
                        <td><Select value={formData.ipEducation} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"ipEducation")} placeholder={"请选择学历"} disabled={checkStatus}>
                            <Option value="博士研究生">博士研究生</Option>
                            <Option value="硕士研究生">硕士研究生</Option>
                            <Option value="本科">本科</Option>
                            <Option value="大专">大专</Option>
                            <Option value="高中">高中</Option>
                            <Option value="初中">初中</Option>
                            <Option value="小学">小学</Option>
                            <Option value="其他">其他</Option>
                           </Select></td>
                        <td>政治面貌</td>
                        <td><Select value={formData.ipPoliticalOutlook} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"ipPoliticalOutlook")} placeholder={"请选择政治面貌"} disabled={checkStatus}>
                            <Option value="中共党员">中共党员</Option>
                            <Option value="中共预备党员">中共预备党员</Option>
                            <Option value="共青团员">共青团员</Option>
                            <Option value="民革党员">民革党员</Option>
                            <Option value="民盟盟员">民盟盟员</Option>
                            <Option value="民建会员">民建会员</Option>
                            <Option value="民进会员">民进会员</Option>
                            <Option value="农工党党员">农工党党员</Option>
                            <Option value="致公党党员">致公党党员</Option>
                            <Option value="九三学社社员">九三学社社员</Option>
                            <Option value="台盟盟员">台盟盟员</Option>
                            <Option value="无党派人士">无党派人士</Option>
                            <Option value="普通居民">普通居民</Option>
                           </Select></td>
                    </tr>
                    <tr>
                        <td>现住地址</td>
                        <td colSpan={5}><Input value={formData.ipCurrentAddress} onChange={(e)=>this.changeInput(e.target.value,"ipCurrentAddress")}  placeholder={"请输入地址"} disabled={checkStatus}/></td>
                    </tr>
  
                    <tr>
                        <td>民族</td>
                        <td><Input value={formData.ipNation} onChange={(e)=>this.changeInput(e.target.value,"ipNation")} placeholder={"请输入民族"} disabled={checkStatus}/></td>
                        <td>电子邮箱</td>
                        <td><Input value={formData.ipEmail} onChange={(e)=>this.changeInput(e.target.value,"ipEmail")} placeholder={"请输入电子邮箱"} disabled={checkStatus}/></td>
                        <td>邮政编码</td>
                        <td><Input value={formData.ipPostalCode} onChange={(e)=>this.changeInput(e.target.value,"ipPostalCode")} placeholder={"请输入邮政编码"} disabled={checkStatus}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Person;