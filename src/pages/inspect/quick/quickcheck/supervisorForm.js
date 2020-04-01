import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table} from "antd";



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
        axios.PostAjax({
            url:this.props.personType=='checkResult'?'/quickSpotCheckResultType/getPage':(this.props.personType=='checkCompany'?'/spotCheckBase/getPageEnterpriseTeam':'/quickCheckProductType/getPage'),
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
        this.props.personType=='checkCompany'?
        this.props.dispatchSupervisor(item.name,item.team):
        this.props.dispatchSupervisor(item.type)
    }
    render(){
        
        const columns = [
            {
                title: '类型',
                dataIndex: 'type',

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
                title: '单位名称',
                dataIndex: 'name'
            }, 
            {
                title: '所属所队',
                dataIndex: 'team'
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
                        columns={this.props.personType=='checkCompany'?columns1:columns}
                    />
                </Card>
            </div>
        );
    }
}
