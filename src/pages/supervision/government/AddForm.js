import React,{Component} from 'react';
import {connect} from 'react-redux'
import {changeGovernment} from "../../../redux/action";
import {Select, Input, Checkbox, Upload, Icon,TreeSelect} from 'antd';
import {commonUrl} from "../../../axios/commonSrc";
import NumericInput from '../../../components/NumericInput';
import Utils from './../../../utils';
const Option = Select.Option;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
@connect(
    state=>({
        input:state.government
    }),
    {
        changeGovernment,
    }
)
class Add extends Component{
    state={imageUrl:'',loading: false}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeGovernment(input);
    }
    onCheckChange=(value)=>{
        this.changeInput(value.join(','),'category')
    }

    handleChange = info => {
        const fileList = info.fileList;
        const file = fileList.pop();
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>{
                    this.setState({
                        loading: false,
                    });
                    this.setState({imageUrl});
                }
            );
        }
        let input = {...this.props.input}
        input.photo=[file];
        this.props.changeGovernment(input);
    };

    render() {
        const formData=this.props.input||{};
        const imageUrl = this.state.imageUrl||'';
        const photo = this.props.input.photo||[];
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">选择上传头像</div>
            </div>
        );
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div className="commonEnterpriseBox">
                <table>
                    <tbody>
                                <tr>
                                    <td>单位名称<span style={{color:'#FF3300'}}>*</span></td>
                                    <td ><Input placeholder={"请输入单位名称"} value={formData.unitName} onChange={(e)=>this.changeInput(e.target.value,'unitName')} disabled={checkStatus} /></td>
                                    <td>部门名称<span style={{color:'#FF3300'}}>*</span></td>
                                    <td >
                                        <TreeSelect placeholder={"请选择部门"} value={formData.department} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"department")} disabled={checkStatus}>
                                            {Utils.renderTreeNodes(this.props.deptTree)}
                                        </TreeSelect>
                                    </td>
                                    <td>姓名<span style={{color:'#FF3300'}}>*</span></td>
                                    <td ><Input placeholder={"请输入姓名"} value={formData.name} onChange={(e)=>this.changeInput(e.target.value,'name')} disabled={checkStatus}/></td>
                                    <td rowSpan={5} style={{width:200}}>
                                        <Upload
                                            disabled={checkStatus}
                                            name="file"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            accept='image/png,image/jpeg'
                                            action={commonUrl+"/upload/uploadPicture"}
                                            fileList={photo}
                                            onChange={this.handleChange}
                                        >
                                            {imageUrl ? <img src={imageUrl} style={{height:'130px'}} alt="avatar" />:(photo.length>=1&&!this.state.loading?<img src={commonUrl+"/upload/picture/" +(photo[0].response||'').data} style={{height:'130px'}} alt="avatar" />:uploadButton)}
                                        </Upload>
                                    </td>
                                </tr>
                                <tr>
                                    <td>性别</td>
                                    <td >
                                        <Select placeholder={"请选择性别"} value={formData.sexy} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"sexy")} disabled={checkStatus}>
                                            <Option value={0}>男</Option>
                                            <Option value={1}>女</Option>
                                        </Select>
                                    </td>
                                    <td>职务</td>
                                    <td>
                                        <Select placeholder={"请选择职务"} value={formData.job} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"job")} disabled={checkStatus}>
                                            {this.props.dutiesList.map((item,index)=>(<Option value={item.id} key={index}>{item.name}</Option>))}
                                        </Select>
                                    </td>
                                    <td>类型<span style={{color:'#FF3300'}}>*</span></td>
                                    <td>
                                        <Select placeholder={"请选择类型"} value={formData.type} style={{width:"100%"}} onChange={(value)=>this.changeInput(value,"type")} disabled={checkStatus}>
                                            <Option value={1}>部门</Option>
                                            <Option value={2}>负责人</Option>
                                            <Option value={3}>执法人员</Option>
                                            <Option value={4}>日常责任监管人</Option>
                                            <Option value={5}>协管员</Option>
                                        </Select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>身份证号</td>
                                    <td><Input placeholder={"请输入身份证号"} value={formData.idNumber} onChange={(e)=>this.changeInput(e.target.value,'idNumber')} disabled={checkStatus}/></td>
                                    <td>执法证号</td>
                                    <td><Input placeholder={"请输入执法证号"} value={formData.enforce} onChange={(e)=>this.changeInput(e.target.value,'enforce')} disabled={checkStatus}/></td>
                                    <td>移动电话<span style={{color:'#FF3300'}}>*</span></td>
                                    <td><Input placeholder={"请输入移动电话"}  value={formData.mobilePhone} onChange={(e)=>this.changeInput(e.target.value,'mobilePhone')} disabled={checkStatus}/></td>
                                </tr>
                                <tr>
                                    <td>办公电话</td>
                                    <td><Input placeholder={"请输入办公电话"} value={formData.officePhone} onChange={(e)=>this.changeInput(e.target.value,'officePhone')} disabled={checkStatus}/></td>
                                    <td>序号</td>
                                    <td><NumericInput placeholder={"请输入序号"} value={formData.number} onChange={(value)=>this.changeInput(value,'number')} disabled={checkStatus}/></td>
                                    <td>工作移动电话<span style={{color:'#FF3300'}}>*</span></td>
                                    <td><Input placeholder={"请输入工作移动电话"} value={formData.workPhone} onChange={(e)=>this.changeInput(e.target.value,'workPhone')} disabled={checkStatus}/></td>
                                </tr>
                    {/*<tr><td colSpan={6}>*/}
                        {/*<Checkbox.Group style={{width:'100%'}} value={formData.category?formData.category.split(','):[]} onChange={this.onCheckChange} disabled={checkStatus}>*/}
                            {/*<Checkbox value={'执法人员'}>执法人员</Checkbox>*/}
                            {/*<Checkbox value={'协管人员'}>协管人员</Checkbox>*/}
                            {/*<Checkbox value={'其他'}>其他</Checkbox>*/}
                        {/*</Checkbox.Group>*/}
                    {/*</td>*/}
                    {/*</tr>*/}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Add;