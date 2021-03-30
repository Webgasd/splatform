
import React, { Component } from 'react'
import {Card ,Table} from 'antd'
import  './style.less'

export default class RecordsFRorm extends Component {
    state = {
        list:[]
    }

    /**
   * @function 获取表格行的类名
   * @param {array} record 当前行数据
   * @param {number} index 当前行索引
   * @return {string} className 类名
   * */
    getRowClassName = (record, index) => {
        let className = '';
        className = record.readState == 1 ? 'viewed' : 'notViewed';
        return className;

    }

    render() {
        const columns = [
            {
                title:'查阅状态',
                dataIndex:'readstatus',
                key:'readstatus'
            },
            {
                title:'查阅人',
                dataIndex:'reader',
                key:'reader'
            },
            {
                title:'所属区域',
                dataIndex:'areaName',
                key:'areaName'
            },
            {
                title:'查询时间',
                dataIndex:'readTime',
                key:'readTime'
            }
        ]

        const recordsData = this.props.recordsData||{}
        console.log("查阅记录",recordsData)
        return (
            <div>
                <Card style={{marginTop:10}}>
                    <div style={{marginTop:30}}>
                        <Table
                            dataSource={recordsData}
                            pagination={this.state.pagination}
                            columns={columns}
                            pagination={this.state.pagination}
                            rowClassName={this.getRowClassName}
                        />
                    </div>
                </Card>
            </div>
        )
    }
}