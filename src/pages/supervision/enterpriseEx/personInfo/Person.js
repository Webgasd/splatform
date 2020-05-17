import {Component} from "react";
import {Input, Select, DatePicker, Upload, Icon, Modal} from "antd";
import React from "react";
import connect from "react-redux/es/connect/connect";
import {changeEmployee} from "../../../../redux/action";
import moment from "moment";
import {commonUrl} from "../../../../axios/commonSrc";
import EnterpriseForm from '../../../../components/CommonForm/EnterpriseForm';
const Option = Select.Option;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
@connect(
    state=>({
        input:state.employee,
        userType:state.userType,
        userInfo:state.userInfo
    }),
    {
        changeEmployee,
    }
)
class Person extends Component{
    state={}
    componentDidMount() {
        if(this.props.userType==1){
            let input = {...this.props.input,companyName:this.props.userInfo.enterpriseName,companyId:this.props.userInfo.id}
            this.props.changeEmployee(input)
        }
    }


    render() {
        const checkStatus = true;
        const formData=this.props.input;
        const imageUrl = this.state.imageUrl||'';
        const photo = this.props.input.photo||[];
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">选择上传证件照</div>
            </div>
        );
        return (
            <div className="commonEnterpriseBox">
                        <table>
                            <tbody>
                            <tr>
                                <td>单位名称<span style={{color:'#FF3300'}}>*</span></td>
                                <td colSpan={3}><Input value={formData.companyName} placeholder={"请选择企业"}  disabled={checkStatus}/></td>
                                <td rowSpan={7} style={{width:200}}>
                                    <Upload
                                        disabled={checkStatus}
                                        name="file"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        accept='image/png,image/jpeg'
                                        action={commonUrl+"/upload/uploadPicture"}
                                        fileList={photo}
                                        // onChange={this.handleChange}
                                    >
                                        {imageUrl ? <img src={imageUrl} style={{height:'130px'}} alt="avatar" />:(photo.length>=1&&!this.state.loading?<img src={commonUrl+"/upload/picture/" +photo[0].response.data} style={{height:'130px'}} alt="avatar" />:uploadButton)}
                                    </Upload>
                                </td>
                            </tr>
                            <tr>
                                <td>姓名<span style={{color:'#FF3300'}}>*</span></td>
                                <td><Input placeholder={"请输入姓名"} value={formData.name}  disabled={checkStatus}/></td>
                                <td>性别<span style={{color:'#FF3300'}}>*</span></td>
                                <td><Select style={{width:'100%'}} placeholder={"请选择性别"} value={formData.sexy} style={{width:"100%"}}  disabled={checkStatus}>
                                    <Option value={0}>男</Option>
                                    <Option value={1}>女</Option>
                                </Select></td>
                            </tr>
                            <tr>
                                <td>身份证号<span style={{color:'#FF3300'}}>*</span></td>
                                <td><Input placeholder={"请输入身份证号"} value={formData.idNumber}  disabled={checkStatus}/></td>
                                <td>工种<span style={{color:'#FF3300'}}>*</span></td>
                                <td><Select style={{width:'100%'}} value={formData.workType} placeholder={"请选择工种"} style={{width:"100%"}}  disabled={checkStatus}>
                                    {this.props.workTypeList.map((item)=><Option value={item.id}>{item.name}</Option>)}
                                </Select></td>
                            </tr>
                            <tr>
                                <td >体检情况</td>
                                <td><Select style={{width:'100%'}} value={formData.health} placeholder={"请选择体检情况"} style={{width:"100%"}}  disabled={checkStatus}>
                                    <Option value={'合格'}>合格</Option>
                                    <Option value={'未合格'}>不合格</Option>
                                </Select></td>
                                <td>培训情况</td>
                                <td ><Select style={{width:'100%'}} value={formData.train} placeholder={"请选择培训情况"} style={{width:"100%"}}  disabled={checkStatus}>
                                    <Option value={"已培训"}>已培训</Option>
                                    <Option value={"未培训"}>未培训</Option>
                                </Select></td>
                            </tr>
                            <tr>
                                <td >文化程度</td>
                                <td><Select style={{width:'100%'}} value={formData.education} placeholder={"请选择文化程度"} style={{width:"100%"}}  disabled={checkStatus}>
                                    <Option value={"研究生"}>研究生</Option>
                                    <Option value={"大学"}>大学</Option>
                                    <Option value={"高中"}>高中</Option>
                                    <Option value={"初中"}>初中</Option>
                                    <Option value={"初小"}>初小</Option>
                                </Select></td>
                                <td>健康证号</td>
                                <td><Input placeholder={"请输入健康证号"} value={formData.healthNumber}  disabled={checkStatus}/></td>
                            </tr>
                            <tr>
                                <td >发证日期</td>
                                <td><DatePicker defaultValue={formData.startTime==null?null:moment(formData.startTime)}
                                                disabled={checkStatus}
                                               
                                                showTime={true} placeholder="请输入开始时间" format="YYYY-MM-DD"/></td>
                                <td>有效截止日期</td>
                                <td><DatePicker defaultValue={formData.endTime==null?null:moment(formData.endTime)}
                                                disabled={checkStatus}
                                               
                                                showTime={true} placeholder="请输入截至时间" format="YYYY-MM-DD"/></td>
                            </tr>
                            <tr>
                                <td >发证机关</td>
                                <td  colSpan={3}><Input  placeholder={"请输入发证机关"} value={formData.issuingAuthority}  disabled={checkStatus}/></td>
                            </tr>
                            </tbody>
                        </table>
                <Modal
                    width='1000px'
                    title="企业信息列表"
                    visible={this.state.isVisible}
                    footer={null}
                    onCancel={()=>{
                        //this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <EnterpriseForm dispatchEnterprise={(item)=>{
                        this.setState({isVisible:false})
                        let input = {...this.props.input,companyName:item.enterpriseName,companyId:item.id}
                        this.props.changeEmployee(input)}} />
                </Modal>
            </div>
        )
    }
}

export default Person;