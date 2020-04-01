import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table} from "antd";

export default class UnitAreaForm extends Component{
    state={}
    params = {
        pageNo:1
    }
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/spotCheckBase/getPageEnterpriseTeam',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
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
    handleOperator=(item)=>{
        this.props.dispatchSupervisor(item.name,item.areaName);
        axios.ajax({
            url: '/spotCheckBase/getPageEnterpriseTeam',
            data: {
                params: {
                    unitId: item.id,
                    areaId:item.area
                }
            }
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    isVisible:false
                })
                this.requestList();
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
                title: '序号',
                dataIndex: 'id',

            },{
                title: '企业名称',
                dataIndex: 'name'
            },{
                title: '所属区域',
                dataIndex: 'areaName'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>


                }
            }
        ];
        return (
            <div>
                <Card style={{marginTop:10}}>
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={columns}
                    />
                </Card>
            </div>
        );
    }
}
