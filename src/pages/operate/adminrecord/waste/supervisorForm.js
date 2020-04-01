import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table} from "antd";
import BaseForm from "../../../../components/BaseForm";
const Panel = Collapse.Panel;

const formList = [
    {
        type: 'INPUT',
        label: '企业名',
        field: 'enterpriseName',
    },
    {
        type: 'INPUT',
        label: '地址',
        field: 'registeredAddress',
    },
]

export default class SupervisorForm extends Component{
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
        axios.ajax({
            url:'/formatrecovery/getPage',
            data:{
                params:{
                    ..._this.params
                }
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
   
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };
    handleOperator=(item)=>{
        this.props.dispatchSupervisor(item.recoveryEnterprise)
    }
    render(){
        
        const columns1 = [
            {
                title: '回收企业名称',
                dataIndex: 'recoveryEnterprise'
            }, 
            {
                title: '地址',
                dataIndex: 'address'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                 
                    return   <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
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
                        columns={columns1}
                    />
                </Card>
            </div>
        );
    }
}
