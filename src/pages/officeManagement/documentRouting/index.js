import React, { Component } from 'react'
import {Button,Card,Collapse,Modal,Tag} from 'antd'
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import {connect} from "react-redux";
import AddForm from './AddForm'
import RecordsFRorm from './RecordsFRorm'
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
class DocumentRouting extends Component {
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
        this.requestUnit()
        this.requestImportance()
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
    //查询
    handleFilterSubmit = (params) => {
        this.params = params
        console.log(this.params)
        this.requestListByCondition()
    }
    //按条件获取数据
    requestListByCondition = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/documentCirculate/getPage',
            data:{
                params:{..._this.params,"situation":2,module:1}
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
    //获取表格数据
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/documentCirculate/getPage',
            data:{
                params:{..._this.params,"situation":2,"module":1,}
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
     //获取重要性
     requestImportance = ()=>{
        let _this = this;
        axios.ajax({
            url:'/documentTypeConfig/getByType',
            data:{
                params:{"type":2}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let Importance = res.data||[]
                console.log("重要性",Importance)
                let list = Importance.map((item,key)=>{
                    item.id = item.id
                    item.name = item.className
                    return item
                })
                _this.setState({
                    Importance:list
                })
            }
        })
    }
    //获取来文单位
    requestUnit = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/documentSourceunit/getPage',
            data:{
                params:{..._this.params,"isPage":1}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let units = res.data.data||[]
                console.log("来文单位",units)
                let list = units.map((item,key)=>{
                    item.id = item.id
                    item.name = item.name
                    return item
                })
                _this.setState({
                    units:list
                })
            }
        })
    }
    //获取详细信息
    requestDetailById = (id)=>{
        let _this = this;
        axios.PostAjax({
            url:'/documentCirculate/getById',
            data:{
                params:{..._this.params,docId:id,module:2}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let item = res.data||[]
                _this.setState({
                    informData:item
                })
                // console.log("详细",this.state.detailItem)
            }
        })
    }
    //查看 修改 删除数据   拟态框
    handleOperator = (type,item) => {
        console.log("item",item)
        let _this = this
        if(type == 'create'){
            _this.getMessage()
            _this.setState({
                title:'添加公文',
                isVisible:true,
                informData:{author:"redux获取",date:this.state.informData.date},
                status:false,
                type
            })
        }
        else if(type == 'modify'||type == 'detail'||type == 'check'){
            if(type == 'modify'){
                _this.requestDetailById(item.id)
                _this.setState({
                    title:item.title,
                    isVisible:true,
                    status:false,
                    type
                })
            }
            else if(type == 'check'){
                _this.requestDetailById(item.id)
                _this.setState({
                    title:"公文流转拟办",
                    status:true, //拟办不需要右下角的按钮
                    isVisible:true,
                    type
                })
                console.log("informData",this.state.informData)
            }
            else if(type == 'detail'){
                _this.requestDetailById(item.id)
                _this.setState({
                    title:"公文流转查看",
                    status:true, //查看不需要右下角的按钮
                    isVisible:true,
                    type
                })
                console.log("informData",this.state.informData)
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
        //表格列名
        const columns = [
            {
                title:'公文流转号',
                dataIndex:'docNumber',
                key:'docNumber'
            },
            {
                title:'重要性',
                dataIndex:'type',
                key:'type', //修改
                render:(type)=>{
                    let color = 'blue'
                    let content = '一般'
                    if(type === '紧急'){
                        color = 'red'
                        content = '紧急'
                    }else if(type === '重要'){
                        color = 'purple'
                        content = '重要'
                    }
                    return <Tag color={color} key={type}>
                        {content.toUpperCase()}
                    </Tag>
                }
            },
            {
                title:'公文流转标题',
                dataIndex:'title',
                key:'title'
            },
            {
                title:'来文单位',
                dataIndex:'sourcedocCompany',
                key:'sourcedocCompany'
            },
            {
                title:'收文人',
                dataIndex:'author',
                key:'author'
            },
             {
                title:'收文日期',
                dataIndex:'issueDate',
                key:'issueDate'
            },
            {
                title:'拟办人',
                dataIndex:'reviewer',
                key:'reviewer'
            },
            {
                title:'拟办状态',
                dataIndex:'reviewResult',
                key:'reviewResult',
                render:(reviewResult)=>{
                    let review = '待审核'
                    let color ='blue'
                    if(reviewResult == 0){
                        review = '待审核'
                    }
                    else if(reviewResult == 1){
                        review = '通过/已发布'
                        color ='green'
                    }
                    else if(reviewResult == 2){
                        review = '不通过/退回'
                        color ='red'
                    }
                    return <Tag color={color} key={reviewResult}>
                     {review.toUpperCase()} 
                    </Tag>
                }
            },
            {
                title:'操作',
                dataIndex:'operation',
                width:'400px',
                render:(text,record) => {
                        //0代表未审核 1代表通过 2代表不通过    未审核和不通过都可以修改                  
                        const reviewStatus = record.reviewResult == 0||2?'':'none'
                    return <ButtonGroup>
                        <Button type='primary' size='small' onClick={()=> {this.handleOperator('detail',record)}} >查看</Button>
                        {/* <Button type='primary' size='small' onClick={()=> {this.handleOperator('detail',record)}} >查阅记录</Button> */}
                        {/* <Button type='primary' size='small' onClick={()=> {this.handleOperator('check',record)}} >审核处理</Button> */}
                        {/* <Button type='primary' size='small'  onClick={()=> {this.handleOperator('check',record)}} >审核情况</Button> */}
                        <Button type='primary' size='small' style={{display:reviewStatus}} onClick={()=> {this.handleOperator('modify',record)}}>修改</Button>
                        <Button type='primary' size='small' onClick={()=> {this.handleOperator('delete',record)}}>删除</Button>
                    </ButtonGroup>
                }
            },
        ]
        //查询条件
        const formList = [
            {
                type: 'SELECT',
                label: '重要性',
                placeholder: '请选择重要性',
                field: 'typeId',//id
                width: 150,
                list: this.state.Importance
            },
            {
                type: 'SELECT',
                label: '来文单位',
                placeholder: '请选择来文单位',
                field: 'sourcedocCompanyId',
                width: 150,
                list: this.state.units
            },
            {
                type: 'INPUT',
                label: '公文流转标题',
                placeholder: '请输入公文流转标题',
                field: 'title',
                width: 150,
            },
            {
                type: 'DATE',
                label: '收文日期',
                field: 'endDate',
            },
            {
                type: 'INPUT',
                label: '来文文号',
                placeholder: '请输入来文文号',
                field: 'sourcedocNumber',
                width: 150,
            },
            {
                type: 'INPUT',
                label: '公文流转号',
                placeholder: '请输入公文流转号',
                field: 'docNumber',
                width: 150,
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
                        <Button type="primary" onClick={()=>this.handleDelete}>批量删除</Button>
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
                    title={this.state.title}
                    visible={this.state.isVisible}
                    footer = {
                        this.state.status
                        ?true:[
                        <Button type='primary' key='toPublic' onClick={e=>this.handleSubmit(1)}>保存直接发布</Button>,
                        <Button type='primary' key='toPerson' onClick={e=>this.handleSubmit(2)}>转发给拟办人</Button>
                        ]
                }
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
                        importance = {this.state.Importance}
                     />
                </Modal>
                <Modal
                    width='1000px'
                    title='查阅记录'
                    visible={this.state.isListVisible}
                    onOk={()=>this.setState({isList1Visible:false})}
                    destroyOnClose={true}
                    onCancel={()=>
                        this.setState({
                            isList1Visible:false,
                            informData:{}
                        })
                    }
                >
                   <RecordsFRorm/>
                </Modal>
                
            </div>
        )
    }
} 
export default DocumentRouting;
