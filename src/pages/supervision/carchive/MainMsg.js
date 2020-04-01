import {Component} from "react";
import {Input, Select, Button, Modal, Upload, Icon, message} from "antd";
import React from "react";
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
    state={}
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
        return (
            <div  className="commonEnterpriseBox">
                <table>
                    <tbody>
                    <tr>
                        <td>企业名称</td>
                        <td colSpan={5}>
                           <Input value={formData.enterpriseName} placeholder={"请选择企业"} onClick={()=>this.setState({isVisible:true})} suffix={<Icon type="search" />} />
                        </td>
                    </tr>
                    <tr>
                        <td>企业行业类型</td>
                        <td >
                            <Select style={{width:'100%'}} value={formData.industry} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"industry")}>
                                <Option value={1}>餐饮行业</Option>
                                <Option value={2}>小餐饮</Option>
                            </Select>
                        </td>
                        <td>企业类型</td>
                        <td >
                            <Select style={{width:'100%'}} value={formData.type} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"type")}>
                                <Option value={1}>特大型餐馆</Option>
                                <Option value={2}>小型餐馆</Option>
                            </Select>
                        </td>
                        <td>社会信用代码</td>
                        <td><Input placeholder={"请输入社会信用代码"} value={formData.creditCode} onChange={(e)=>this.changeInput(e.target.value,'creditCode')}/></td>
                    </tr>
                    <tr>
                        <td>法定代表人</td>
                        <td><Input placeholder={"请输入法定代表人"} value={formData.legalPerson} onChange={(e)=>this.changeInput(e.target.value,'legalPerson')}/></td>
                        <td>食品安全管理员</td>
                        <td><Input placeholder={"请输入食品安全管理员"} value={formData.safeManager} onChange={(e)=>this.changeInput(e.target.value,'safeManager')}/></td>
                        <td>联系电话</td>
                        <td><Input placeholder={"请输入联系电话"} value={formData.telephone} onChange={(e)=>this.changeInput(e.target.value,'telephone')}/></td>
                    </tr>
                    <tr>
                        <td>企业规模</td>
                        <td >
                            <Select value={formData.enterpriseScale} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"enterpriseScale")}>
                                <Option value={"1"}>超大</Option>
                                <Option value={"2"}>很大</Option>
                            </Select>
                        </td>
                        <td>注册地址</td>
                        <td><Input placeholder={"请输入注册地址"} value={formData.address} onChange={(e)=>this.changeInput(e.target.value,'address')}/></td>
                    </tr>
                    <tr>
                        <td>经营范围</td>
                        <td colSpan={5}><Input placeholder={"请输入经营范围"} value={formData.businessScope} onChange={(e)=>this.changeInput(e.target.value,'businessScope')}/></td>
                    </tr>
                    <tr>
                        <td>许可证相关记录</td>
                        <td colSpan={5}><TextArea rows={6} value={formData.licenseRecord} onChange={(e)=>this.changeInput(e.target.value,'licenseRecord')}/></td>
                    </tr>
                    <tr>
                        <td>附件信息</td>
                        <td colSpan={5}><Upload
                            name='file'
                            action={commonUrl+'/upload/uploadPicture'}
                            onChange={this.handleFile}
                            fileList={formData.document}>
                            <Button>
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