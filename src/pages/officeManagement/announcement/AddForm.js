
import React, { Component } from 'react'
import {Row,Col,Input,Select,DatePicker, Upload,Table,Button, Card} from 'antd'
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import moment from 'moment';
import './style.less'
const {Option} = Select
const ButtonGroup = Button.Group;

export default class AddForm extends Component{
    state = {

    }
    changeInput = (data,option) => {
        let value = this.props.annoData
        value[option] = data
        this.props.dispatchannoData(value)
    }   
    handleChange = (info) => {
        const fileList = info.fileList;
        let file = fileList.pop();
        if(info.file.status == 'done'){
            this.props.dispatchFileList([file])
        }
    }
    
    render() {
        const columns = [
            {
                title:'资料名称',
                dataIndex:'',
                key:''
            },
            {
                title:'上传日期',
                dataIndex:'',
                key:''
            },
            {
                title:'文件大小',
                dataIndex:'',
                key:''
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) => {
                    return <ButtonGroup>
                        <Button type='primary'>查看</Button>
                        <Button type='primary'>下载</Button>
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
        let annoData = this.props.annoData||{};
        console.log('annoData', annoData)
        const status = this.props.type == 'create'?'none':'block'
        const dateFormat = 'YYYY/MM/DD';
        return (
            <div>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>标题：</Col>
                    <Col span={12}><Input placeholder='请输入标题' value={annoData.title} onChange={(e)=>this.changeInput(e.target.value,'title')} /></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>类型：</Col>
                    <Col span={3} style={{display:status,marginLeft:30}}>
                        <Select
                            style={{width:'100%'}}
                            value={annoData.effect||undefined}
                            onChange={(value)=>{this.changeInput(value,'effect')}}
                        >
                            <Option value='特殊通知'>特殊通知</Option>
                            <Option value='一般通知'>一般通知</Option>
                        </Select>
                    </Col>
                </Row>  
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>发送给：</Col>
                    <Col span={19}><Input placeholder='请输接收通知人员名称' value={annoData.title} onChange={(e)=>this.changeInput(e.target.value,'title')} /></Col>
                </Row>                        
                <div className="editAreaBody">
                 <BraftEditor
                     controls={controls}
                     contentStyle={{height:500}}
                     value={annoData.content}
                     onChange={(data)=>this.changeInput(data,'content')}
                 />
                </div>
                <div className="editAreaBody">
                    <span style={{marginTop:30,flex:1}}>上传提示：上传的文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</span>
                    <Upload
                        name='file'
                        showUploadList={false}
                        // action={}
                        fileList={this.props.fileList}
                        onChange={(info) => this.handleChange(info)}
                    >
                        <Button className='button'>添加附件</Button>
                    </Upload>
                    <Table bordered className='table' columns={columns} dataSource={this.props.fileList}/>
                </div>
            </div>
        )
    }
}