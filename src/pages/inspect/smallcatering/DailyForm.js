import {Component} from "react";
import axios from "../../../axios";
import Utils from "../../../utils";
import {Card} from "antd";
import ETable from '../../../components/ETable';
import React from "react";


export default class DailyForm extends Component{
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
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
                title: '动作',
                dataIndex: ' '
            }, {
                title: '操作时间',
                dataIndex: ' '
            },
            {
                title: '操作时间',
                dataIndex: ' '
            },{
                title: '操作人',
                dataIndex: ' '
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
