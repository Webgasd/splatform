import React,{Component} from 'react';
import axios from "../../../../axios";
import {Button, Card, Table} from "antd";

export default class BookCheckForm extends Component{
    state={}

    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        axios.ajax({
            url:'/inspect/dailyBook/getCheckBookNameList',
            data:{
                params:{
                    dailyFoodId:this.props.dailyFoodId,
                    typeUrl:this.props.typeUrl
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                })
            }
        })
    }

    handleOperator=(item)=>{
        this.props.dispatchCheck(item);
    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render(){
        const columns = [
            {
                title: '文书编号',
                dataIndex: 'name',

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
                <Card style={{marginTop:10}}>
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={false}
                        columns={columns}
                    />
                </Card>
            </div>
        );
    }
}

