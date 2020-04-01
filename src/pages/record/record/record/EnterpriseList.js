import React from 'react'
import axios from '../../../../axios'
import {Card,Button,Collapse,Modal,Row,Col,Input,Popconfirm} from 'antd'
import  BaseForm  from '../../../../components/BaseForm';
import ETable from '../../../../components/ETable';
import Utils from "../../../../utils";
const Panel = Collapse.Panel
const formList = [
    {
        type: 'INPUT',
        label: "企业名称",
        field: 'enterpriseName'
    },
    {
        type: 'INPUT',
        label: "所在区域",
        field: 'areaName',
    },
    {
        type: 'INPUT',
        label: "事件地址",
        field: 'address',
    }
]


class EnterpriseList extends React.Component{
    state={
        list:[]
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList()
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:"/complaintRecord/getPageEnterprise",
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status === "success"){
                let list  = res.data.data.map((item,i)=>{
                    // let list  = res.result.item_list.map((item,i)=>{
                    item.key=i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
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

    render(){
        const columns = [
            {
                title:'企业名称',
                dataIndex:'enterpriseName',
            },
            {
                title:'所在区域',
                dataIndex:'areaName'
            },
            {
                title:'事件地址',
                dataIndex:'businessAddress'
            },
            {
                title:'操作',
                render:(text,record,index)=>(
                    <Button
                        onClick={()=>this.props.handleChoose(record)} 
                        size="small"
                        type="primary">选择</Button>
                )
            }
        ]
        return(
            <div>
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
               <Card>
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
                </Card>
            </div>
        )
    }
}

export default EnterpriseList