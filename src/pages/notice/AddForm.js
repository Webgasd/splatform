import React,{Component} from 'react';
import BraftEditor from 'braft-editor';
import { Input, Upload, Icon,Row,Col } from 'antd';
import 'braft-editor/dist/index.css'
import {commonUrl} from "../../axios/commonSrc";

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default class AddForm extends Component{
    state={}
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
    changeInput=(data,option)=>{
        let value = this.props.noticeData;
        value[option]=data
        this.props.dispatchNoticeData(value);
    }

    render(){
        const controls =[
            'undo', 'redo', 'separator',
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
            'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
            'link', 'separator', 'hr', 'separator',
            'media', 'separator',
            'clear'
        ]
        let noticeData = this.props.noticeData||{};
        const imageUrl = this.props.imageUrl;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">选择上传标题</div>
            </div>
        );
     return(<div>
         <Row><Col span={20}>
             <Row><Col span={3} style={{textAlign:'right',fontSize:15}}>标题：</Col>
                 <Col span={20}><Input value={noticeData.title} onChange={(event)=>this.changeInput(event.target.value,'title')}/></Col></Row>
             <Row style={{marginTop:10}}><Col span={3} style={{textAlign:'right',fontSize:15}}>发送对象：</Col>
                 <Col span={20}><Input  value={noticeData.sendObject} onChange={(event)=>this.changeInput(event.target.value,'sendObject')} /></Col></Row>
         </Col>
         <Col span={4}>
             <Upload
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
             </Upload></Col></Row>
             <div className="editAreaBody">
                 <BraftEditor
                     controls={controls}
                     contentStyle={{height:500}}
                     value={noticeData.content}
                     onChange={(data)=>this.changeInput(data,'content')}
                 />
             </div>
         </div>
        );
    }
}
