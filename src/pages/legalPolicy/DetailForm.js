
import React, { Component } from 'react'
import {Button, Card,Col,Row, Table} from 'antd'
import './style.less'
import { render } from 'less'
import ButtonGroup from 'antd/lib/button/button-group'

export default class DetailForm extends Component {
    state = {
        list:[]
    }
    render() {
        const detailData = this.props.detailData||{}
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
                        <Col span={21}>{detailData.title}</Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>文号</Col>
                        <Col span={5}>{detailData.articleNumber}</Col>
                        <Col span={3}>成文日期</Col>
                        <Col span={5}>{detailData.writtenDate}</Col>
                        <Col span={3}>发布日期</Col>
                        <Col span={5}>{detailData.issueDate}</Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>效力</Col>
                        <Col span={5}>{detailData.effect}</Col>
                        <Col span={3}>所属机构</Col>
                        <Col span={5}>{detailData.affiliatedInstitutions}</Col>
                        <Col span={3}>主题分类</Col>
                        <Col span={5}>{detailData.subjectClassification}</Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>题注</Col>
                        <Col span={21}>{detailData.caption}</Col>
                    </Row>
                </Card>
                <Card style={{marginTop:20}}>
                    <div>
                        {detailData.content}
                    </div>
                </Card>
                <Card style={{marginTop:20}}> 
                    <Table columns={columns} dataSource={this.state.list} bordered/>
                </Card>
            </div>
        )
    }
}