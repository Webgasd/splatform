import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table , Modal,Input} from "antd";
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
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/sign/getPage',
            data:{
                params:{...this.params,supervisorId:this.props.signGaId}
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
        this.setState({
            data:item,
            isVisible:true
        })
    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render(){
        const columns = [
            {
                title: '姓名',
                dataIndex: 'gaName',
            }, {
                title: '部门',
                dataIndex: 'deptName'
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
                type: 'INPUT',
                label: '姓名',
                field: 'gaName',
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
                <Modal
                    width='200px'
                    title="请输入密码"
                    visible={this.state.isVisible}
                    okText='确定'
                    cancelText='取消'
                    onOk={()=>{
                        if(this.state.data.password==this.state.password){
                            this.props.dispatchSign(this.state.data);
                            this.setState({
                                isVisible:false
                            })
                        }else {
                            alert("密码错误")
                        }
                    }}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                   <Input type='password' placeholder='请输入密码' value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})}/>
                </Modal>
            </div>
        );
    }
}

