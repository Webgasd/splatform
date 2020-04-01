import React,{Component} from 'react';
import {Card} from "antd";
import ETable from './../../../../components/ETable';
import Utils from "../../../../utils";
import axios from "../../../../axios";

export default class LogForm extends Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
    }
    params = {
        //page:1
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            //url:'/supervisor/getPage                        ',
            url:'/purchaselog.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                //let list  = res.data.data.map((item,i)=>{
                let list  = res.result.item_list.map((item,i)=>{
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
    render() {
        const columns = [
            {
                title: "动作",
                dataIndex: "action"
            }, {
                title: "操作时间",
                dataIndex: "time"
            }, {
                title: "操作说明",
                dataIndex: "description"
            }, {
                title: "操作人",
                dataIndex: "operator"
            }
        ];
        return (
            <div>
                <Card>
                    <div style={{marginTop: 10}}>
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            columns={columns}
                            row_selection='checkbox'
                        />
                    </div>
                </Card>
            </div>
        );
    }
}