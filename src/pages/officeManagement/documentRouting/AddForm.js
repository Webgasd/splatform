import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select,Modal,Collapse} from 'antd'
import './style.less'
import axios from "../../../axios";
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import  BaseForm  from '../../../components/BaseForm';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import ButtonGroup from 'antd/lib/button/button-group'
import SelectForm from './SelectForm'
import Axios from 'axios';
const { TextArea } = Input;
const { Option } = Select;
// const { Link } = Anchor;
const { Search } = Input;

class AddForm extends Component {
    state = {
        class: '',
       sponsorsList:[]   //拟办人列表
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
        //this.getClass()
    }
    //获取拟办人列表
    GetSponsorsList = ()=>{
        let _this = this
        axios.PostAjax({
            url: '',
            data: {
                params: ''
            }
        }).then((res) => {
            if (res.status == 'success') {
                _this.setState({
                    sponsorsList: res.data
                })
            }
        })
    }
    //显示拟办人
    showSponsors= ()=>{
        this.setState({isList1Visible:true})
    }

    render() {
        let sourceData = this.props.sourceData||{};
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
        const columns = [
            {
                title: '资料名称',
                dataIndex: '',
                key: ''
            },
            {
                title: '上传日期',
                dataIndex: '',
                key: ''
            },
            {
                title: '文件大小',
                dataIndex: '',
                key: ''
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <ButtonGroup>
                        <Button type='primary'>查看</Button>
                        <Button type='primary'>下载</Button>
                    </ButtonGroup>
                }
            }
        ]
        const leftColumns = [
            {
                title: '姓名',
                dataIndex: '',
                key: ''
            },
            {
                title: '所属部门',
                dataIndex: '',
                key: ''
            },
            {
                title: '职务',
                dataIndex: '',
                key: ''
            }
        ]
        const rigthColumns = [
            {
                title: '姓名',
                dataIndex: '',
                key: ''
            }
        ]
        return (
            <div className='addContent'>
                <div className='leftContent'>
                    <Card title="企业通知类型" style={{ width: 250 }}>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>发布人：</Col>
                            <Col span={12}>{informData.userName}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>收文日期：</Col>
                            <Col span={12}>{informData.date}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>重要性：</Col>
                            <Col span={12}>
                                <Select value={informData.type} style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'type')} disabled={status}>
                                    {allClass.map((item) => {
                                        return <Option key={item.id} value={item.type}>{item.type}</Option>
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    </Card>
                    {/* extra={[<Button type="primary" size='small' onClick={()=>this.setState({isList1Visible:true})}>拟办人</Button>,<Button type="primary" size='small' onClick={()=>this.setState({isList2Visible:true})}>传阅人</Button>]} */}
                    <Card title="拟办" style={{ width: 250, marginTop: 10 }} extra={<Button type="primary" size='small' onClick={()=>this.setState({isListVisible:true})}>拟办人</Button>} >
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>拟办人：</Col>
                            <Col span={12}>{informData.userName}</Col>
                        </Row>
                    </Card>
                    <Card title="发送给" style={{ width: 250,height:250,marginTop: 10 }} extra={<Button type="primary" size='small' onClick={()=>this.setState({isListVisible:true})}>查阅人</Button>}>

                    </Card>
                </div>
                <div className='rightContent'>
                    <Card title="企业公告正文" style={{ width: 700 }}>
                        <Row style={{marginTop:10}}>
                            <Col span={3} style={{textAlign:'right',fontSize:15}}>来文单位：</Col>
                            <Col span={19}><Input placeholder='请输入来文单位' value={sourceData.articleNumber||''} onChange={(e)=>this.changeInput(e.target.value,'articleNumber')} /></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={3} style={{textAlign:'right',fontSize:15}}>来文文号：</Col>
                            <Col span={7}><Input placeholder='请输入来入文号' value={sourceData.articleNumber||''} onChange={(e)=>this.changeInput(e.target.value,'articleNumber')} /></Col>
                            <Col span={5} style={{textAlign:'right',fontSize:15}}>公文流转号：</Col>
                            <Col span={7}><Input placeholder='请输输入公文流转号' value={sourceData.articleNumber||''} onChange={(e)=>this.changeInput(e.target.value,'articleNumber')} /></Col>       
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={3} style={{textAlign:'right',fontSize:15}}>标题：</Col>
                            <Col span={19}><Input placeholder='请输入标题' value={sourceData.articleNumber||''} onChange={(e)=>this.changeInput(e.target.value,'articleNumber')} /></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <TextArea rows={6} placeholder='请输入内容'/>
                        </Row>
                    </Card>
                    <Card style={{ width: 700 }}>
                        <div>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</div>
                        <Table columns={columns} bordered />
                    </Card>
                </div>
                
                <Modal
                    width='1000px'
                    title='人员列表'
                    visible={this.state.isListVisible}
                    onOk={()=>this.setState({isListVisible:false})}
                    destroyOnClose={true}
                    onCancel={()=>
                        this.setState({
                            isListVisible:false,
                            informData:{}
                        })
                    }
                >
                   <SelectForm/>
                </Modal>
            </div>
        )
    }
}
export default AddForm
