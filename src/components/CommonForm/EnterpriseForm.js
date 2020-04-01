import React,{Component} from 'react';
import axios from "../../axios";
import Utils from "../../utils";
import {Button, Card, Collapse, Table} from "antd";
import BaseForm from "../BaseForm";
const Panel = Collapse.Panel;

const formList = [
    {
        type: 'INPUT',
        label: '企业名',
        field: 'enterpriseName',
    },
]

export default class SubjectForm extends Component{
    state={}
    params = {
        pageNo:1,
        industryList:this.props.industryList||'',
        areaList:''
    }
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
        this.requestAllArea();
        this.requestAllDept();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/supervision/enterprise/getPage',
            data:{
                params:{...this.params,areaList:[this.params.areaList],industryList:[this.params.industryList]}
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

    requestAllArea=()=>{
        axios.noLoadingAjax({
            url:'/sys/area/getAll',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    areaAllList: res.data
                })
            }
        })
    }
    requestAllDept=()=>{
        axios.noLoadingAjax({
            url:'/sys/dept/getAll',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    deptAllList: res.data
                })
            }
        })
    }

    handleOperator=(item)=>{
        axios.ajax({
            url: '/supervision/enterprise/getById',
            data:{
                params:{id:item.id}
            }
        }).then((res)=>{
            if(res.status=="success"){
                this.props.dispatchEnterprise(res.data);
            }
        })
    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.params.industryList=this.props.industryList||'';
        this.params.areaList='';
        this.requestList();
    };

    render(){
        let _this =this;
        const columns = [
            {
                title: '所在区域',
                dataIndex: 'area',
                render(area){
                    let data=(_this.state.areaAllList||[]).find((item)=>item.id==area)||{};
                    return data.name;
                }

            },
            {
                title: '企业名',
                dataIndex: 'enterpriseName',

            }, {
                title: '责任监管机构',
                dataIndex: 'regulators',
                render(regulators){
                    let data = (_this.state.deptAllList||[]).find((item)=>item.id==regulators)||{};
                    return data.name;
                }

            }, {
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
