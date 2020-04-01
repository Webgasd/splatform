import React,{Component} from 'react';
import {Icon, Input, Modal, Select, Upload} from "antd";
import {connect} from 'react-redux'
import {changeDishes} from "../../../../redux/action";
import {commonUrl} from "../../../../axios/commonSrc";
import DtypeForm from "./DtypeForm";

const Option=Select.Option;
const {TextArea}=Input;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
@connect(
    state=>({
        input:state.dishes
    }),
    {
        changeDishes,
    }
)
class DetailForm extends Component{
    state={imageUrl:'',loading: false}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeDishes(input);
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
        this.props.changeDishes(input);
    };

    render() {
        const type=this.props.type;
        const formData=this.props.input||{};
        const imageUrl = this.state.imageUrl||'';
        const photo = this.props.input.photo||[];
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">选择上传图片</div>
            </div>
        );
        return(
            <div className='commonEnterpriseBox'>
                <table>
                    <tbody>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>菜品编号<span style={{color:'#FF3300'}}>*</span></td>
                        <td ><Input placeholder={"请输入菜品编号"} value={formData.number} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'number')}/></td>
                        <td rowSpan={4} style={{width:200}}>
                            <Upload
                                disabled={type=='detail'?true:false}
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
                        <td style={{background:'#F2F2F2'}}>菜品名称<span style={{color:'#FF3300'}}>*</span></td>
                        <td ><Input placeholder={"请输入菜品名称"} value={formData.name} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'name')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>菜品类别<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.type} onClick={()=>this.setState({isVisible:true,dishesType:'type'})} placeholder={"请选择菜品类别"} disabled={type=='detail'?true:false} suffix={<Icon type="search" />} onChange={(e)=>this.changeInput(e.target.value,'type')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>价格<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input placeholder={"请输入价格"} value={formData.price} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,'price')}/></td>
                    </tr>
                    <tr>
                        <td style={{background:'#F2F2F2'}}>菜品介绍<span style={{color:'#FF3300'}}>*</span></td>
                        <td colSpan={5}><TextArea rows={4} value={formData.remark} disabled={type=='detail'?true:false} onChange={(e)=>this.changeInput(e.target.value,"remark")}/></td>
                    </tr>
                    </tbody>
                </table>
                <Modal
                    width='700px'
                    maskClosable={false}
                    title="菜品类别列表"
                    visible={this.state.isVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <DtypeForm dispatchSupervisor={(data)=>{
                        this.setState({isVisible:false})
                        this.changeInput(data,this.state.dishesType);}} />
                </Modal>
            </div>
        );
    }
}
export default DetailForm;