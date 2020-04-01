import React from 'react'
import {Card,Button,Collapse,Modal,Row,Col,Input,Popconfirm,Select} from 'antd'
import ETable from '../../../../components/ETable';
import  BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from '../../../../axios'

const {Option} = Select
const Panel = Collapse.Panel

class EquipmentTypeTwo extends React.Component{
    constructor(props){
        super(props)
        this.state={
            list:[],
            inputValue:"",
            how:"add",
            selectedRowKeys:[],
            selectedIds:[],
            modalAdd:false,
            modalDelete:false,
            nowEdit:null
        }
        this.params = {
            pageNo:1
        }
    }
    componentWillMount(){
        this.requestList()
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:"/specialEquipmentType/getPageTwo",
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
        axios.ajax({
            url:"/specialEquipmentType/insertTwo",
            data:{
                params:{
                    parentName:this.state.parentName,
                    name:this.state.inputValue
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
            url:"/specialEquipmentType/deleteTwo",
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
    handleClickEdit(parentName,name,id){
        this.setState({
            how:"edit",
            modalAdd:true,
            parentName:parentName,
            inputValue:name,
            nowEdit:id
        })
    }
    handleEdit=()=>{
        const {nowEdit,parentName,inputValue} = this.state
        axios.ajax({
            url:"/specialEquipmentType/updateTwo",
            data:{
                params:{
                    parentName,
                    name:inputValue,
                    id:nowEdit
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
            inputValue:""
        })
    }
    handleChangeInputValue=(v)=>{
        this.setState({
            inputValue:v
        })
    }
    handleSelectQuestionOne=(value)=>{
        this.setState({
            parentName:value
        })
    }
    render(){
        const formList = [
            {
                type: 'INPUT',
                label: "设备类别",
                field: 'name'
            }
        ]
        const {how} = this.state
        const columns = [
            {
                title:"设备种类",
                dataIndex:'parentName'
            },
            {
                title:"设备类别",
                dataIndex:'name'
            },
            {
                title:'操作',
                width:400,
                render:(text,record,index)=>{
                    return (
                        <div>
                            <Button
                                onClick={()=>this.handleClickEdit(record.parentName,record.name,record.id)}
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
                    title={(how==="edit"?"编辑":"添加")+"设备类别"}
                    visible={this.state.modalAdd}
                    onOk={how==="edit"?(this.handleEdit):(this.handleOk)}
                    okText={how==="edit"?"修改":"添加"}
                    cancelText="取消"
                    destroyOnClose={true}
                    onCancel={this.handleCancel}
                >
                    <EquipmentTypeOne
                        parentName={this.state.parentName}
                        inputValue={this.state.inputValue}
                        handleSelectQuestionOne={this.handleSelectQuestionOne}
                        handleChangeInputValue={this.handleChangeInputValue} />
                </Modal>
            </div>
        )
    }
}
export default EquipmentTypeTwo

class EquipmentTypeOne extends React.Component{
    state={
        parent:[]
    }
    componentDidMount(){
        axios.ajax({
            url:"/specialEquipmentType/getPageOne",
            data:{
                params:{

                }
            }
        }).then((res)=>{
            this.setState({
                parent:res.data.data
            })
        })
    }
    render(){
        return(
            <div>
                <Row>
                    <Col span={6}>
                        设备种类
                    </Col>
                    <Col span={18}>
                        <Select
                            value={this.props.parentName}
                            onChange={(value)=>this.props.handleSelectQuestionOne(value)}
                            style={{width:"100%"}}>
                            {this.state.parent.map((item,index)=>{
                                return(
                                    <Option value={item.name}>
                                        {item.name}
                                    </Option>
                                )
                            })}
                        </Select>
                    </Col>
                </Row>
                <Row type="flex" align="middle" style={{marginTop:10}}>
                    <Col span={6}>设备类别</Col>
                    <Col span={18}>
                        <Input onChange={(e)=>this.props.handleChangeInputValue(e.target.value)} value={this.props.inputValue}/>
                    </Col>
                </Row>
            </div>

        )
    }
}