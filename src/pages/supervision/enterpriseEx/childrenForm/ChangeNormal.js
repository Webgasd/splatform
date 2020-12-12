import React,{Component} from 'react';
import {Select, Input} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import '../style.less'
import axios from "../../../../axios";
const Option = Select.Option;
const { TextArea } = Input;

@connect(
    state=>({
        input:state.enterprise,
        areaList:state.areaList
    }),
    {
        changeEnterprise,
    }
)
class ChangeNormal extends Component{

    state={}
    componentDidMount() {
        this.requestList()
        
    }
    requestList=()=>{
        axios.ajax({
            url:'/abnormal/getList',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    list:res.data
                })
            }
        })
    }
    
    changeInput=(value,option)=>{
        let data = this.props.abnormalData
        data[option] = value
        this.props.dispatchAbnormalData(data)
    }
    
    render() {
        const formData=this.props.enterpriseData||{};
        const list = this.state.list||[]
        console.log(list)
        const type = this.props.type == "zombieEnterprise" ? "none":"block"
        return (
            <div>
                <table className='abnormaltable'>
                    <tbody>
                    <tr>
                        <td>市场主体名称</td>
                        <td ><Input value={formData.enterpriseName}/></td>
                    </tr>
                    <tr>
                        <td>统一信用代码</td>
                        <td><Input value={formData.idNumber}/></td>
                    </tr>
                   
                    <tr>
                        <td>法定代表人</td>
                        <td><Input value={formData.legalPerson} /></td>
                    </tr> 
                    <tr>
                        <td>联系电话</td>
                        <td ><Input value={formData.cantactWay}/></td>
                    </tr>
                    <tr>
                         <td>住所/经营场所</td>
                         <td ><Input value={formData.registeredAddress} /></td>
                    </tr>
                   
                    </tbody>
                </table>
                <div style={{height:'34px',backgroundColor:'RGB(242, 242, 242)',color:'#0066CC',textAlign:'center',lineHeight:'34px',marginTop:10,marginBottom:10,marginLeft:-20,marginRight:-20}}>————请选择异常企业处理————</div>
                <table className='abnormaltable'>
                    <tbody>
                    <tr>
                        <td style={{width:'30%'}}>经营状态<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Select placeholder="请选择经营状态" value={this.props.abnormalData.businessState} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"businessState")}>
                            <Option value={1}>新增</Option>
                            <Option value={2}>正常</Option>
                            <Option value={4} style={{display:type}}>已注销</Option>
                            <Option value={5} style={{display:type}}>已倒闭</Option>
                        </Select></td>
                    </tr>
                    </tbody>
                </table>     
            </div>
        )
    }
}
export default ChangeNormal;