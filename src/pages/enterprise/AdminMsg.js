import React,{Component} from 'react';
import {Select,Input} from 'antd';
import {connect} from "react-redux";
import {changeEnterpriseSelect, changeEnterpriseInput} from "../../redux/action";
const Option = Select.Option;
const { TextArea } = Input;

class AdminMsg extends Component{
    handleInput=(target,which)=>{
        // console.log(target.value,which)
         this.props.dispatch(changeEnterpriseInput(target.value,which));
     }
     handleSelect=(value,option)=>{
         this.props.dispatch(changeEnterpriseSelect(value,option));
     }
    render() {
        const {enterprise} =this.props;
        const type =this.props.type; 
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>姓名</td>
                        <td ><Input value={enterprise.spName} onChange={(e)=>this.handleInput(e.target,"spName")} readOnly={type=='detail'?true:false} placeholder={"请输入食品安全管理人姓名"}/></td>
                        <td>身份证号码</td>
                        <td colSpan={5}><Input value={enterprise.spidNumber} onChange={(e)=>this.handleInput(e.target,"spidNumber")} readOnly={type=='detail'?true:false}  placeholder={"请输入食品安全管理人身份证号码"}/></td>
                    </tr>
                    <tr>
                        <td>固定电话</td>
                        <td colSpan={3}><Input value={enterprise.spOfficePhone} onChange={(e)=>this.handleInput(e.target,"spOfficePhone")} readOnly={type=='detail'?true:false} placeholder={"请输入固定电话"}/></td>
                        <td>移动电话</td>
                        <td ><Input value={enterprise.spMobilePhone} onChange={(e)=>this.handleInput(e.target,"spMobilePhone")} readOnly={type=='detail'?true:false}  placeholder={"请输入移动电话"}/></td>
                        <td>电子邮箱</td>
                        <td><Input value={enterprise.spEmail} onChange={(e)=>this.handleInput(e.target,"spEmail")} readOnly={type=='detail'?true:false}  placeholder={"请输入电子邮箱"}/></td>
                    </tr>
                    <tr>
                        <td>性别</td>
                        <td colSpan={3}>
                            <Select value={enterprise.spSexy} style={{width:"100%"}}onChange={(value)=>this.handleSelect(value,"spSexy")} >
                                <Option disabled={type=='detail'?true:false} value="监管人性别">男</Option>
                                <Option disabled={type=='detail'?true:false} value="女">女</Option>
                            </Select>
                        </td>
                        <td>学历</td>
                        <td>
                            <Select value={enterprise.spEducation} style={{width:"100%"}}onChange={(value)=>this.handleSelect(value,"spEducation")} >
                                <Option value="监管人学历"disabled={type=='detail'?true:false}>监管人学历</Option>
                                <Option value="博士"disabled={type=='detail'?true:false}>博士</Option>
                                <Option value="硕士"disabled={type=='detail'?true:false}>硕士</Option>
                                <Option value="本科"disabled={type=='detail'?true:false}>本科</Option>
                                <Option value={4}disabled={type=='detail'?true:false}>大专</Option>
                                <Option value={5}disabled={type=='detail'?true:false}>高中</Option>
                                <Option value={6}disabled={type=='detail'?true:false}>初中</Option>
                                <Option value={7}disabled={type=='detail'?true:false}>小学</Option>
                                <Option value={8}disabled={type=='detail'?true:false}>其他</Option>
                            </Select>
                        </td>
                        <td>住所</td>
                        <td><Input  value={enterprise.spCurrentAddress} onChange={(e)=>this.handleInput(e.target,"spCurrentAddress")} readOnly={type=='detail'?true:false}  placeholder={"请输入住所"}/></td>
                    </tr>
                    <tr>
                        <td>培训情况</td>
                        <td colSpan={7}><TextArea  value={enterprise.spTraining} onChange={(e)=>this.handleInput(e.target,"spTraining")} readOnly={type=='detail'?true:false}  rows={6} placeholder={"请输入培训情况"}/></td>
                    </tr>

                    </tbody>
                </table>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    enterprise:state.enterprise,
})

export default connect(mapStateToProps)(AdminMsg);
