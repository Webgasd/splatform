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
            url:this.props.personType=='recyclingenterprises'?'/formatrecovery/getPage':'/supervision/ca/getListByEnterpriseId',
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
       // console.log(  this.props.personType)
       this.props.personType=='recyclingenterprises'?
        this.props.dispatchSupervisor(item.recoveryEnterprise):
        this.props.dispatchSupervisor(item.name)
    }
    render(){
        
        const columns = [
            {
                title: '所在企业',
                dataIndex: 'companyName',

            },{
                title: '姓名',
                dataIndex: 'name'
            },
            {
                title: '电话',
                dataIndex: 'telephone',

            }, {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                 
                    return <div>
                        <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                        
                          </div>

                }
            }
        ];
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

                <Card>
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>
                </Card>
                <Card style={{marginTop:10}}>
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={this.props.personType=='recyclingenterprises'?columns1:columns}
                    />
                </Card>
            </div>
        );
    }
}
