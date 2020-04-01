import {Component} from "react";
import axios from "../../../axios";
import Utils from "../../../utils";
import {Button, Card, Col, Row, Radio, Tabs} from "antd";
import ETable from '../../../components/ETable';
import React from "react";

const TabPane = Tabs.TabPane;

export default class KeyMsg extends Component{
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList1();
        this.requestList2();
    }
    requestList1 = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/dailyFood/getPage',
            data:{
                params:{
                    industry:1
                }
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list1  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;})
                this.setState({
                    list1:list1,
                    pagination1:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;
                        // _this.requestList1();
                    })
                })
            }
        })
    }
    requestList2 = ()=>{
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
                let list2  = res.data.map((item,i)=>{
                    item.key = i;
                    return item;})
                this.setState({
                    list2:list2,
                    pagination2:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;
                        // _this.requestList2();
                    })
                })
            }
        })
    }

    // 查询表单
    // handleFilterSubmit = (filterParams) => {
    //     this.params = filterParams;
    //     this.requestList1();
    //     this.requestList2();
    // };


    render() {
        const columns1=[
            {
                title: '本年度检查次数',
                dataIndex: 'checkCount'
            }, {
                title: '巡查频次',
                dataIndex: 'checkFrequence'
            },
            {
                title: '总检查项目数',
                dataIndex: 'checkTotal'
            }
        ]
        const columns2 = [
            {
                title: '项目',
                dataIndex: 'largeClassName'
            }, {
                title: '编号',
                dataIndex: 'seq'
            },
            {
                title: '核查内容',
                dataIndex: 'clauseName'
            },
            {
                title: '检查',
                dataIndex: 'seq',
                render: (text, item) => {
                    return <Radio.Group name="radiogroup">
                        <Radio value={1}>符合</Radio>
                        <Radio value={2}>不符</Radio>
                    </Radio.Group>
                }
            },{
                title: '备注',
                dataIndex: '  '
            },{
                title: '操作',
                dataIndex: '  '
            }

        ];

        return (
            <div>
                <Card style={{marginTop:10}}>
                    <h3>检查要点项处理</h3>
                    <div style={{marginTop:30}}>
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys1={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list1}
                            columns={columns1}
                            row_selection='checkbox'
                        />
                    </div>
                    <div style={{marginTop:30}}>
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys2={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list2}
                            columns={columns2}
                            row_selection='checkbox'
                        />
                    </div>
                </Card>
            </div>
        );
    }
}
