import React from 'react'
import {Card,Button,Collapse,Modal,Row,Col,Input,Popconfirm} from 'antd'
import ETable from '../../../components/ETable';
import  BaseForm  from '../../../components/BaseForm';
import Utils from "../../../utils";
import axios from '../../../axios'
const Panel = Collapse.Panel

class Common extends React.Component{
        state={
            list:[],
            inputValue:"",
            how:"add",
            selectedRowKeys:[],
            selectedIds:[],
            modalAdd:false,
            modalDelete:false,
            nowEdit:null,
            errMsg:""
        }
        params = {
            pageNo:1
        }
    componentDidMount(){
        this.requestList()
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:this.props.getPage,
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status === "success"){
                let list  = res.data.data.map((item,i)=>{
                    // let list  = res.result.item_list.map((item,i)=>{
                    item.key=i;
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

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };
    showModal(which,how){
        this.setState({
            how,
            [which]:true,
            
        })
    }
    handleOk=()=>{
        const {inputValue} = this.state
        if(inputValue===""){
            this.setState({
                errMsg:"不能为空"
            })
            return
        }
        axios.ajax({
            url:this.props.insert,
            data:{
               params:{
                   type:this.state.inputValue
               }
            }
        }).then((res)=>{
            this.requestList()
            this.setState({
                modalAdd:false,
                inputValue:""
            })
        })
    }
    showModalDelete=(id)=>{
                axios.ajax({
                    url:this.props.delete,
                    data:{
                       params:{
                           id
                       }
                    }
                }).then((res)=>{
                    this.requestList()
                    this.setState({
                        modalAdd:false,
                    })
                })
    }
    handleClickEdit(type,id){
        this.setState({
            how:"edit",
            modalAdd:true,
            inputValue:type,
            nowEdit:id
        })
    }
    handleEdit=()=>{
        const {nowEdit,inputValue} = this.state
        if(inputValue===""){
            this.setState({
                errMsg:"不能为空"
            })
            return
        }
        axios.ajax({
            url:this.props.update,
            data:{
               params:{
                   id:nowEdit,
                   type:inputValue
               } 
            }
        }).then((res)=>{
            this.requestList()
            this.setState({
                modalAdd:false,
                inputValue:""
            })
        })
    }
    handleCancel=()=>{
        this.setState({
            modalAdd:false,
            inputValue:"",
            errMsg:""
        })
    }
    handleChangeInputValue(v){
        this.setState({
            inputValue:v,
            errMsg:""
        })
    }
    render(){
        const {func} = this.props
        const {errMsg} = this.state
        const formList = [
            {
                type: 'INPUT',
                label: func,
                field: 'filter'
            }
        ]
        const {how} = this.state
        const columns = [
            {
                title:'序号',
                dataIndex:'order',
                width:100,
                render:(text,record,index)=>{
                    return index+1
                }
            },
            {
                title:func,
                dataIndex:'type'
            },
            {
                title:'操作',
                width:400,
                render:(text,record,index)=>{
                    return (
                            <div>

                                <Button 
                                    onClick={()=>this.handleClickEdit(record.type,record.id)}
                                    type="primary">更改</Button>
                                <Popconfirm placement="top" title={"确认删除此项吗？"} onConfirm={()=>this.showModalDelete(record.id)} okText="确定" cancelText="取消">
                                    <Button type="primary">删除</Button>
                                </Popconfirm> 
                            </div>    
                    )
                }
            }
        ]
        return(
            <div>
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
               <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=>this.showModal("modalAdd","add")}>添加</Button>
                    </div>
                    <div style={{marginTop:30}}>
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                            columns={columns}
                            row_selection='checkbox'
                        />
                    </div>
                </Card>
                <Modal
                    title={(how==="edit"?"编辑":"添加")+func}
                    visible={this.state.modalAdd}
                    onOk={how==="edit"?(this.handleEdit):(this.handleOk)}
                    okText={how==="edit"?"编辑":"添加"}
                    cancelText="取消"
                    destroyOnClose={true}
                    onCancel={this.handleCancel}
                >
                 <Row type="flex" align="middle">
                     <Col span={4}>{func}</Col>
                     <Col span={20}>
                        <Input onChange={(e)=>this.handleChangeInputValue(e.target.value)} value={this.state.inputValue}/>
                     </Col>
                 </Row>
                 <Row>
                    <Col span={4}></Col>
                     <Col span={20} style={{color:"red"}}>
                       {errMsg}
                     </Col>
                 </Row>
                </Modal>
            </div>
        )
    }
}

export default Common