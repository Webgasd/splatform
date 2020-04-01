import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table} from "antd";
import BaseForm from "../../../../components/BaseForm";
const Panel = Collapse.Panel;

export default class LllegalityForm extends Component{
    state={}
    params = {
        pageNo:1,
    }
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
        this.requestIndustry();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/legal/getPage',
            data:{
                params:this.params
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
    requestIndustry=()=>{
        axios.noLoadingAjax({
            url:'/inspect/lllegality/getList'
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    legalList:res.data,
                })
            }
        })
    }

    handleOperator=(item)=>{
        this.props.dispatchLegal(item);
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
                title: '违法类型',
                dataIndex: 'typeId',
                render(typeId){
                    let data = (_this.state.legalList||[]).find((item)=>item.id==typeId)||{};
                    return data.name;
                }

            }, {
                title: '违法行为',
                dataIndex: 'activities'
            }, {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>


                }
            }
        ];
        const formList = [
            {
                type: 'SELECT',
                label: '违法类型',
                field: 'typeId',
                width: 150,
                list: (this.state.legalList||[]).map((item)=>{return {id: item.id, name:item.name}})
            },
            {
                type: 'INPUT',
                label: '违法行为',
                field: 'activities',
            },
        ]
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

