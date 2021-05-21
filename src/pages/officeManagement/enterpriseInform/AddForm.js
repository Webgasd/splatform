import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select,Icon,Upload,message,Modal} from 'antd'
import './style.less'
import axios from "../../../axios";
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import ButtonGroup from 'antd/lib/button/button-group'
import moment from 'moment';
import {commonUrl} from '../../../axios/commonSrc'
const { TextArea } = Input;
const { Option } = Select;


class AddForm extends Component {
    state = {
        class: ''
    }
    //获取通知类型
    getClass = () => {
        let _this = this
        axios.PostAjax({
            url: '/enterpriseNotice/getAllClass',
            data: {
                params: ''
            }
        }).then((res) => {
            if (res.status == 'success') {
                _this.setState({
                    class: res.data
                })
            }
        })
    }
    changeInput = (data, option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    componentDidMount() {
        this.getClass()
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
       const download = commonUrl + '/upload/report/' + (file.response || {}).data
       window.open(download)
    }
    render() {
        const appendix = JSON.parse(this.props.informData.appendix || JSON.stringify([]))
        const allClass = this.state.class || []
        const status = this.props.status == 'detail'||this.props.status == 'check' ? true : false
        const { informData } = this.props
        const controls = [
            'undo', 'redo', 'separator',
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
            'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
            'link', 'separator', 'hr', 'separator',
            'media', 'separator',
            'clear'
        ]
        //上传文件显示
        const { previewVisible, previewImage,modifyVisible } = this.state;
        const columns = [
            {
                title: '资料名称',
                dataIndex: 'name',
                key: ''
            },
            {
                title: '上传日期',
                dataIndex: 'lastModifiedDate',
                key: 'lastModifiedDate',
                render:(lastModifiedDate)=>{
                    return moment(lastModifiedDate).format('YYYY-MM-DD')
                }
            },
            {
                title: '文件大小',
                dataIndex: 'size',
                key: 'size'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <ButtonGroup>
                        <Button type="primary" size="small" onClick={() => { this.handlePreview(record)}} style={{display:record.type=="image/jpeg"?'':'none'}}>查看</Button>
                         <Button type="primary" size="small" onClick={() => { this.downLoad(record) }}>下载</Button>
                    </ButtonGroup>
                }
            }
        ]
        return (
            <div className='addContent'>
                <div className='leftContent'>
                    <Card title="通知类型" style={{ width: 250 }}>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ fontSize: 15 }}>发布人：</Col>
                            <Col span={12}>{informData.userName}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ fontSize: 15 }}>发布日期：</Col>
                            <Col span={12}>{informData.date}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ fontSize: 15 }}>类型：</Col>
                            <Col span={12}>
                                <Select value={informData.type} style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'type')} disabled={status}>
                                    {allClass.map((item) => {
                                        return <Option key={item.id} value={item.type}>{item.type}</Option>
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="企业公告标题" style={{ width: 250, marginTop: 10 }}>
                        <TextArea
                            value={informData.title}
                            onChange={(e) => { this.changeInput(e.target.value, 'title') }}
                            placeholder="请输入企业公告标题"
                            autoSize={{ minRows: 5, maxRows: 5 }}
                            disabled={status}
                        />
                    </Card>
                    <Card title="标题图" style={{ width: 250, marginTop: 10 }}>

                    </Card>
                </div>
                <div className='rightContent'>
                    <Card title="企业公告正文" style={{ width: 700 }}>
                        <BraftEditor
                            controls={controls}
                            contentStyle={{ height: 500 }}
                            value={informData.content}
                            onChange={(data) => this.changeInput(data, 'content')}
                            readOnly={status}
                        />
                    </Card>
                    <Card style={{ width: 700 }}>
                        <div>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</div>
                        <Upload
                            action={commonUrl + '/upload/uploadReport'}
                            onChange={(info) => this.handleFile(info)}
                            showUploadList={false}
                            fileList={appendix}
                            disabled={this.props.status=='detail'?true:false}
                        >
                            <Button style={{ margin: 10 }}><Icon type="upload"/>上传附件</Button>
                        </Upload>
                    <Table columns={columns} dataSource={appendix} bordered />
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/report/'+previewImage} />
                    </Modal>
                    <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                        <Input  disabled={this.props.status=='detail'?true:false} onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
                    </Modal> 
                    </Card>
                </div>
            </div>
        )
    }
}
export default AddForm
