import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table} from "antd";
import BaseForm from "../../../../components/BaseForm";
const Panel = Collapse.Panel;

const formList = [
    {
        type: 'INPUT',
        label: '原料名称',
        field: 'materialname',
    },
    {
        type: 'INPUT',
        label: '原料类型',
        field: 'materialcategory',
    }
]

export default class MaterForm extends Component{
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
            url:'/formatoriginextra/getPage',
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
        this.props.dispatchMater(item.materialname);
        //console.log(item.materialname)
    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render(){
        const columns = [
            {
                title: '原料类型',
                dataIndex: 'materialcategory',

            },{
                title: '原料名称',
                dataIndex: 'materialname'
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
             
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>

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
