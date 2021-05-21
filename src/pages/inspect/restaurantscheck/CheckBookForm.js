import React,{Component} from 'react';
import axios from "../../../axios";
import Utils from "../../../utils";
import {Button, Card,Table} from "antd";


export default class CheckBookForm extends Component{
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
            url:'/inspect/bookConf/getPage',
            data:{
                params:{
                    ..._this.params
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i+1;
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
        this.props.dispatchBook(item);
    }

    render(){
        const columns = [
            {
                title: '序号',
                dataIndex: 'key'
            },
            {
                title: '文书类型',
                dataIndex: 'bookType',
                render(bookType){
                    return {1:'餐饮行业'}[bookType]
                }
            },
            {
                title: '文书名称',
                dataIndex: 'bookName'
            },{
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
                        bordered
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={columns}
                    />
                </Card>
            </div>
        );
    }
}
