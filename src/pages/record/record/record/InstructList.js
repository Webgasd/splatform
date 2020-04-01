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
        label: "单位名称",
        field: 'unit'
    },
    {
        type: 'INPUT',
        label: "姓名",
        field: 'name',
    },
    {
        type: 'INPUT',
        label: "部门名称",
        field: 'dept',
    }
]


class InstructList extends React.Component{
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
            url:"/supervision/ga/getPageAllList",
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
                title:'所属单位',
                dataIndex:'unitName',
            },
            {
                title:'姓名',
                dataIndex:'name'
            },
            {
                title:'所属部门',
                dataIndex:'deptName'
            },
            {
                title:'操作',
                render:(text,record,index)=>(
                    <Button
                        onClick={()=>this.props.handleChooseInstruct(record)} 
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

export default InstructList