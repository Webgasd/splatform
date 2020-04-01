import React,{Component} from 'react';
import {Input, Select, Button, Upload,Icon,message} from 'antd';
import {commonUrl} from "../../../axios/commonSrc";
import axios from "../../../axios";
const Option = Select.Option;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}


export default class AddForm extends Component{

    state = {
        topicType:1
    }
    componentDidMount() {
        this.requestInfo();

    }

    requestInfo=()=>{
        axios.noLoadingAjax({
            url:'/exam/subject/getIndustryAndWorkType'
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    industryList:res.data.allIndustry,
                    workTypeList:res.data.allWorkType
                })
            }
        })
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

    handleFile = (info) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.props.dispatchContent(fileList);
    };


    handleName=(event)=>{
        let value = {...this.props.materialInfo};
        value.name = event.target.value;
        this.props.dispatchMaterialInfo(value);
    }
    handleIndustry=(event)=>{
        let value = {...this.props.materialInfo};
        value.industry = event;
        this.props.dispatchMaterialInfo(value);
    }
    handleWorkType=(event)=>{
        let value = {...this.props.materialInfo};
        value.workType = event;
        this.props.dispatchMaterialInfo(value);
    }
    handleScore=(event)=>{
        let value = {...this.props.materialInfo};
        value.score = event.target.value;
        this.props.dispatchMaterialInfo(value);
    }
    handleContentType=(event)=>{
        let value = {...this.props.materialInfo};
        value.contentType = event;
        this.props.dispatchMaterialInfo(value);
    }
    handleRemark=(event)=>{
        let value = {...this.props.materialInfo};
        value.remark = event.target.value;
        this.props.dispatchMaterialInfo(value);
    }
    render(){
        const {materialInfo} = this.props;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.props.imageUrl;
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div>
                <div className='commonEnterpriseBox'>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{width:'80px'}}>教材名称：</td>
                            <td><Input value={materialInfo.name||''} onChange={this.handleName} disabled={checkStatus}/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className='commonEnterpriseBox'>
                    <table>
                        <tbody>
                                <tr>
                                    <td style={{width:'80px'}}>行业类别：</td>
                                    <td style={{width:'300px'}}>
                                        <Select value={materialInfo.industry||''} onChange={this.handleIndustry} style={{ width: 200 }} disabled={checkStatus} >
                                            {(this.state.industryList||[]).map((item)=><Option value={item.id}>{item.name}</Option>)}
                                    </Select></td>
                                    <td rowSpan={4}>
                                        <Upload
                                            disabled={checkStatus}
                                            name='file'
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            accept='image/png,image/jpeg'
                                            action={commonUrl+"/upload/uploadPicture"}
                                            fileList={this.props.picture}
                                            onChange={this.handleChange}
                                        >
                                            {imageUrl ? <img src={imageUrl} style={{height:'130px'}} alt="avatar" />:(this.props.picture.length>=1&&!this.state.loading?<img src={commonUrl+"/upload/picture/" +this.props.picture[0].response.data} style={{height:'130px'}} alt="avatar" />:uploadButton)}
                                        </Upload>
                                    </td>
                                </tr>
                                <tr>
                                    <td>工作种类：</td>
                                    <td><Select value={materialInfo.workType||''} disabled={checkStatus?true:(materialInfo.industry?false:true)} onChange={this.handleWorkType} style={{ width: 200 }} >
                                        {(this.state.workTypeList||[]).filter((item)=>item.industryId==materialInfo.industry).map((item)=><Option value={item.id}>{item.name}</Option>)}
                                    </Select></td>
                                </tr>
                                <tr>
                                    <td>课时分值：</td>
                                    <td><Input value={materialInfo.score||0.0} onChange={this.handleScore} disabled={checkStatus}/></td>
                                </tr>
                                <tr>
                                    <td>教材种类:</td>
                                    <td>
                                        <Select value={materialInfo.contentType||0.0} onChange={this.handleContentType} style={{width:'300px'}} disabled={checkStatus}>
                                            <Option value={1} key={1}>视频类教材</Option>
                                            <Option value={2} key={2}>文本类教材</Option>
                                        </Select></td>
                                </tr>
                        </tbody>
                    </table>
                </div>
                <div className='commonEnterpriseBox'>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{width:'80px',height:'80px'}}>教材附件：</td>
                            <td>
                            <Upload
                                disabled={checkStatus}
                                name='file'
                                accept={materialInfo.contentType==1?"audio/mp4,video/mp4":'application/pdf'}
                                action={commonUrl+'/upload/uploadPicture'}
                                onChange={this.handleFile}
                                fileList={this.props.content}>
                                <Button>
                                    <Icon type="upload" /> 选择上传文件
                                </Button>
                            </Upload></td>
                        </tr>
                        <tr>
                            <td>备注：</td>
                            <td><Input.TextArea value={materialInfo.remark||0.0} onChange={this.handleRemark} disabled={checkStatus}/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        );
    }
}
