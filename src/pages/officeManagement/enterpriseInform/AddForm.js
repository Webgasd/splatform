import React, { Component } from 'react'
import { Button,Card, Row,Col,Table,Input } from 'antd'
import './style.less'
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import ButtonGroup from 'antd/lib/button/button-group'
const { TextArea } = Input;


class AddForm extends Component {
    state = {
        
    }
    changeInput = (data,option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    render() {
        const {informData} = this.props
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
            <div className='addContent'>
                <div className='leftContent'>
                    <Card title="企业通知类型" style={{ width: 250 }}>
                        <Row style={{marginTop:10}}>
                            <Col span={12} style={{textAlign:'right',fontSize:15}}>发布人：</Col>
                            <Col span={12}></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={12} style={{textAlign:'right',fontSize:15}}>发布日期：</Col>
                            <Col span={12}>{informData.issueDate}</Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={12} style={{textAlign:'right',fontSize:15}}>类型：</Col>
                            <Col span={12}></Col>
                        </Row>
                    </Card>
                    <Card title="企业公告标题" style={{ width: 250,marginTop:10 }}>
                        <TextArea
                        value={informData.title}
                        onChange={(e)=>{this.changeInput(e.target.value,'title')}}
                        placeholder="请输入企业公告标题"
                        autoSize={{ minRows: 5, maxRows: 5 }}
                        />
                    </Card>
                    <Card title="标题图" style={{ width: 250,marginTop:10 }}>
                        
                    </Card>
                </div>
                <div className='rightContent'>
                    <Card title="企业公告正文" style={{ width: 700}}>
                        <BraftEditor
                        controls={controls}
                        contentStyle={{height:500}}
                        value={informData.content}
                        onChange={(data)=>this.changeInput(data,'content')}
                        />   
                    </Card>
                    <Card style={{ width: 700}}>
                        <div>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</div>
                        <Table columns = {columns}  bordered/>
                    </Card>
                </div>
            </div>
        )
    }
}
export default AddForm
