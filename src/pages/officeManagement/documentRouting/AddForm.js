import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select,Modal,Transfer,Upload,message,Icon} from 'antd'
import {commonUrl} from "../../../axios/commonSrc";
import './style.less'
import axios from "../../../axios";
import Utils from "../../../utils";
import 'braft-editor/dist/index.css'
import Process from './Process'
import moment from 'moment';
import ButtonGroup from 'antd/lib/button/button-group'
import Axios from 'axios';
import difference from 'lodash/difference';
const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;
const confirm = Modal.confirm;


class AddForm extends Component {
    state = {
        class: '',
        display_name: 'none',
        mockData: [],
        targetKeys:[],
        isModalVisible: false,
        isSelectVisible: false
    }
    params = {
        pageNo: 1
    }
    changeInput = (data, option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    componentDidMount() {
        this.getGovernment()
    }
    //获取政府人员信息
    getGovernment = () => {
        let _this = this
        axios.PostAjax({
            url: '/supervision/ga/getList',
            data: {
                params: { ...this.params, isPage: 1 }
            }
        }).then((res) => {
            if (res.status == 'success') {
                const originTargetKeys = res.data.data.map((item, index) => {
                    return {
                        key: item.id.toString(),
                        name: item.name,
                        deptName: item.deptName,
                        jobName: item.jobName,
                        id: item.id
                    }
                })
                _this.setState({
                    mockData: originTargetKeys,
                })
            }
        })
    }
    //选择审核人
    //穿梭框改变选择
    onChange = nextTargetKeys => {
        this.setState({ targetKeys: nextTargetKeys });
    };
    //选择审核人
    handSelect = (value) => {
        this.changeInput(value, 'reviewerId')
        const reviewer = this.state.mockData.find(
            item => value === item.id
        )
        this.changeInput(reviewer.name,'reviewer')
        this.setState({
            isSelectVisible:false
        })
    }
    handleReader = () => {
        const valueSelect = this.state.targetKeys||[]
        const list = valueSelect.map((item,index)=>{
            const reviewer = this.state.mockData.find(
                data => parseInt(item) === data.id
            )
            return reviewer.name
        })
        this.changeInput(this.state.targetKeys,'ids')
        this.changeInput(list.toString(),'allReaders')
        this.setState({
            isModalVisible:false
        })
    }
    //处理上传文件
    handleFile = (info) => {     
        let fileList = info.fileList;
        console.log("fileList",fileList)
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        let appendix = JSON.stringify(fileList)//这里需转换格式
        this.changeInput(appendix,"appendix"); 
        
    };
    handleCancel = () => this.setState({ previewVisible: false });
    //查看图片
    handlePreview = file => {
        this.setState({
            previewImage: (file.response||{}).data,
            previewVisible: true,
        });
    };
    //下载文件
    downLoad = (file) => {
       const download = commonUrl + '/upload/picture/' + (file.response || {}).data
       window.open(download)
    }
    
    //文件结束
     //处理功能  处理时间为当前时间
     handleDocument = () => {
        let date = moment().format("YYYY-MM-DD")
        this.setState({
            informData:{reviewTime:date},
            isProVisible:true
        })
    }
    //处理提交   发起请求
    handleProcess = ()=>{
        axios.PostAjax({
            url:'/documentCirculate/updateState',
            data:{
                params:{...this.state.informData}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let data = res.data.data||[]
                this.setState({
                    informData:this.state.informData,
                    isProVisible:false
                })
            }
        })
    }
    render() {
        let {informData} = this.props;
        const importance = this.props.importance
        const units = this.props.units
        //若是添加，显示当前用户名 查看和修改显示已有的作者
        let userFlag = this.props.status == 'create'?true:false
        //转换返回的文件字段格式  转了需要使用
        let appendix = JSON.parse(informData.appendix||JSON.stringify([]))
        //判断是编辑操作还是（查看|审核操作） 若是编辑操作 设置为false 允许编辑 
        const status = this.props.status == 'detail'||this.props.status == 'check' ? true : false
        //判断是编辑操作还是（查看|审核操作） 若是编辑操作 设置为false 允许编辑 
        let displayButton = this.props.status == 'detail'||this.props.status == 'check' ? 'none' : ''
        //如果是编辑和添加操作 隐藏一个Card
        this.state.display_name = this.props.status == 'modify'||this.props.status == 'create' ? 'none':''
        ////如果是编辑操作 设置Card标题
        let titles = this.props.status == 'detail'?"审核":"拟办"
        //区分查看和审核处理  Card按钮 若是审核操作显示按钮
        let displayHandleButton = this.props.status == 'detail'?'none':''
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
                width:300,
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

        //穿梭框
        const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
            <Transfer {...restProps} showSelectAll={false} >
                {({
                    direction,
                    filteredItems,
                    onItemSelectAll,
                    onItemSelect,
                    selectedKeys: listSelectedKeys,
                    disabled: listDisabled,
                }) => {
                    const columns = direction === 'left' ? leftColumns : rightColumns;
                    const pagination = direction === 'left' ? this.state.pagination : true;
                    const rowSelection = {
                        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                        onSelectAll(selected, selectedRows) {
                            const treeSelectedKeys = selectedRows
                                .filter(item => !item.disabled)
                                .map(({ key }) => key);
                            const diffKeys = selected
                                ? difference(treeSelectedKeys, listSelectedKeys)
                                : difference(listSelectedKeys, treeSelectedKeys);
                            onItemSelectAll(diffKeys, selected);
                        },
                        onSelect({ key }, selected) {
                            onItemSelect(key, selected);
                        },
                        selectedRowKeys: listSelectedKeys,
                    };

                    return (
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredItems}
                            size="small"
                            pagination
                            style={{ pointerEvents: listDisabled ? 'none' : null }}
                            onRow={({ key, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) return;
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                },
                            })}
                        />
                    );
                }}
            </Transfer>
        );

        const leftTableColumns = [
            {
                dataIndex: 'name',
                title: '姓名',
            },
            {
                dataIndex: 'deptName',
                title: '所属部门',
            },
            {
                dataIndex: 'jobName',
                title: '职务',
            },
        ];
        const columns1 = [
            {
                dataIndex: 'name',
                title: '姓名',
            },
            {
                dataIndex: 'deptName',
                title: '所属部门',
            },
            {
                dataIndex: 'jobName',
                title: '职务',
            },
            {
                dataIndex: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <ButtonGroup>
                        <Button type='default' onClick={()=>this.handSelect(record.id)}>选择</Button>
                    </ButtonGroup>
                }
            }
        ];
        const rightTableColumns = [
            {
                dataIndex: 'name',
                title: '姓名',
            },
        ];
        return (
            <div className='addContent'>
                <div className='leftContent'>
                    <Card title="企业通知类型" style={{ width: 250 }}>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>发布人：</Col>
                            <Col span={12}>{userFlag?informData.userName:informData.author}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>收文日期：</Col>
                            <Col span={12}>{informData.issueDate}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>重要性：</Col>
                            <Col span={12}>
                                <Select value={informData.typeId} style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'typeId')} disabled={status}>
                                    {importance.map((item) => {
                                        return <Option key={item.id} value={item.id}>{item.className}</Option>
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="拟办" style={{ width: 250, marginTop: 10 }} extra={<Button type="primary" size='small' onClick={()=>this.setState({isSelectVisible:true})} disabled={status} style={{display:displayButton}}>拟办人</Button>} >
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>拟办人：</Col>
                            <Col span={12}>{informData.reviewer}</Col>
                        </Row>
                    </Card>
                    <Card title="发送给" style={{ width: 250,height:250,marginTop: 10 }} extra={<Button type="primary" size='small' onClick={()=>this.setState({isModalVisible:true})} disabled={status} style={{display:displayButton}}>查阅人</Button>}>                     
                         <div>{informData.allReaders}</div> 
                     </Card>
                     <Card title={titles} style={{ width: 250,height:250,marginTop: 10 ,display:this.state.display_name}} extra={<Button type="primary" size='small' onClick={this.handleDocument} style={{display:displayHandleButton}}>处理</Button>}>                     
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>拟办时间：</Col>
                            <Col span={12}>{informData.reviewTime}</Col>
                        </Row> 
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>拟办结果：</Col>
                            <Col span={12}>{informData.reviewComment}</Col>
                        </Row> 
                     </Card>
                </div>
                <div className='rightContent'>
                    <Card title="企业公告正文" style={{ width: 700 }}>
                        <Row style={{marginTop:10}}>
                            <Col span={3} style={{textAlign:'right',fontSize:15}}>来文单位：</Col>
                            <Col span={19}>
                                <Select value={informData.sourcedocCompanyId}  style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'sourcedocCompanyId')} disabled={status}>
                                    {units.map((item) => {
                                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={3} style={{textAlign:'right',fontSize:15}}>来文文号：</Col>
                            <Col span={7}><Input placeholder='请输入来入文号' value={informData.sourcedocNumber||''} onChange={(e)=>this.changeInput(e.target.value,'sourcedocNumber')} disabled={status}/></Col>
                            <Col span={5} style={{textAlign:'right',fontSize:15}}>公文流转号：</Col>
                            <Col span={7}><Input placeholder='保存后自动生成' disabled={true} value={informData.docNumber||''} onChange={(e)=>this.changeInput(e.target.value,'docNumber')}/></Col>       
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={3} style={{textAlign:'right',fontSize:15}}>标题：</Col>
                            <Col span={19}><Input placeholder='请输入标题' value={informData.title||''} onChange={(e)=>this.changeInput(e.target.value,'title')} disabled={status}/></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <TextArea rows={6} placeholder='请输入内容' value={informData.content} disabled={status} onChange={(e) => this.changeInput(e.target.value, 'content')}/>
                        </Row>
                    </Card>
                    <Card style={{ width: 700 }}>
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
                    <img alt="example" style={{ width: '100%' }} src={commonUrl+'/upload/picture/'+previewImage} />
                    </Modal>
                    <Modal visible={modifyVisible} onOk={this.handleFileNameSubmit} okText='确定' cancelText='取消' onCancel={this.handleFileNameCancel}>
                        <Input  disabled={this.props.status=='detail'?true:false} onChange={(e)=>this.changeFileName(e.target.value)} value={this.state.handleFileName}/>
                    </Modal> 
                    </Card>
                </div>
                
                <Modal
                    width='800px'
                    title='人员列表'
                    visible={this.state.isModalVisible}
                    onOk={() => {this.handleReader()}}
                    onCancel={() => { this.setState({ isModalVisible: false }) }}
                >
                    <TableTransfer
                        dataSource={this.state.mockData}
                        targetKeys={this.state.targetKeys}
                        disabled={false}
                        showSearch={true}
                        onChange={this.onChange}
                        filterOption={(inputValue, item) =>
                            item.name.indexOf(inputValue) !== -1 || item.deptName.indexOf(inputValue) !== -1
                        }
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                    />
                </Modal>
                <Modal
                    width='800px'
                    title='人员列表'
                    visible={this.state.isSelectVisible}
                    footer={null}
                    onCancel={()=>this.setState({isSelectVisible:false})}
                >
                    <Table
                        size='small'
                        dataSource={this.state.mockData}
                        columns={columns1}
                    />
                </Modal>
                <Modal
                    width='600px'
                    title='处理'
                    visible={this.state.isProVisible}
                    onOk={this.handleProcess}
                    destroyOnClose={true}
                    onCancel={()=>
                        this.setState({
                            isProVisible:false,
                            informData:{}
                        })
                    }
                >
                   <Process informData={this.state.informData} dispatchInformData = {(value) => this.setState({informData:value})}/>
                </Modal>
            </div>
        )
    }
}
export default AddForm
