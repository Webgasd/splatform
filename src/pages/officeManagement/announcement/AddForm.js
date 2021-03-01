
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
        let sourceData = this.props.sourceData||{};
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
        return (
            <div className='add'>
                <div className='left'>
                    <Card title="通知类型" extra={<a href="#">More</a>} style={{ width: 250 }}>
                        <Row>
                            <Col span={10}>发布人：</Col>
                            <Col span={5}></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={10}>发布日期：</Col>
                            <Col span={5}></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={10}>通知类型：</Col>
                            <Col span={10}>
                                <Select
                                style={{width:'100%'}}
                                value={sourceData.effect||undefined}
                                onChange={(value)=>{this.changeInput(value,'effect')}}
                                >
                                <Option value='1'>1</Option>
                                <Option value='2'>2</Option>
                            </Select>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="发送给" extra={<a href="#">More</a>} style={{ width: 250,height:400}}>
                            <p>Card content,a,d,v,fgh,jkll</p>
                    </Card>
                </div>
                <div className='rigth'>
                    <Card title="通知公告正文" extra={<a href="#">More</a>} style={{ width: 700,height:820 }}>
                        <Row>
                            <Col span={4}>通知文号：</Col>
                            <Col span={15}><Input placeholder='请输入文号' value={sourceData.articleNumber||''} onChange={(e)=>this.changeInput(e.target.value,'articleNumber')} /></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={4}>标题：</Col>
                            <Col span={15}><Input placeholder='请输入标题' value={sourceData.articleNumber||''} onChange={(e)=>this.changeInput(e.target.value,'articleNumber')} /></Col>
                        </Row>
                        <div className="editAreaBody">
                            <BraftEditor
                                controls={controls}
                                contentStyle={{height:500}}
                                value={sourceData.content}
                                onChange={(data)=>this.changeInput(data,'content')}
                            />
                        </div>
                    </Card>
                    <Card style={{ width: 700,marginTop:10}}>
                        <div>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</div>
                        <Table columns = {columns}  bordered/>
                    </Card>
                </div>
            </div>
        )
    }
}