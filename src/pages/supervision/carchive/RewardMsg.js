import React, {Component} from "react";
import axios from "../../../axios";
import {Button, Row, Col, Modal, Table} from "antd";
import Utils from "../../../utils";
import Zmage from 'react-zmage'
import connect from "react-redux/es/connect/connect";
import {commonUrl} from '../../../axios/commonSrc'
// import {Image} from "echarts/src/util/graphic";
const ButtonGroup = Button.Group;
@connect(
    state => ({
        input: state.input
    })
)
class RewardMsg extends Component {
    state = {}
    params = {
        pageNo: 1,
        pageFlag:1,//传该标志位表示需要分页
        pageSize:5,
        enterpriseId:this.props.input.enterpriseId
    }
    componentDidMount() {
        this.requestList();
    }

    requestList = () => {
        console.log(this.props.input)
        let _this = this;
        axios.PostAjax({
            url: '/supervision/enterpriseCredit/getById',
            data: {
                params: this.params,
            }
        }).then((res) => {
            if (res.status == 'success') {
                let list = res.data.data.map((item, i) => {
                    item.key = i;
                    return item;
                })
                this.setState({
                    list: list,
                    pagination: Utils.pagination(res, (current) => {
                        _this.params.pageNo = current;
                        _this.requestList();
                    })
                })
            }
        })
    }
    handleOperator = (type, item) => {
        if (type == 'create') {
            if (JSON.stringify(this.props.input) !== '{}') {
                this.setState({
                    title: '创建员工',
                    isVisible: true,
                    type
                })
            } else {
                alert("无企业信息")
                return;
            }
        } else if (type == "edit" || type == 'detail') {
            this.setState({
                title: type == 'edit' ? '编辑用户' : '查看详情',
                isVisible: true,
                rewardInfo: item,
                type
            })
            this.setData(item)
        } else if (type == "delete") {
            Modal.confirm({
                content: '确定要删除吗？',
                onOk: () => {
                    axios.ajax({
                        url: '/supervision/rewards/delete',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then((res) => {
                        if (res.status == 'success') {
                            this.setState({
                                isVisible: false
                            })
                            this.requestList();
                        }
                    })
                }
            })
        }
    }
    setData = (item) => {
        const enclosure = JSON.parse(item.enclosure)
        console.log(enclosure)
        let imgUrl = enclosure.map((item,index) => {
            return  commonUrl + '/upload/picture/'+item.response.data
        })
        this.setState({
            imgUrl
        })
        console.log(imgUrl)
    }
    handleSubmit = () => {
        this.setState({
            isVisible: false,
            rewardInfo: {}
        })
    }

    render() {
        const columns = [
            {
                title: '违规日期',
                dataIndex: 'violationDate',
                render: Utils.formatDateNoTime
            }, {
                title: '违规类型',
                dataIndex: 'violationType'
            },
            {
                title: '违规信息标题',
                dataIndex: 'violationTitle'
            },
            {
                title: '执法人员',
                dataIndex: 'agentPerson',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <div>{this.props.type == 'detail' ? <Button type="primary" size='small' onClick={() => {
                        this.handleOperator('detail', record)
                         }}>查看</Button> : <ButtonGroup>
                        <Button type="primary" size='small' onClick={() => {
                            this.handleOperator('detail', record)
                        }}>查看</Button>
                        {/*<Button type="primary" size='small' onClick={() => {*/}
                        {/*    this.handleOperator('edit', record)*/}
                        {/*}}>修正</Button>*/}
                        <Button type="primary" size='small' onClick={() => {
                            this.handleOperator('delete', record)
                        }}>删除</Button>
                         </ButtonGroup>
                    }
                    </div>
                }
            }
        ];

        return (
            <div>
                <div style={{marginTop: 10}}>
                    <Button type="primary" onClick={() => {
                        this.handleOperator('create', null)
                    }} style={{marginBottom: 5}}>添加</Button>
                    <Table
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={columns}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    destroyOnClose
                    onCancel={() => {
                        this.setState({
                            isVisible: false,
                            rewardInfo: {}
                        })
                    }}
                >
                    <Row>
                        {
                            (this.state.imgUrl||[]).map( (item,index) => {
                                return(
                                    <Col span={8} key={index}>
                                        <Zmage key={index} src={item} style={{height:"100%",width:"100%"}}/>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Modal>
            </div>

        );
    }
}

export default RewardMsg;