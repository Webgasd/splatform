import React,{Component} from 'react';
import {Input,Select} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../redux/action";
import NumericInput from "../../../components/NumericInput";
const Option = Select.Option;
@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class Another extends Component{
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div  className='commonEnterpriseBox'>
                <div className='commonEnterpriseBoxHead'>企业其他信息</div>
                <table>
                    <tbody>
                    <tr>
                        <td>经营方式</td>
                        <td><Select value={formData.operationMode} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"operationMode")} placeholder={"请选择经营方式"} disabled={checkStatus}>
                            <Option value="个体经营户">个体经营户</Option>
                            <Option value="国有企业">国有企业</Option>
                            <Option value="有限责任公司">有限责任公司</Option>
                            <Option value="合伙经营">合伙经营</Option>
                            <Option value="事业单位">事业单位</Option>
                            <Option value="其他">其他</Option>
                           </Select></td>
                        <td>房屋性质</td>
                        <td><Select value={formData.housingProperty} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"housingProperty")} placeholder={"请选择房屋性质"} disabled={checkStatus}>
                            <Option value="临建">临建</Option>
                            <Option value="住改商">住改商</Option>
                            <Option value="商铺">商铺</Option>
                            <Option value="其他">其他</Option>
                           </Select></td>
                        <td>业主</td>
                        <td><Input value={formData.owner} onChange={(e)=>this.changeInput(e.target.value,"owner")}  placeholder={"请输入业主"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>业主身份证</td>
                        <td><Input value={formData.ownerIdNumber} onChange={(e)=>this.changeInput(e.target.value,"ownerIdNumber")} placeholder={"请输入业主身份证"} disabled={checkStatus}/></td>
                        <td>业主联系电话</td>
                        <td><Input value={formData.ownerMobilePhone} onChange={(e)=>this.changeInput(e.target.value,"ownerMobilePhone")} placeholder={"请输入业主联系电话"} disabled={checkStatus}/></td>
                        <td>委托代理人</td>
                        <td><Input value={formData.agent} onChange={(e)=>this.changeInput(e.target.value,"agent")} placeholder={"请输入委托代理人"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>委托代理人身份证</td>
                        <td ><Input value={formData.agentIdNumber} onChange={(e)=>this.changeInput(e.target.value,"agentIdNumber")} placeholder={"请输入委托代理人身份证"} disabled={checkStatus}/></td>
                        <td>委托代理人联系电话</td>
                        <td><Input value={formData.agentMobilePhone} onChange={(e)=>this.changeInput(e.target.value,"agentMobilePhone")} placeholder={"请输入委托代理人联系电话"} disabled={checkStatus}/></td>
                        <td>其他联系方式</td>
                        <td><Input value={formData.otherPhone} onChange={(e)=>this.changeInput(e.target.value,"otherPhone")} placeholder={"请输入其他联系方式"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>诚信级别</td>
                        <td ><Select value={formData.integrityLevel} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"integrityLevel")}placeholder={"请选择诚信级别"} disabled={checkStatus}>
                            <Option value="一颗星">一颗星</Option>
                            <Option value="两颗星">两颗星</Option>
                            <Option value="三颗星">三颗星</Option>
                            <Option value="四颗星">四颗星</Option>
                            <Option value="五颗星">五颗星</Option>
                           </Select></td>
                        <td>生产面积（㎡）</td>
                        <td><NumericInput value={formData.productionArea} onChange={(value)=>this.changeInput(value,"productionArea")} placeholder={"请输入生产面积（㎡）"} disabled={checkStatus}/></td>
                        <td>定资产（万元）</td>
                        <td><NumericInput value={formData.fixedAssets} onChange={(value)=>this.changeInput(value,"fixedAssets")} placeholder={"请输入定资产（万元）"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>从业人员</td>
                        <td ><Input value={formData.practitioners} onChange={(e)=>this.changeInput(e.target.value,"practitioners")}   placeholder={"请输入从业人员"} disabled={checkStatus}/></td>
                        <td>应体检人数</td>
                        <td><NumericInput value={formData.examinationPopulation} onChange={(value)=>this.changeInput(value,"examinationPopulation")}  placeholder={"请输入应体检人数"} disabled={checkStatus}/></td>
                      
                    </tr>
                    <tr>
                        <td>仓库地址一</td>
                        <td colSpan="5" ><Input value={formData.warehouse1} onChange={(e)=>this.changeInput(e.target.value,"warehouse1")} placeholder={"请输入仓库地址一"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>仓库地址二</td>
                        <td colSpan="5"><Input value={formData.warehouse2} onChange={(e)=>this.changeInput(e.target.value,"warehouse2")} placeholder={"请输入仓库地址二"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>仓库地址三</td>
                        <td colSpan="5" ><Input value={formData.warehouse3} onChange={(e)=>this.changeInput(e.target.value,"warehouse3")} placeholder={"请输入仓库地址三"} disabled={checkStatus}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
export default Another;
