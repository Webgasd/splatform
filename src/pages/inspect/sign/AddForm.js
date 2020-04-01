import React,{ Component } from 'react';
import {Select, Input, Button, Modal, Icon, Upload} from "antd";
import GaPersonForm from "../../../components/CommonForm/gaPersonForm";
import './style.less';
import {commonUrl} from "../../../axios/commonSrc";
const Option = Select.Option;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default class AddForm extends Component{
    state={}

    changeInput =(value,option)=>{
        let data = this.props.signInfo;
        data[option] = value;
        this.props.dispatchSignData(data);
    }

    handleChange = info => {
        const fileList = info.fileList;
        let file=fileList.pop();
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
        }
        if (info.file.status === 'done') {
            // // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>{this.setState({
                    loading: false,
                })
                    this.props.disPatchImageUrl(imageUrl);
                }

            );

        }
        this.props.dispatchPicture([file]);
    };
    render() {
        const signInfo = this.props.signInfo;
        const imageUrl = this.props.imageUrl;
        const checkStatus = this.props.type=='detail'?true:false;
        return (<div>
            <div className='commonEnterpriseBox'>
                <table>
                    <tbody>
                    <tr>
                        <th>所属部门</th>
                        <td><Input value={signInfo.deptName} placeholder='所属部门无' disabled={true}/></td>
                        <th>职务</th>
                        <td><Input value={signInfo.gaUnit} placeholder='职务无' disabled={true}/></td>
                    </tr>
                    <tr>
                        <th>姓名</th>
                        <td><Input value={signInfo.gaName}  placeholder='请选择姓名'  onClick={()=>this.setState({isGaPersonVisible:true})} suffix={<Icon type="search" />}/></td>
                        <th>执法证号</th>
                        <td><Input value={signInfo.gaEnforce} placeholder='执法证号无'disabled={true}/></td>
                    </tr>
                    <tr>
                        <th>联系方式</th>
                        <td><Input value={signInfo.gaPhone} placeholder='联系方式无' disabled={true}/></td>
                        <th>是否启用签字库</th>
                        <td><Select style={{width:'100%'}} value={signInfo.status} onChange={(value)=>this.changeInput(value,"status")} disabled={checkStatus} placeholder='请选择是否启用'>
                            <Option value={0}>是</Option>
                            <Option value={1}>否</Option>
                        </Select></td>
                    </tr>
                    <tr>
                        <th>签字密码</th>
                        <td colSpan={3}>
                            <Input type='password' value={signInfo.password} onChange={(e)=>this.changeInput(e.target.value,"password")} disabled={checkStatus} style={{float:'left',width:300}} placeholder='请输入密码'/>
                            <Input type='password' value={signInfo.password2} onChange={(e)=>this.changeInput(e.target.value,"password2")} disabled={checkStatus} style={{float:'left',width:300,marginLeft:20}} placeholder='再次输入密码'/>
                        </td>
                    </tr>
                    <tr>
                        <th>签字预览</th>
                        <td colSpan={3}>
                            <div style={{width:'100%',height:134,padding:3}}>
                                <div className='signConfBoxLeft'>
                                    {imageUrl ? <img src={imageUrl} style={{height:'130px'}} alt="avatar" />:(this.props.picture.length>=1&&!this.state.loading?<img src={commonUrl+"/upload/picture/" +this.props.picture[0].response.data} style={{height:'130px'}} alt="avatar" />:null)}
                                </div>
                                <div className='signConfBoxRight'>
                                    注意：<br/>
                                    上传签字图片必须是PNG格式;<br/>
                                    后背景为空白;<br/>
                                    尺寸不应大于:000*0000<br/>
                                    <Upload
                                        disabled={checkStatus}
                                        showUploadList={false}
                                        action={commonUrl+"/upload/uploadPicture"}
                                        fileList={this.props.picture}
                                        onChange={this.handleChange}
                                    >
                                    <Button>上传签字</Button>
                                    </Upload>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <Modal
                width='1000px'
                title="执法人员列表"
                visible={this.state.isGaPersonVisible}
                destroyOnClose
                footer={null}
                onCancel={()=>{
                    //this.addForm.props.form.resetFields();//表单重置
                    this.setState({
                        isGaPersonVisible:false
                    })
                }}
            >
                <GaPersonForm
                    dispatchPerson={(item)=> {
                        this.setState({isGaPersonVisible: false})
                        let data = this.props.signInfo;
                        data.gaId = item.id;
                        data.gaName = item.name;
                        data.gaUnit = item.gaUnit;
                        data.deptName = item.deptName;
                        data.gaEnforce = item.enforce;
                        data.gaPhone=item.mobilePhone;
                        this.props.dispatchSignData(data);
                    }}/>
            </Modal>
        </div>);
    }
}