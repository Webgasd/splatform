import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table} from "antd";
import  BaseForm  from './../../../../components/BaseForm';

const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '被检单位',
        field: 'name'
    }
]
export default class TypeForm extends Component{
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
            url:this.props.searchType=='foodType'?'/spotCheckFoodType/getPage':(this.props.searchType=='dateType'?'/spotCheckDateType/getPage':(this.props.searchType=='checkType'?'/spotCheckCheckType/getPage':(this.props.searchType=='team'?'/supervision/ga/getPageAllList':(this.props.searchType=='checkOrginization'?'/spotCheckEnterprise/getPageOk':(this.props.searchType=='checkStep'?'/spotCheckStepType/getPage':(this.props.searchType=='checkCompany'?'/spotCheckBase/getPageEnterpriseTeam':'/spotCheckDisposalType/getPage')))))),
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
    handleOperator=(item)=>{
        if(this.props.searchType=='team') {
            this.props.dispatchSupervisor(item.unitName);
        }else if(this.props.searchType=='checkOrginization') {
            this.props.dispatchSupervisor(item.enterpriseName);
        }else if(this.props.searchType=='checkCompany') {
            this.props.dispatchSupervisor(item.name,item.team);
            console.log(item.name,item.team)
        }else{
            this.props.dispatchSupervisor(item.type);
        }

    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render(){
        const columns = [
            {
                title: '食品类别',
                dataIndex: 'type'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                }
            }
        ];
        const columns1 = [
            {
                title: '日期类型',
                dataIndex: 'type'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                }
            }
        ];
        const columns2 = [
            {
                title: '抽检类型',
                dataIndex: 'type'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                }
            }
        ];
        const columns3 = [
            {
                title: '单位名称',
                dataIndex: 'unitName',

            },{
                title: '部门名称',
                dataIndex: 'department'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                }
            }
        ];
        const columns4 = [
            {
                title: '检测机构全称',
                dataIndex: 'enterpriseName'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                }
            }
        ];
        const columns5 = [
            {
                title: '被抽检单位',
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
                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                }
            }
        ];
        const columns6 = [
            {
                title: '处置措施',
                dataIndex: 'type'
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
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={this.props.searchType=='foodType'?columns:(this.props.searchType=='dateType'?columns1:(this.props.searchType=='checkType'?columns2:(this.props.searchType=='team'?columns3:(this.props.searchType=='checkOrginization'?columns4:(this.props.searchType=='checkCompany'?columns5:columns6)))))}
                    />
                </Card>
            </div>
        );
    }
}
