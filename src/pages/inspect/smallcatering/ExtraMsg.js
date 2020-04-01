import {Component} from "react";
import axios from "../../../axios";
import Utils from "../../../utils";
import {Button, Card, Col, Row, Radio, Tabs} from "antd";
import ETable from '../../../components/ETable';
import React from "react";

const TabPane = Tabs.TabPane;

export default class ExtraMsg extends Component{
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
                title: '文件名',
                dataIndex: '  '
            }, {
                title: '修改日期',
                dataIndex: '  '
            },
            {
                title: '对应检查项',
                dataIndex: '  '
            },
            {
                title: '上传人',
                dataIndex: '  '
            },{
                title: '操作',
                dataIndex: '  '
            }

        ];

        return (
            <div>
                <Card style={{marginTop:10}}>
                    <h3>附件信息</h3>
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
