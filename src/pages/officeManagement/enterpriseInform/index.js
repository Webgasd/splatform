import React, { Component } from 'react'
import {Button,Card,Collapse,Modal,Tag} from 'antd'
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import {connect} from "react-redux";
import AddForm from './AddForm'
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import { green } from 'chalk';
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm


@connect(
    state=>({
        acl:state.acls['/laws'],
        userInfo:state
    }),{
    }
)
class EnterpriseInform extends Component {
    state = {
        informData:{},
        selectedRowKeys: [], //表格选择的条目记录
        list:[     //获取的数据列表
            {
                data:'1',
                key:1
            }
        ],
        title:''  //拟态框标题
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList()
        this.requestType()
    }
    //发布人和发布日期信息
    getMessage = () => {
        let today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let informData = this.state.informData
        informData.date = date
        this.setState({
            informData:informData
        })
    }
    //按条件获取数据
    requestListByCondition = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/enterpriseNotice/getByCondition',
            data:{
                params:{..._this.params}
            }
        }).then((res)=>{
            if(res.status == "success"){
                if(res.data!==null){
                    let list  = res.data.data.map((item,i)=>{
                        item.key = i;
                        return item;
                    })
                    _this.setState({
                        list:list,
                        pagination:Utils.pagination(res,(current)=>{
                            _this.params.pageNo = current;//当前页数
                            _this.requestListByCondition(); //刷新列表数据
                        })
                    })
                }else{
                    res.data = {"total":0,"data":[],"pageNo": 1,"pageSize": 10}
                    _this.setState({
                        list:[],
                        pagination:Utils.pagination(res,(current)=>{
                            _this.params.pageNo = current;//	当前页数
                            _this.requestListByCondition(); //刷新列表数据
                        })
                    })
                }
                
            }
        })
    }
    //查询
    handleFilterSubmit = (params) => {
        this.params = params
        this.params.startDate = this.params.starttime
        this.params.endDate = this.params.endtime
        this.requestListByCondition()
    }
    //获取表格数据
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/enterpriseNotice/getIssusedOrMy',
            data:{
                params:{..._this.params}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                _this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }

    //获取企业通知类型
    requestType = ()=>{
        let _this = this;
        axios.ajax({
            url:'/enterpriseNotice/getAllClass',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let enterpriseNotice = res.data||[]
                let list = enterpriseNotice.map((item,key)=>{
                    item.id = item.id
                    item.name = item.type
                    return item
                })
                _this.setState({
                    enterpriseNotice:list
                })
            }
        })
    }
    //查看 修改 删除数据   拟态框
    handleOperator = (type,item) => {
        let _this = this
        if(type == 'create'){
            this.getMessage()
            this.setState({
                title:'通知公告',
                isVisible:true,
                type
            })
        }
        else if(type == 'modify'||type == 'detail'){
            if(type == 'modify'){
                let content = item.content
                item.content = BraftEditor.createEditorState(content)
                _this.setState({
                    title:item.title,
                    isVisible:true,
                    informData:item,
                    type
                })
            }
            else if(type == 'detail'){
                let content = item.content
                item.content = BraftEditor.createEditorState(content)
                _this.setState({
                    title:item.title,
                    isVisible:true,
                    informData:item,
                    type
                })
            }
        }
        else if(type == 'delete'){
           confirm({
               title:'确定删除?',
               okText:'是',
               okType:'danger',
               cancelText:'否',
               onOk:() => {
                   axios.ajax({
                       url:'/enterpriseNotice/delete',
                       data:{
                           params:{
                               id:item.id
                           }
                       }
                   }).then((res)=>{
                       if(res.status == "success"){
                           _this.requestList();
                       }
                   })
               }
           })
        }
        else if(type == 'deletes'){
            let idList = _this.state.selectedRowKeys
            if(idList.length==0){
                confirm({
                    title:'至少选择一条数据',
                    okText:'确定',
                    okType:'primary',
                    onOk:()=>{

                    }
                })
            }else{
                confirm({
                    title:'确定删除?',
                    okText:'是',
                    okType:'danger',
                    cancelText:'否',
                    onOk:() => {
                        axios.PostAjax({
                            url:'/enterpriseNotice/deleteMultiple',
                            data:{
                                params:{
                                 idList:idList
                                }
                            }
                        }).then((res)=>{
                            if(res.status == "success"){
                                _this.requestList();
                            }
                        })
                    }
                })
            }
         }
        // else if(type == 'detail'){
        //     axios.ajax({
        //         url:'',
        //         data:{
        //             params:{
                        
        //             }
        //         }
        //     }).then((res)=>{
        //         if(res.status == 'success'){
        //             let informData = res.data;
        //             informData.content = BraftEditor.createEditorState(informData.content)
        //             _this.setState({
        //                 title:item.title,
        //                 isVisible:true,
        //                 informData,
        //                 type
        //             })
        //         }
        //     })
        // }
    }
    //提交新增 更改
    handleSubmit = (key) => {
        let data = this.state.informData
        let content = data.content||BraftEditor.createEditorState(null)
        data.fileList = this.state.fileList
        data.content=content.toHTML()
        if(key == 1){
            data.reviewResult = 1
            this.setState({
                informData:data
            })
            this.handleOk()
        }
        else {
            data.reviewResult = 2
            this.setState({
                informData:data
            })
            this.handleOk()
        }
    }
    handleOk = () =>{
        let _this = this
        axios.PostAjax({
                    url:this.state.type=='create'?'/enterpriseNotice/insert':'/enterpriseNotice/update',
                    data:{
                        params:this.state.informData
                    }
                }).then((res)=>{
                    if(res.status == 'success'){
                        _this.setState({
                            isVisible:false,
                            informData:{},
                        })
                        this.requestList()
                    }
                })
    }
    render() {
        console.log(this.props.userInfo)
        const columns = [
            {
                title:'企业通知类型',
                dataIndex:'type',
                key:'type'
            },
            {
                title:'通知公告标题',
                dataIndex:'title',
                key:'title'
            },
            {
                title:'发布人',
                dataIndex:'author',
                key:'author'
            },
            {
                title:'发布日期',
                dataIndex:'issueDate',
                key:'issueDate'
            },
            {
                title:'核验人',
                dataIndex:'reviewer',
                key:'reviewer'
            },
             {
                title:'核验日期',
                dataIndex:'reviewTime',
                key:'reviewTime'
            },
            {
                title:'发布状态',
                dataIndex:'reviewResult',
                key:'reviewResult',
                render:(reviewResult)=>{
                    if(reviewResult == 1){
                        let review = '已发布'
                        return <Tag color='green' key={reviewResult}>
                            {review.toUpperCase()}
                        </Tag>
                    }
                    else if(reviewResult == 2){
                        let review = '待处理'
                        return <Tag color='blue' key={reviewResult}>
                            {review.toUpperCase()}
                        </Tag>
                    }
                    else if(reviewResult == 3){
                        let review = '退回'
                        return <Tag color='red' key={reviewResult}>
                            {review.toUpperCase()}
                        </Tag>
                    }
                }
            },
            {
                title:'操作',
                dataIndex:'operation',
                width:'500px',
                render:(text,record) => {                  
                        const reviewStatus = record.reviewResult == 1?'none':''
                        const obReviewStatus = record.reviewResult == 1?'':'none'
                    return <ButtonGroup>
                        <Button type='primary'  onClick={()=> {this.handleOperator('detail',record)}} >查看</Button>
                        {this.props.acl.indexOf('/modify')>-1? <Button type='primary' style={{display:reviewStatus}} onClick={()=> {this.handleOperator('modify',record)}}>修改</Button>:null}
                        {/* <Button type='primary' style={{display:obReviewStatus}} onClick={()=>{this.handleOperator('issueCancel',record)}}>取消发布</Button> */}
                        {this.props.acl.indexOf('/delete')>-1? <Button type='primary' onClick={()=> {this.handleOperator('delete',record)}}>删除</Button>:null}
                    </ButtonGroup>
                }
            },
        ]
        const formList = [
            {
                type: 'SELECT',
                label: '企业通知类型',
                placeholder: '请选择通知类型',
                field: 'type',
                width: 150,
                list: this.state.enterpriseNotice||[]
            },
            {
                type: 'INPUT',
                label: '通知公告标题',
                placeholder: '请输入查询关键词',
                field: 'title',
                width: 150,
            },
            {
                type: 'INPUT',
                label: '发布人',
                placeholder: '请输入查询关键词',
                field: 'authorName',
                width: 150,
            },
            {
                type: 'INPUT',
                label: '核验人',
                placeholder: '请输入查询关键词',
                field: 'reviewer_name',
                width: 150,
            },
            {
                type: 'TIME',
                label: '发布日期',
                field: 'time',
            }
        ];
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
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> this.handleOperator('create',null)}>数据新增</Button>
                        <Button type="danger" onClick={()=>this.handleOperator('deletes',null)}>批量删除</Button>
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
                            row_selection = 'checkbox'
                        />
                    </div>
                </Card>
                <Modal
                    width='1000px'
                    title='通知公告'
                    visible={this.state.isVisible}
                    footer = {this.state.type=='detail'?'':[
                        <Button type='primary' key='toPublic' onClick={e=>this.handleSubmit(1)}>保存直接发布</Button>,
                        <Button type='primary' key='toPerson' onClick={e=>this.handleSubmit(2)}>转发给核验人</Button>
                    ]}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            informData:{},
                        })
                    }}
                >
                    <AddForm
                        informData ={this.state.informData}
                        dispatchInformData = {(value) => this.setState({informData:value})}
                        status = {this.state.type}
                     />
                </Modal>
                {/* <Modal
                    width='1000px'
                    title='法律法规'
                    visible={this.state.isDetailVisible}
                    onOk={()=>this.setState({isDetailVisible:false})}
                    destroyOnClose={true}
                    onCancel={()=>
                        this.setState({
                            isDetailVisible:false,
                            informData:{}
                        })
                    }
                >
                    <DetailForm
                        informData = {this.state.informData||{}}
                    />
                </Modal> */}
            </div>
        )
    }
} 
export default EnterpriseInform;
