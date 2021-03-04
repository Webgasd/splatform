
import React, { Component } from 'react'
import {Button, Card,Col,Row, Table} from 'antd'
import ETable from '../../../components/ETable'
import 'braft-editor/dist/index.css'
import './style.less'
import { render } from 'less'
import ButtonGroup from 'antd/lib/button/button-group'

export default class RecordsFRorm extends Component {
    state = {
        list:[]
    }

    render() {
        const columns = [
            {
                title:'查阅状态',
                dataIndex:'subjectClassification',
                key:'subjectClassification'
            },
            {
                title:'查阅人',
                dataIndex:'title',
                key:'title'
            },
            {
                title:'所属部门',
                dataIndex:'affiliatedInstitutions',
                key:'affiliatedInstitutions'
            },
            {
                title:'查询时间',
                dataIndex:'issueDate',
                key:'issueDate'
            }
        ]

        const recordsData = this.props.recordsData||{}
        console.log("查阅记录",recordsData)
        return (
            <div>
                <Card style={{marginTop:10}}>
                    <div style={{marginTop:30}}>
                        <ETable
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                            columns={columns}
                        />
                    </div>
                </Card>
            </div>
        )
    }
}