import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select, Transfer, Modal } from 'antd'
import './style.less'
import Utils from "../../../utils";
import axios from "../../../axios";
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import ButtonGroup from 'antd/lib/button/button-group'
import Axios from 'axios';
import difference from 'lodash/difference';
const { TextArea } = Input;
const { Option } = Select;


class AddForm extends Component {
    state = {
        class: '',
        mockData: [],
        targetKeys: '',
        isModalVisible: false
    }
    params = {
        pageNo:1
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
    //获取政府人员信息
    getGovernment = () => {
        let _this = this
        axios.PostAjax({
            url: '/supervision/ga/getList',
            data: {
                params: {...this.params}
            }
        }).then((res) => {
            if (res.status == 'success') {
                const originTargetKeys = res.data.data.map((item, index) => {
                    return {
                        key: item.id.toString(),
                        name: item.name,
                        deptName: item.deptName,
                        jobName: item.jobName
                    }
                })
                _this.setState({
                    mockData: originTargetKeys,
                    // pagination: Utils.paginationCommon(res, (current) => {
                    //     _this.params.pageNo = current;//	当前页数
                    //     _this.getGovernment(); //刷新列表数据
                    // })   
                    pagination:{
                        onChange:(current)=>{
                            _this.params.pageNo = current;//	当前页数
                            _this.getGovernment(); //刷新列表数据
                        },
                        current:res.data.pageNo,
                        pageSize:10,
                        total: res.data.total,
                    }
                })
            }
        })
    }
    changeInput = (data, option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    //选择审核人
    //穿梭框改变选择
    onChange = nextTargetKeys => {
        this.setState({ targetKeys: nextTargetKeys });
    };
    componentDidMount() {
        this.getClass()
        this.getGovernment()
    }
    render() {
        const allClass = this.state.class || []
        const status = this.props.status == 'detail' || this.props.status == 'check' ? true : false
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
                    const pagination = direction === 'left' ? this.state.pagination:true;
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
                            pagination={pagination}
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
                            <Col span={12}>{informData.userName}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>发布日期：</Col>
                            <Col span={12}>{informData.date}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>类型：</Col>
                            <Col span={12}>
                                <Select value={informData.type} style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'type')} disabled={status}>
                                    {allClass.map((item) => {
                                        return <Option key={item.id} value={item.type}>{item.type}</Option>
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="审核人" style={{ width: 250, marginTop: 10 }} extra={[<Button type='primary' onClick={() => this.setState({ isModalVisible: true })}>审核人</Button>, <Button>WERR</Button>]}>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>审核人：</Col>
                            <Col span={12}>{informData.date}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ textAlign: 'right', fontSize: 15 }}>传阅人：</Col>
                            <Col span={12}>{informData.date}</Col>
                        </Row>
                    </Card>
                    <Card title="发送给" style={{ width: 250, marginTop: 10 }}>
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
                        <Table columns={columns} bordered />
                    </Card>
                </div>
                <Modal
                    width='800px'
                    title='人员列表'
                    visible={this.state.isModalVisible}
                    onOk={() => { this.setState({ isModalVisible: false }) }}
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
            </div>
        )
    }
}
export default AddForm
