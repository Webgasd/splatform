import React from 'react'
import {Card,Button,Collapse,Modal,Row,Col,Input,Popconfirm} from 'antd'
import ETable from '../../../../components/ETable';
import  BaseForm  from '../../../../components/BaseForm';
import FormDetail from './FormDetail'
import Utils from "../../../../utils";
import axios from '../../../../axios'
import connect from "react-redux/es/connect/connect";
import {commonUrl} from '../../../../axios/commonSrc'
import moment from 'moment';
const Panel = Collapse.Panel
@connect(
    state=>({
        recordPerson:state.userName
    })
)

class Record extends React.Component{
        state={
            list:[],
            action:"add",
            problemTwo:[],
            informationType:[],
            dept:[],
            selectedRowKeys:[],
            selectedIds:[],
            modalAdd:false,
            nowDealRecord:{},
            ratioMethod:1
        }
        params = {
            pageNo:1
        }
    componentDidMount(){
        this.requestList()
        const url=[
            {
                type:"problemTwo",
                url:"/complaintProblemTypeTwo/getPageList"
            },
            {
                type:"informationType",
                url:"/complaintInformationComeType/getPageList"
            },
            {
                type:"dept",
                url:"/sys/dept/getAll"
            }
        ]
    url.forEach((item,index)=>{
        axios.ajax({
            url:item.url
        }).then((res)=>{
            let arr=[];
            if(item.type==="dept"){
                (res.data.data||res.data).forEach((item2,index)=>{
                   arr.push({id:item2.name,name:item2.name})
                })
            }else{
                (res.data.data||res.data).forEach((item2,index)=>{
                    arr.push({id:item2.type,name:item2.type})
                 })
            }
           this.setState({
                [item.type]:arr
            })
        })
    })
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:"/complaintRecord/getPage",
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
    onRef = (ref) => {
        this.child = ref
    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };
    showModal(action){
        this.setState({
            action,
            modalAdd:true,
        })
    }
    handleOk=()=>{
        this.child.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
              if(values.leader){
                  values.leader=this.child.state.choosedInstructId
              }
              axios.PostAjax({
                url:"/complaintRecord/insert",
                data:{
                   params:{
                       ...values
                   }
                }
            }).then((res)=>{
                this.requestList()
                this.setState({
                    modalAdd:false,
                })
            })
            }
          });
    }
    handleDeal=()=>{
        this.child.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                console.log('Received values of form: ', values);
              if(values.leader){
                  values.leader=this.child.props.nowDealRecord.leader
              }
              axios.PostAjax({
                url:"/complaintRecord/update",
                data:{
                   params:{
                       state:this.child.props.nowDealRecord.state,
                       id:this.child.props.nowDealRecord.id,
                       ...values
                   }
                }
            }).then((res)=>{
                this.requestList()
                this.setState({
                    modalAdd:false,
                })
            })
            }
        })
    }
    handleCancel=()=>{
        this.setState({
            modalAdd:false,
            nowDealRecord:{}
        })
    }
    handleClickDownload(checkId){
        window.open(commonUrl+'/complaintRecord/pointDownload?checkId='+checkId)
    }
    showModalDelete=(id)=>{
        axios.ajax({
            url:"/complaintRecord/delete",
            data:{
               params:{
                   id
               }
            }
        }).then((res)=>{
            this.requestList()
        })
    }
    handleClickActionType(record,action){
        this.setState({
            nowDealRecord:record
        })
        this.showModal(action)
        
    }
    handleChangeRatio=(v)=>{
        this.setState({
            ratioMethod:v
        })
    }
    render(){
        const {ratioMethod} = this.state
        const formList = [
            {
                type: 'INPUT',
                label: "编号",
                field: 'number'
            },
            {
                type: 'SELECT',
                label: "问题类别",
                field: 'problemTwo',
                placeholder: '请选择',

                width: 150,
                list: this.state.problemTwo
            },
            {
                type: 'SELECT',
                label: "来源形式",
                field: 'information',
                placeholder: '请选择',
                width: 150,
                list:this.state.informationType
            },
            {
                type: 'INPUT',
                label: "投诉人",
                field: 'complaintPerson'
            },
            {
                type: 'INPUT',
                label: "被投诉单位/当事人",
                field: 'enterpriseName'
            },
            {
                type: 'TIME',
                label: "来电日期",
                field: '1'
            },
            {
                type: 'SELECT',
                label: "办理部门",
                field: 'department',
                width: 150,
                placeholder: '请选择',
                list: this.state.dept
            },
            {
                type: 'SELECT',
                label: "办理状态",
                field: 'state',
                placeholder: '请选择',
                width: 150,
                list: [{id: 1, name: '待办'},{id: 2, name: '已完成'}]
            }
        ]
        const columns = [
            {
                title:'工单编号',
                dataIndex:'order',
                width:100,
                render:(text,record,index)=>{
                    return record.record
                }
            },
            {
                title:'紧急程度',
                dataIndex:'emergencyType'
            },
            {
                title:'来电类别',
                dataIndex:'incomingType'
            },
            {
                title:'信息来源',
                dataIndex:'informationType'
            },
            {
                title:'投诉人',
                dataIndex:'complaintPerson'
            },
            {
                title:'来电时间',
                dataIndex:'incomingTime',
                render:(text,record,index)=>{
                    return<div>{moment(record.incomingTime).format("YYYY-MM-DD")}</div>
                }
            },
            {
                title:'办结日期',
                dataIndex:'finishTime',
                render:(text,record,index)=>{
                    return<div>{moment(record.finishTime).format("YYYY-MM-DD")}</div>
                }
            },
            {
                title:'被投诉单位/当事人',
                dataIndex:'enterprise'
            },
            {
                title:'受理员',
                dataIndex:'recordPerson'
            },
            {
                title:'办理部门',
                dataIndex:'deptName'
            },
            {
                title:'办理状态',
                dataIndex:'state',
                render:(text,record,index)=>(
                    <div style={record.state===2?{}:{background:"yelllow"}}>
                        {
                            record.state===2?"完成":"待办"
                        }
                    </div>     
                )
            },
            {
                title:'操作',
                render:(text,record,index)=>{
                    const {state} = record
                    return (
                            <div>
                                <Button
                                    onClick={()=>this.handleClickActionType(record,"deal")}
                                    disabled={state!==1&&state!==4}
                                    size="small"
                                    type="primary">办理</Button>
                                <Button
                                    onClick={()=>this.handleClickActionType(record,"written")}
                                    disabled={state!==3}
                                    size="small"
                                    type="primary">批示</Button>
                                <Button
                                    onClick={()=>this.handleClickActionType(record,"view")}
                                    size="small"
                                    type="primary">查看</Button>
                                <Popconfirm placement="top" title={"确认删除此项吗？"} onConfirm={()=>this.showModalDelete(record.id)} okText="确定" cancelText="取消">
                                    <Button size="small" type="primary">删除</Button>
                                </Popconfirm>
                                <Button
                                    onClick={()=>this.handleClickDownload(record.id)}
                                    disabled={state!==2}
                                    size="small">
                                    下载投诉举报单
                                </Button>
                                
                            </div>
                    )
                }
            }
        ]
        return(
            <div ref="record" className="instruction-wrap">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
               <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=>this.showModal("add")}>添加</Button>
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
                    title={"添加"}
                    visible={this.state.modalAdd}
                    maskClosable={false}
                    getContainer={()=>this.refs.record}
                    footer={
                        <Button.Group>
                            <Button onClick={this.handleCancel}>取消</Button>
                            {
                                this.state.action==="view"?
                                null:
                                (this.state.action==="add"&&ratioMethod!==2?
                                    <Button onClick={this.handleOk} type="primary">添加</Button>:
                                    <Button onClick={ratioMethod===2?this.handleOk:this.handleDeal} type="primary">办结</Button>
                                )
                            }
                        </Button.Group>
                    }
                    width={900}
                    cancelText="取消"
                    destroyOnClose={true}
                    onCancel={this.handleCancel}
                >
                 <FormDetail
                     handleChangeRatio={this.handleChangeRatio}
                     action={this.state.action}
                     nowDealRecord={this.state.nowDealRecord||{}}
                     onRef={this.onRef} />
                </Modal>
            </div>
        )
    }
}

export default Record