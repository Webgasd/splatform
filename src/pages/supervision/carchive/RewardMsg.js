import React,{Component} from "react";
import axios from "../../../axios";
import {Button, Card, Modal, Table} from "antd";
import Utils from "../../../utils";
import RewardForm from "./RewardForm";
import connect from "react-redux/es/connect/connect";
const ButtonGroup = Button.Group;

@connect(
    state=>({
        input:state.input
    })
)
class RewardMsg extends Component{
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
            url:'/supervision/rewards/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;
                        _this.requestList();
                    })
                })
            }
        })
    }
    handleOperator = (type,item)=>{
        if(type =='create'){
            if(JSON.stringify(this.props.input) !=='{}'){
                this.setState({
                    title:'创建员工',
                    isVisible:true,
                    type
                })
            }else{
                alert("无企业信息")
                return;
            }
        }else if(type=="edit" || type=='detail'){

            this.setState({
                title:type=='edit'?'编辑用户':'查看详情',
                isVisible:true,
                rewardInfo:item,
                type
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/supervision/rewards/delete',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                            this.setState({
                                isVisible:false
                            })
                            this.requestList();
                        }
                    })
                }
            })
        }
    }
    handleSubmit = ()=>{
        let type = this.state.type;
        let data = this.rewardForm.props.form.getFieldsValue();//获取表单的值
        if(type=='create'){
            data.parentId=this.props.input.id;
        }
        axios.ajax({
            url:type=='create'?'/supervision/rewards/insert':'/supervision/rewards/update',
            data:{
                params:{
                    ...data,
                }
            }
        }).then((res)=>{
            if(res){
                this.rewardForm.props.form.resetFields();//表单重置
                this.setState({
                    isVisible:false,
                })
                this.requestList();
            }
        })
    }

    render() {
        const columns = [
            {
                title: '项目',
                dataIndex: 'name'
            }, {
                title: '内容',
                dataIndex: 'content'
            },
            {
                title: '记录人员',
                dataIndex: 'operator'
            },
            {
                title: '记录时间',
                dataIndex: 'operateTime',
                render:Utils.formatDateNoTime
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <ButtonGroup >
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('detail',record)}}>查询</Button>
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('edit',record)}}>修改</Button>
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('delete',record)}}>删除</Button>
                         </ButtonGroup>
                }}
        ];

        return (
            <div>
                <div style={{marginTop:10}}>
                    <Button  type="primary" onClick={()=> {this.handleOperator('create',null)}} style={{marginBottom:5}}>添加</Button>
                    <Table
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={columns}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    destroyOnClose
                    width={400}
                    onCancel={()=>{
                        this.rewardForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            rewardInfo:{}
                        })
                    }}
                >
                    <RewardForm rewardInfo={this.state.rewardInfo||{}} wrappedComponentRef={(inst) => this.rewardForm = inst }/>
                </Modal>
            </div>

        );
    }
}
export default RewardMsg;