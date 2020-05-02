import React,{Component} from 'react';
import { Button,Upload,Icon,message} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import {commonUrl} from "../../../../axios/commonSrc";


@connect(
    state=>({
        input:state.enterprise,
        industryList:state.industryList,
    }),
    {
        changeEnterprise,
    }
)
class SelectAnnex extends Component{

    state={}

    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }

    handleFile = (info,option) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        this.changeInput(fileList,option);

    }
    render() {
        const formData=this.props.input||{};
        return (
            <div>
                <div className='commonEnterpriseBox'>
                    <Upload
                        action={commonUrl+'/upload/uploadPicture'}        
                        onChange={(info)=>this.handleFile(info,"publicityPhotos")}
                        showUploadList={false}
                        fileList={formData["publicityPhotos"]}>
                        <Button style={{margin:10}}><Icon type="upload" />宣传类照片</Button>
                    </Upload>
                    <Upload
                        action={commonUrl+'/upload/uploadPicture'}        
                        onChange={(info)=>this.handleFile(info,"certificatePhotos")}
                        showUploadList={false}
                        fileList={formData["certificatePhotos"]}>
                        <Button style={{margin:10}}><Icon type="upload" />证照类照片</Button>
                    </Upload>
                    <Upload
                        action={commonUrl+'/upload/uploadPicture'}        
                        onChange={(info)=>this.handleFile(info,"otherPhotos")}
                        showUploadList={false}
                        fileList={formData["otherPhotos"]}>
                        <Button style={{margin:10}}><Icon type="upload" />其他类照片</Button>
                    </Upload>
                        
                </div>
        </div>
            
        )
    }
}
export default SelectAnnex;