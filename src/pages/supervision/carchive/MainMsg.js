import {Component} from "react";
import {Input, Select, Button, Modal, Upload, Icon, message} from "antd";
import React from "react";
import axios from '../../../axios'
import connect from "react-redux/es/connect/connect";
import {changeInput} from "../../../redux/action";
import EnterpriseForm from "../../../components/CommonForm/EnterpriseForm";
import {commonUrl} from "../../../axios/commonSrc";
const Option = Select.Option;
const TextArea = Input.TextArea;

@connect(
    state=>({
        input:state.input
    }),
    {
        changeInput,
    }
)
class MainMsg extends Component{
    state={
        enterpriseData:[],
    }
    componentDidMount() {
        this.getData()
    }
    getData = () => {
        let _this = this
        axios.ajax({
            url:"/supervision/enterprise/getById",
            data:{
                params:{
                    id:this.props.input.enterpriseId
                }
            }
        }).then((res) => {
            if(res.status == "success"){
                _this.setState({
                    enterpriseData:res.data
                })
            }
        })
    }
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeInput(input);
    }
    handleFile = (info) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.changeInput(fileList,"document");
    };
    render() {
        const formData=this.props.input;
        const {enterpriseData} = this.state
        const typeStatus = this.props.type == 'detail'?true:false
        return (
            <div  className="commonEnterpriseBox">
                <table>
                    <tbody>
                    <tr>
                        <td>企业名称</td>
                        <td colSpan={5}>
                           <Input value={formData.enterpriseName} placeholder={"请选择企业"} onClick={()=>this.setState({isVisible:true})} suffix={<Icon type="search" />} disabled={typeStatus} />
                        </td>
                    </tr>
                    <tr>
                        <td>企业行业类型</td>
                        <td >
                            <Select style={{width:'100%'}} value={formData.industry} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"industry")} disabled={typeStatus}>
                                <Option value={1}>餐饮行业</Option>
                                <Option value={2}>小餐饮</Option>
                            </Select>
                        </td>
                        <td>企业类型</td>
                        <td >
                            <Select style={{width:'100%'}} value={formData.type} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"type")} disabled={typeStatus}>
                                <Option value={1}>特大型餐馆</Option>
                                <Option value={2}>小型餐馆</Option>
                            </Select>
                        </td>
                        <td>社会信用代码</td>
                        <td><Input placeholder={"请输入社会信用代码"} value={formData.idNumber} onChange={(e)=>this.changeInput(e.target.value,'creditCode')} disabled={typeStatus}/></td>
                    </tr>
                    <tr>
                        <td>法定代表人</td>
                        <td><Input placeholder={"请输入法定代表人"} value={formData.legalPerson} onChange={(e)=>this.changeInput(e.target.value,'legalPerson')} disabled={typeStatus}/></td>
                        <td>食品安全管理员</td>
                        <td><Input placeholder={"请输入食品安全管理员"} value={formData.safeManager} onChange={(e)=>this.changeInput(e.target.value,'safeManager')} disabled={typeStatus}/></td>
                        <td>联系电话</td>
                        <td><Input placeholder={"请输入联系电话"} value={formData.cantactWay} onChange={(e)=>this.changeInput(e.target.value,'telephone')} disabled={typeStatus}/></td>
                    </tr>
                    <tr>
                        <td>企业规模</td>
                        <td >
                            <Select value={formData.enterpriseScale} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"enterpriseScale")} disabled={typeStatus}>
                                <Option value={"1"}>超大</Option>
                                <Option value={"2"}>很大</Option>
                            </Select>
                        </td>
                        <td>注册地址</td>
                        <td><Input placeholder={"请输入注册地址"} value={enterpriseData.registeredAddress} onChange={(e)=>this.changeInput(e.target.value,'address')} disabled={typeStatus}/></td>
                    </tr>
                    <tr>
                        <td>经营范围</td>
                        <td colSpan={5}><Input placeholder={"请输入经营范围"} value={formData.businessScope} onChange={(e)=>this.changeInput(e.target.value,'businessScope')} disabled={typeStatus}/></td>
                    </tr>
                    <tr>
                        <td>许可证相关记录</td>
                        <td colSpan={5}><TextArea rows={6} value={formData.licenseRecord} onChange={(e)=>this.changeInput(e.target.value,'licenseRecord')} disabled={typeStatus}/></td>
                    </tr>
                    <tr>
                        <td>附件信息</td>
                        <td colSpan={5}><Upload
                            name='file'
                            action={commonUrl+'/upload/uploadPicture'}
                            onChange={this.handleFile}
                            fileList={formData.document}>
                            <Button disabled={typeStatus}>
                                <Icon type="upload" /> Click to Upload
                            </Button>
                        </Upload></td>
                    </tr>
                    </tbody>
                </table>
                <Modal
                    width='1000px'
                    title="企业信息列表"
                    visible={this.state.isVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <EnterpriseForm dispatchEnterprise={(item)=>{
                        this.setState({isVisible:false})
                        this.changeInput(item.enterpriseName,'enterpriseName');}} />
                </Modal>
            </div>
        )
    }
}
export default MainMsg;