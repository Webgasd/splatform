import React,{Component} from "react";
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button,  Table} from "antd";
import connect from "react-redux/es/connect/connect";



@connect(
    state=>({
        input:state.employee
    })
)
class Check extends Component{
    state={}
    params = {
        pageNo:1
    }

    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
       
        axios.ajax({
            url:'/supervision/morningCheck/getByCaId',
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
                title: '日期',
                dataIndex: 'morningcheckTime',
                render: Utils.formatDate

            }, {
                title: '晨检记录',
                dataIndex: 'morningcheckContent'
            },
           
        ];


        return (
            <div>
                <div style={{marginTop:10}}>
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
export default Check;