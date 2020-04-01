import React,{Component} from 'react';
import axios from "../../axios";
import Utils from "../../utils";
import {Button, Card, Collapse, Table} from "antd";
import BaseForm from "../BaseForm";
const Panel = Collapse.Panel;

const formList = [
    {
        type: 'INPUT',
        label: '姓名',
        field: 'name',
    },
]

export default class SubjectForm extends Component{
    state={dutiesList:[],deptList:[]}
    params = {
        pageNo:1,
        department:this.props.deptId||'',
        gridId:null
    }
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
        this.requestDuties();
        this.requestDept();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/supervision/ga/getPage',
            data:{
                params:{
                    ..._this.params,department:[this.params.department]
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
    requestDuties = ()=>{
        axios.noLoadingAjax({
            url:'/sys/duties/getList',
            //url:'/government.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    dutiesList:res.data,
                })
            }
        })
    }
    requestDept = ()=>{
        axios.noLoadingAjax({
            url:'/sys/dept/getAll',
            //url:'/government.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    deptList:res.data,
                })
            }
        })
    }
    handleOperator=(item)=>{
        item.gaUnit=this.state.dutiesList.find((data)=>data.id==item.job).name;
        item.deptName=this.state.deptList.find((data)=>data.id==item.department).name;
        this.props.dispatchPerson(item);
    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render(){
        let _this=this;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',

            },{
                title: '部门',
                dataIndex: 'department',
                render(department){
                    let data = _this.state.deptList.find((item)=>item.id==department)||{};
                    return data.name;
                }
            }, {
                title: '职务',
                dataIndex: 'job',
                render(job){
                    let data = _this.state.dutiesList.find((item)=>item.id===job)||{};
                    return data.name;
                }
            },{
                title: '人员类型',
                dataIndex: 'category',

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
                        columns={columns}
                    />
                </Card>
            </div>
        );
    }
}
