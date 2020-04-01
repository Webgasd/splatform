import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Table} from "antd";

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
        axios.ajax({
            url:this.props.searchType=='foodtype'?'/spotCheckFoodType/getPage':(this.props.searchType=='datetype'?'/spotCheckDateType/getPage':(this.props.searchType=='checktype'?'/spotCheckCheckType/getPage':(this.props.searchType=='disposaltype'?'/spotCheckDisposalType/getPage':('')))),
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
        this.props.dispatchSupervisor(item.type);
        //console.log(item.type)
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
                title: '序号',
                dataIndex: 'id',

            },{
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
                title: '序号',
                dataIndex: 'id',

            },{
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
                title: '序号',
                dataIndex: 'id',

            },{
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
                <Card style={{marginTop:10}}>
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={this.props.searchType=='foodtype'?columns:(this.props.searchType=='datetype'?columns1:(this.props.searchType=='checktype'?columns2:(this.props.searchType=='disposaltype'?columns3:(''))))}
                    />
                </Card>
            </div>
        );
    }
}
