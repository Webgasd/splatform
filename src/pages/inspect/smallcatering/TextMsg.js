import {Component} from "react";
import axios from "../../../axios";
import Utils from "../../../utils";
import {Button, Card, Col, Row, Radio, Tabs} from "antd";
import ETable from '../../../components/ETable';
import React from "react";

const TabPane = Tabs.TabPane;

export default class TextMsg extends Component{
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        // this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/dailyFood/getList',
            data:{
                params:{
                    checkId:this.props.id,
                    industryId:1
                }
            }
        }).then((res)=>{
            if(res.status == 'success'){
                console.log(res.data)
                let list  = res.data.map((item,i)=>{
                    item.key = i;
                    return item;})
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;
                        _this.requestList();
                    })
                })
            }
        })
    }

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render() {
        const columns = [
            {
                title: '检查日期',
                dataIndex: ' '
            }, {
                title: '文件名称',
                dataIndex: ' '
            },
            {
                title: '是否公示',
                dataIndex: ' '
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, item) => {
                    return <Row>
                        <Col span={12}>
                            <Button type="primary" size="small">查看</Button>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" size="small">导出</Button>
                        </Col>
                    </Row>
                }
            }

        ];

        return (
            <div>
                <Card style={{marginTop:10}}>
                    <div style={{marginTop:30}}>
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                            columns={columns}
                            row_selection='checkbox'
                        />
                    </div>
                </Card>
            </div>
        );
    }
}
