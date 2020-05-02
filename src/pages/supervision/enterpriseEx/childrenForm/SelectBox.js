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
class SelectBox extends Component{

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
                                onChange={(info)=>this.handleFile(info,"businessLicensePhoto")}
                                showUploadList={false}
                                fileList={formData["businessLicensePhoto"]}>
                                <Button style={{margin:10}}><Icon type="upload" />营业执照</Button>
                            </Upload>
                        {(this.props.industryList||[]).map((item,index)=>(
                             <Upload
                                action={commonUrl+'/upload/uploadPicture'}        
                                onChange={(info)=>this.handleFile(info,(item.remark+"Photos"))}
                                showUploadList={false}
                                fileList={formData[item.remark+"Photos"]}>
                                <Button style={{margin:10}}><Icon type="upload" />{item.name}</Button>
                            </Upload>

                           

                        ))}
                </div>
        </div>
            
        )
    }
}
export default SelectBox;

  //     注释部分为许可证加标号的数组逻辑处理
        // const arr=this.props.input.permissionList||[];
        //     const obj = {}; 
        //     for(let i in arr){ 
        //     var item = arr[i].value; 
        //     obj[item] = (obj[item] +1 ) || 1; 
        //     } 
        //     const toArr= []
        //     for (let j in obj) {
        //             let o = {};
        //             o[j] = obj[j];
        //             toArr.push({name:j,key:o[j]}) 
        //         }  