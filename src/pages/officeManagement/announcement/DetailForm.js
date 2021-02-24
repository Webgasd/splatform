
import React, { Component } from 'react'
import {Button, Card,Col,Row, Table} from 'antd'
import './style.less'
import { render } from 'less'
import ButtonGroup from 'antd/lib/button/button-group'

export default class DetailForm extends Component {
    state = {
        list:[],
    }
   

    render() {
        const {annoData} = this.props
        console.log('detail form',annoData)
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
            <div>
                <Card>
                    <Row>
                        <Col span={3}>标题</Col>
                        <Col span={21}>{annoData.noticeTitle}</Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>发布人</Col>
                        <Col span={5}>{annoData.address}</Col>
                        <Col span={3}>发布日期</Col>
                        <Col span={5}>{annoData.address}</Col>
                        <Col span={3}>通知类型</Col>
                        <Col span={5}>{annoData.address}</Col>
                    </Row>
                </Card>
                <Card style={{marginTop:10}}>
                    <Row>
                        <Col span={3}>审核人</Col>
                        <Col span={5}></Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>传阅人</Col>
                        <Col span={20}></Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>发送给</Col>
                        <Col span={20}></Col>
                    </Row>
                </Card>
                <Card style={{marginTop:10}}>
                    <Row>
                        <Col span={3}>审核时间</Col>
                        <Col span={10}></Col>
                        <Col span={3}>审核结果</Col>
                        <Col span={10}></Col>
                    </Row>
                </Card>
                <Card style={{marginTop:20}}>
                    <div>
                        {}
                    </div>
                </Card>
                <Card style={{marginTop:20}}> 
                    <Table columns={columns} dataSource={this.state.list} bordered/>
                </Card>
            </div>
        )
    }
}