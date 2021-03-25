
import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select,Modal,DatePicker,Upload,message,Icon} from 'antd'
import {commonUrl} from "../../axios/commonSrc";
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import axios from "../../axios";
import moment from 'moment';
import './style.less'
const {Option} = Select
const ButtonGroup = Button.Group;

export default class AddForm extends Component{
    state = {
        subjectClassification:[],
        businessClassification:[],
        affiliatedInstitutions:[],
        list:[]
    }
    changeInput = (data,option) => {
        let value = this.props.sourceData
        value[option] = data
        this.props.dispatchLewsData(value)
    }   
    handleChange = (info) => {
        const fileList = info.fileList;
        let file = fileList.pop();
        if(info.file.status == 'done'){
            this.props.dispatchFileList([file])
        }
    }
    componentDidMount(){
        // this.requestGetBC();
        // this.requestGetAI();
        // this.requestGetSC();
        this.getList();
    }
    // //获取业务分类
    // requestGetBC = ()=>{
    //     let level = 2
    //     axios.ajax({
    //         url:'/lawAndDocument/getBusinessType',
    //         data:{
    //             params:{
    //                 level,
    //             }
    //         }
    //     }).then((res)=>{
    //         if(res){
    //             this.setState({
    //                 isVisible:false,
    //                 lewsData:{},
    //                 businessClassification:res.data
    //             })
    //         }
    //     })
    // }
    // //获取所属机构
    // requestGetAI = ()=>{
    //     let level = 1
    //     axios.ajax({
    //         url:'/lawAndDocument/getBusinessType',
    //         data:{
    //             params:{
    //                 level,
    //             }
    //         }
    //     }).then((res)=>{
    //         if(res){
    //             this.setState({
    //                 isVisible:false,
    //                 lewsData:{},
    //                 affiliatedInstitutions:res.data
    //             })
    //         }
    //     })
    // }
    // //获取主题分类
    // requestGetSC = ()=>{
    //     let level = 0
    //     axios.ajax({
    //         url:'/lawAndDocument/getBusinessType',
    //         data:{
    //             params:{
    //                 level,
    //             }
    //         }
    //     }).then((res)=>{
    //         if(res){
    //             this.setState({
    //                 isVisible:false,
    //                 lewsData:{},
    //                 subjectClassification:res.data
    //             })
    //         }
    //     })
    // }
    //获取级联列表
    getList = ()=>{
        axios.ajax({
            url:'/lawAndDocument/getJiLian',
            data:{
                params:{
                    typeDocument:0,
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    list:res.data
                })
            }
        })
    }
    //改变选择框
    changeList = (value,option) =>{
        this.changeInput(value,option)
        const {sourceData} = this.props
        if(option == 'subjectClassification'){
            if(sourceData.affiliatedInstitutions||sourceData.businessClassification){
                this.changeInput('','affiliatedInstitutions')
                this.changeInput('','businessClassification')
            }
            const affiliatedInstitutions = this.state.list.filter((item)=>{
                return item.info.className == sourceData.subjectClassification?true:false
            })
            this.setState({
                affiliatedInstitutions:affiliatedInstitutions[0].children
            })
        }
        else if(option == 'affiliatedInstitutions'){
            if(sourceData.businessClassification){
                this.changeInput('','businessClassification')
            }
            const businessClassification = this.state.affiliatedInstitutions.filter((item)=>{
                return item.info.className == sourceData.affiliatedInstitutions?true:false
            })
            this.setState({
                businessClassification:businessClassification[0].children
            })
        }
    }
    handleCancel = () => this.setState({ previewVisible: false });
    //上传文件
    handleFile = (info) => {
        const fileList = info.fileList;
        console.log("fileList",fileList)
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        const data = JSON.stringify(fileList)
        console.log("appendix",data)
        this.changeInput(data, 'appendix');

    }
    //查看图片
    handlePreview = file => {
        console.log(file)
        this.setState({
            previewImage: (file.response || {}).data,
            previewVisible: true,
        });
    };
    //下载文件
    downLoad = (file) => {
       const download = commonUrl + '/upload/picture/' + (file.response || {}).data
       window.open(download)
    }
    render() {
        let sourceData = this.props.sourceData||{};
        //转换返回的文件字段格式  转了需要使用
        let appendix = JSON.parse(sourceData.appendix||JSON.stringify([]))
        console.log("文件显示",appendix)
        // console.log("格式",this.state.affiliatedInstitutions)
         //上传文件显示
         const { previewVisible, previewImage,modifyVisible } = this.state;
         const columns = [
             {
                 title: '资料名称',
                 dataIndex: 'name',
                 key: 'name'
             },
             {
                 title: '上传日期',
                 dataIndex: 'lastModifiedDate',
                 key: 'lastModifiedDate'
             },
             {
                 title: '文件大小',
                 dataIndex: 'size',
                 key: 'size'
             },
             {
                 title: '操作',
                 dataIndex: 'operation',
                 render: (text, record,index) => {
                     // let displayButton = this.props.status == 'detail' ? 'none' : ''
                     return <ButtonGroup>
                         <Button type="primary" size="small" onClick={() => { this.handlePreview(record)}} style={{display:record.type=="image/jpeg"?'':'none'}}>查看</Button>
                         <Button type="primary" size="small" onClick={() => { this.downLoad(record) }}>下载</Button>
                         {/* <Button type="primary" size="small" onClick={() => { this.handleFileDelete(index) }} style={{display:displayButton}}>删除</Button> */}
                      </ButtonGroup>
                 }
             }
         ]
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
        const status = this.props.type == 'create'?'none':'block'
        const dateFormat = 'YYYY/MM/DD';
        return (
            <div>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>标题：</Col>
                    <Col span={15}><Input placeholder='请输入标题' value={sourceData.title} onChange={(e)=>this.changeInput(e.target.value,'title')} /></Col>
                    <Col span={3} style={{display:status,marginLeft:30}}>
                        <Select
                            style={{width:'100%'}}
                            value={sourceData.effect||undefined}
                            onChange={(value)=>{this.changeInput(value,'effect')}}
                        >
                            <Option value='有效'>有效</Option>
                            <Option value='废止'>废止</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style={{marginTop:30}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>文号：</Col>
                    <Col span={5}><Input placeholder='请输入文号' value={sourceData.articleNumber||''} onChange={(e)=>this.changeInput(e.target.value,'articleNumber')} /></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>成文日期：</Col>
                    <Col span={5}><DatePicker  value={sourceData.issueDate==undefined?null:moment(sourceData.issueDate, dateFormat)} format={dateFormat} onChange={(dataString)=>this.changeInput(dataString,'issueDate')} /></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>发布日期：</Col>
                    <Col span={5}><DatePicker  value={sourceData.writtenDate==undefined?null:moment(sourceData.writtenDate, dateFormat)} format={dateFormat} onChange={(dataString)=>this.changeInput(dataString,'writtenDate')} /></Col>
                </Row>
                <Row style={{marginTop:30}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>主题分类：</Col>
                    <Col span={5}>
                        <Select placeholder='请选择主题分类' style={{width:'100%'}} value={sourceData.subjectClassification} onChange={(value)=>this.changeList(value,'subjectClassification')}> 
                            {
                                this.state.list.map((item,index)=>(
                                    <Option value={item.info.className} key={index}>{item.info.className}</Option>
                                ))
                            }
                        </Select>
                    </Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>所属机构：</Col>
                    <Col span={5}>
                        <Select placeholder='请选择所属机构' style={{width:'100%'}} value={sourceData.affiliatedInstitutions} onChange={(value)=>this.changeList(value,'affiliatedInstitutions')}> 
                        {
                            this.state.affiliatedInstitutions.map((item,index)=>(
                                <Option value={item.info.className||''} key={index}>{item.info.className||''}</Option>
                            ))
                        }
                        </Select>
                    </Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>业务分类：</Col>
                    <Col span={5}>
                        <Select placeholder='请选择业务分类' style={{width:'100%'}} value={sourceData.businessClassification} onChange={(value)=>this.changeList(value,'businessClassification')}> 
                        {
                            this.state.businessClassification.map((item,index)=>(
                                <Option value={item.info.className} key={index}>{item.info.className}</Option>
                            ))
                        }
                        </Select>
                    </Col>
                </Row>
                <Row style={{marginTop:30}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>题注：</Col>
                    <Col span={18}><Input placeholder='请输入题注' defaultValue={sourceData.caption} onChange={(e)=>this.changeInput(e.target.value,'caption')} /></Col>
                </Row>
                <div className="editAreaBody">
                 <BraftEditor
                     controls={controls}
                     contentStyle={{height:500}}
                     value={sourceData.content}
                     onChange={(data)=>this.changeInput(data,'content')}
                 />
                </div>
                <Card style={{ width: 934,marginLeft:10 }}>
                        <div>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</div>
                        <Upload
                        name='file'
                        showUploadList={false}
                        disabled={this.props.status=='detail'?true:false}
                        action={commonUrl+'/upload/uploadReport'}
                        onChange={this.handleFile}
                        fileList={appendix}      
                        >             
                        <Button>
                            <Icon type="upload" /> 选择上传文件
                        </Button>
                    </Upload>  
                    <Table
                        columns={columns}
                        dataSource={appendix}
                        pagination={false}
                    />
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/report/'+previewImage} />
                    </Modal>
                    <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                        <Input  disabled={this.props.status=='detail'?true:false} onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
                    </Modal> 
                </Card>
            </div>
        )
    }
}