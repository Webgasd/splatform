import {Component} from "react";
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Table} from "antd";
import React from "react";
import connect from "react-redux/es/connect/connect";



@connect(
    state=>({
        input:state.employee
    })
)
class Record extends Component{
    state={
        selectedRowKeys: [],
    };
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
       
        axios.ajax({
            url:'/supervision/caTransfer/getByCaId?id='+this.props.input.id,
            data:{
                params:{...this.params,id:this.props.input.id}
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
   
    

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',

            }, {
                title: '调离时间',
                dataIndex: 'transferTime',
                render: Utils.formatDate
            },{
                title: '旧岗位',
                dataIndex: 'primaryPost',
            },
            {
                title: '新岗位',
                dataIndex: 'presentPost',
            },
            {
                title: '登记时间',
                dataIndex: 'boardingTime',
                render: Utils.formatDate
            },
         
        ];


        return (
            <div>
                <div style={{marginTop:10}}>
                    {/*使用封装好的ETable组件实现角色列表的展示*/}
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={columns}
                    />
                </div>
                
            </div>

        )
    }
}
export default Record;