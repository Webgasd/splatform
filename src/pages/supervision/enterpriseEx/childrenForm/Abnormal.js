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
class Abnormal extends Component{

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
        
        return (
            <div>
                <table className='abnormaltable'>
                    <tbody>
                    <tr>
                        <td>市场主体名称</td>
                        <td colSpan={3}><Input value={formData.enterpriseName}/></td>
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
                <div style={{height:'34px',backgroundColor:'RGB(242, 242, 242)',color:'red',textAlign:'center',lineHeight:'34px',marginTop:10,marginBottom:10,marginLeft:-20,marginRight:-20}}>————请选择经营异常情形————</div>
                <table className='abnormaltable'>
                    <tbody>
                    <tr>
                        <td >异常情形<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Select placeholder="请选择异常情形" value={this.props.abnormalData.abnormalType} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"abnormalType")}>
                            {list.map((item,index)=> ( <Option value={item.id}>{item.content}</Option>))}
                        </Select></td>
                    </tr>
                    <tr>
                        <td >备注</td>
                        <td ><TextArea placeholder="请填写备注" value={this.props.abnormalData.abnormalContent} onChange={(e)=>this.changeInput(e.target.value,"abnormalContent")} rows={3}/></td>
                    </tr>
                    </tbody>
                </table>     
            </div>
        )
    }
}
export default Abnormal;