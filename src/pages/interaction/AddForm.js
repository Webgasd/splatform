import React,{Component} from 'react';
import BraftEditor from 'braft-editor';
import {Input, Upload, Icon, Row, Col, Select, DatePicker, Radio, Modal, Button,Form} from 'antd';
import 'braft-editor/dist/index.css'
import {commonUrl} from "../../axios/commonSrc";
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import InstructList from "./InstructList";
import locale from "antd/es/date-picker/locale/zh_CN";
const Option = Select.Option;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

@connect(
    state=>({
        input:state.party
    })
)
class AddForm extends Component{
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
        let value = this.props.newsData;
        value[option]=data
        this.props.dispatchNewsData(value);
    }
    handleFocus(which){
        this.setState({
            [which]:true
        })
    }
    handleCloseModal(which){
     //   console.log('1')
        this.setState({
            [which]:false
        })
    }

    handleChooseInstruct=(record)=>{
        let value = this.props.newsData;
        value.pid = record.id;
        value.checkPerson=record.name
        this.props.dispatchNewsData(value);
        this.handleCloseModal('checkPerson');
    //    const {setFieldsValue} = this.props.form
    //     this.setState({
    //         modalInstruct:false,
    //         checkPerson:record.name
    //     })
      //  setFieldsValue({leader:record.name})
    }
    getMethodDisplay(){
        const type = this.props.type;
        let newsData = this.props.newsData||{};
       // newsData.checkPerson = newsData.name||{};
        switch(newsData.status){
            case 0:
                return(
                    null
                )

            case 1:
                return (
                    <div>
                        {/* <Col span={2} style={{textAlign:'right',fontSize:15}}>审核人：</Col>
                        <Col span={5}><Input value={newsData.checkPerson} style={{width:150}} onChange={(e)=>this.changeInput(e.target.value,'checkPerson')}/></Col> */}
                       
                        <Col span={2} style={{textAlign:'right',fontSize:15}}>审核人：</Col>
                        <Col span={5}><Input  value={newsData.checkPerson} style={{width:150}} onChange={(e)=>this.changeInput(e.target.value,'checkPerson')}/>
                        <Icon onClick={()=>this.handleFocus("checkPerson")}  type="search"/>
                        </Col>
                        <Modal
                            title="审核人列表"
                            visible={this.state.checkPerson}
                            width={1000}
                            footer={<Button onClick={()=>this.handleCloseModal("checkPerson")}>关闭</Button>}
                            onCancel={()=>this.handleCloseModal("checkPerson")}
                        >
                            <InstructList handleChooseInstruct={this.handleChooseInstruct}/>
                        </Modal>
                        <Col span={3} style={{textAlign:'right',fontSize:15}}>审核时间：</Col>
                        <Col span={5}>
                            <DatePicker value={newsData.publicTime=moment(newsData.publicTime)} onChange={(event)=>this.changeInput(event,"publicTime")} format="YYYY-MM-DD"/>
                        </Col>
                    </div>
                )
            default:
                return null
        }
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
        let newsData = this.props.newsData||{};
        const imageUrl = this.props.imageUrl;
      
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">选择上传图片</div>
            </div>
        );
        return(<div>
                <Row><Col span={20}>
                    <Row>
                        <Col span={2} style={{textAlign:'right',fontSize:15}}>标题：</Col>
                        <Col span={20}><Input value={newsData.title} onChange={(event)=>this.changeInput(event.target.value,'title')}/></Col></Row>
                    <Row style={{marginTop:10}}>
                        <Col span={2} style={{textAlign:'right',fontSize:15}}>类型：</Col>
                        <Col span={5}>
                            <Select placeholder={"请选择新闻类型"} value={newsData.type} style={{width:150}} onChange={(value)=>this.changeInput(value,"type")}>
                                <Option value={1}>办事指南</Option>
                                <Option value={2}>智慧市场</Option>
                                <Option value={3}>食药知识</Option>
                                <Option value={4}>法律法规</Option>
                                <Option value={5}>政务公开</Option>
                                <Option value={6}>工作动态</Option>
                                <Option value={7}>通知公告</Option>
                            </Select>
                        </Col >
                        <Col span={2} style={{textAlign:'right',fontSize:15}}>作者：</Col>
                        <Col span={5}><Input value={newsData.author} style={{width:150}} onChange={(e)=>this.changeInput(e.target.value,'author')}/></Col>
                        <Col span={3} style={{textAlign:'right',fontSize:15}}>编辑时间：</Col>
                        <Col span={5}>
                            <DatePicker value={newsData.puDate=moment(newsData.puDate)} onChange={(event)=>this.changeInput(event,"puDate")} format="YYYY-MM-DD"/>
                        </Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3} style={{textAlign:'right',fontSize:15}}>是否审核：</Col>
                        <Col span={4}>
                            <Radio.Group value={newsData.status} onChange={(e)=>this.changeInput(e.target.value,'status')}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col >
                       
                        {this.getMethodDisplay()}
                        {/*<div>*/}
                            {/*<Col span={2} style={{textAlign:'right',fontSize:15}}>审核人：</Col>*/}
                            {/*<Col span={5}><Input value={newsData.author} style={{width:150}} onChange={(e)=>this.changeInput(e.target.value,'author')}/></Col>*/}
                            {/*<Col span={3} style={{textAlign:'right',fontSize:15}}>审核时间：</Col>*/}
                            {/*<Col span={5}>*/}
                                {/*<DatePicker value={newsData.puDate=moment(newsData.puDate)} onChange={(event)=>this.changeInput(event,"puDate")} format="YYYY-MM-DD"/>*/}
                            {/*</Col>*/}
                        {/*</div>*/}
                    </Row>
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
                            {imageUrl ? <img src={imageUrl} style={{height:'100px',width:'100px'}} alt="avatar" />:(this.props.picture.length>=1&&!this.state.loading?<img style={{height:'100px',width:'100px'}} src={commonUrl+"/upload/picture/" +this.props.picture[0].response.data} alt="avatar" />:uploadButton)}
                        </Upload></Col></Row>
                <div className="editAreaBody" style={{marginTop:10}}>
                    <BraftEditor
                        controls={controls}
                        contentStyle={{height:500}}
                        value={newsData.content}
                        onChange={(data)=>this.changeInput(data,'content')}
                    />
                </div>
            </div>
        );
    }
}

export default AddForm
