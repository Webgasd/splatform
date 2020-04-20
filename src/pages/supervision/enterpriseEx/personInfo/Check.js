import React,{Component} from "react";
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Modal, Table} from "antd";
import connect from "react-redux/es/connect/connect";

const ButtonGroup = Button.Group;

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
        let type=this.props.type
        axios.ajax({
            url:type=='create'?'/supervision/morningCheck/getPage':'/supervision/morningCheck/getByCaId',
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


    handleOperator = (type,item)=>{
        if(type =='create'){
            if(this.props.type=='edit'){
                this.setState({
                    title:'创建',
                    isVisible:true,
                    type
                })
            }else{
                alert("此处不允许该项操作,添加内容请点击编辑！")
                return;
            }
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'编辑':'查看详情',
                isVisible:true,
                checkInfo:item,
                type
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/supervision/morningCheck/delete',
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
        let data = this.checkForm.props.form.getFieldsValue();//获取表单的值
        data.morningcheckTime=Utils.formatDate(data.morningcheckTime);
        if(type=='create'){
            data.caId=this.props.input.id;
        }
        axios.ajax({
            url:type=='create'?'/supervision/morningCheck/insert':'/supervision/morningCheck/update',
            data:{
                params:{
                    ...data,
                }
            }
        }).then((res)=>{
            if(res){
                this.checkForm.props.form.resetFields();//表单重置
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
                title: '日期',
                dataIndex: 'morningcheckTime',
                render: Utils.formatDate

            }, {
                title: '晨检记录',
                dataIndex: 'morningcheckContent'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <ButtonGroup>
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('detail',record)}}>查询</Button>
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('edit',record)}}>编辑</Button>
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('delete',record)}}>删除</Button>
                    </ButtonGroup>


                }
            }
        ];


        return (
            <div>
                <div style={{marginTop:10}}>
                    <Button  type="primary" onClick={()=> {this.handleOperator('create',null)}} style={{marginBottom:5}}>添加</Button>
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