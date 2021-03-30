import React, { Component } from 'react'
import {Button,Card,Collapse,Modal} from 'antd'
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import {connect} from "react-redux";
import BraftEditor from 'braft-editor';
import AddForm from '../AddForm';
import DetailForm from '../DetailForm'
import { number } from 'echarts/lib/export';
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm




@connect(
    state=>({
        acl:state.acls['/laws'],
        userInfo:state.userInfo
    }),{
    }
)
class Laws extends Component {
    state = {
        lewsData:{content:''},
        selectedRowKeys: [], //表格选择的条目记录
        list:[     //获取的数据列表
            {
                data:'1',
                key:1
            }
        ],
        title:'法律法规'  //拟态框标题
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
        this.requestGetSC();
    }
    
    //查询
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams
        this.params.startDate = this.params.starttime
        this.params.endDate = this.params.endtime
        this.requestListByCondition();
    }
    //按条件获取数据
    requestListByCondition = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/lawAndDocument/getConditionalSearch',
            data:{
                params:{..._this.params,type:1}
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
                            _this.params.pageNo = current;//	当前页数
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
            url:'/lawAndDocument/getFullDatabaseSearch',
            data:{
                params:{..._this.params,type:1}
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
                            _this.params.pageNo = current;//	当前页数
                            _this.requestList(); //刷新列表数据
                        })
                    })
                }else{
                    res.data = {"total":0,"data":[],"pageNo": 1,"pageSize": 10}
                    _this.setState({
                        list:[],
                        pagination:Utils.pagination(res,(current)=>{
                            _this.params.pageNo = current;//	当前页数
                            _this.requestList(); //刷新列表数据
                        })
                    })
                }
            }
        })
    }
    //获取主题分类
    requestGetSC = ()=>{
        let level = 0
        axios.ajax({
            url:'/lawAndDocument/getBusinessType',
            data:{
                params:{
                    level,
                }
            }
        }).then((res)=>{
            if(res){
                let businessType = res.data||[]
                let list = businessType.map((item,key)=>{
                    item.id = item.className
                    item.name = item.className
                    return item
                })
                this.setState({
                    businessType:list
                })
            }
        })
    }
    //查看 修改 删除数据   拟态框
    handleOperator = (type,item) => {
        let _this = this
        if(type == 'create'){
            this.setState({
                title:'法律法规',
                isVisible:true,
                type
            })
        }
        else if(type == 'modify'||type == 'detail'){
            if(type == 'modify'){
                let lawsData = item;
                lawsData.checkPerson=lawsData.name;
                lawsData.content = BraftEditor.createEditorState(lawsData.content)
                _this.setState({
                    // title:item.title,
                    isVisible:true,
                    lewsData:lawsData,
                    type
                })
                //console.log(lawsData)
                // this.setState({
                //     title:type=='edit'?'编辑信息':'查看详情',
                //     isVisible:true,
                //     lawsData,
                //     picture:JSON.parse(lawsData.enclosure||JSON.stringify([])),
                //     type
                // })                 
            }
            else if(type == 'detail'){
                let lewsData = item
                lewsData.content = BraftEditor.createEditorState(lewsData.content)
                //  let content = BraftEditor.createEditorState(item.content)
                //  console.log("content",content)
                //  item.content = content
                _this.setState({
                    // title:item.title,
                    isDetailVisible:true,
                    lewsData:lewsData,
                    type
                })
            }
            // axios.ajax({
            //     url:'',
            //     data:{
            //         params:{
                            
            //         }
            //     }
            // }).then((res)=>{
            //     if(res.status == 'success'){
            //         let lewsData = res.data;
            //         lewsData.content = BraftEditor.createEditorState(lewsData.content)
            //         if(type == 'modify'){
            //             _this.setState({
            //                 title:item.title,
            //                 isVisible:true,
            //                 lewsData,
            //                 type
            //             })
            //         }
            //         else if(type == 'detail'){
            //             _this.setState({
            //                 title:item.title,
            //                 isDetailVisible:true,
            //                 lewsData,
            //                 type
            //             })
            //         }
            //     }
            // })
        }
        else if(type == 'delete'){
           confirm({
               title:'确定删除?',
               okText:'是',
               okType:'danger',
               cancelText:'否',
               onOk:() => {
                   axios.ajax({
                       url:'/lawAndDocument/delete',
                       data:{
                           params:{
                            id: item.id
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
    //提交新增 更改
    handleSubmit = ()=>{
        let type =this.state.type;
        let data = this.state.lewsData
        let content = data.content||BraftEditor.createEditorState(null)
        data.type = 1 //法律法规
        data.content=content.toHTML()
        console.log("data",data)
        axios.PostAjax({
            url:type=='create'?'/lawAndDocument/insert':'/lawAndDocument/update',
            data:{
                params:{
                    ...data,
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    lewsData:{}
                })
                this.requestList();
            }
        })
    }
    //批量删除
    handleDelete = ()=>{
        if(this.state.selectedRowKeys.length==0){
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
                        url:'/lawAndDocument/deleteMultiple',
                        data:{
                            params:{
                               idList: this.state.selectedRowKeys
                            }
                        }
                    }).then((res)=>{
                        if(res.status == "success"){
                            this.setState({
                                selectedRowKeys:[]
                            })
                            this.requestList();
                        }
                    })
                }
            })
        }
    }
    
    render() {
        const columns = [
            {
                title:'主题分类',
                dataIndex:'subjectClassification',
                key:'subjectClassification'
            },
            {
                title:'标题',
                dataIndex:'title',
                key:'title'
            },
            {
                title:'所属机构',
                dataIndex:'affiliatedInstitutions',
                key:'affiliatedInstitutions'
            },
            {
                title:'文号',
                dataIndex:'articleNumber',
                key:'articleNumber'
            },
            {
                title:'发布日期',
                dataIndex:'issueDate',
                key:'issueDate'
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) => {
                    return <ButtonGroup>
                        <Button type='primary'  onClick={()=> {this.handleOperator('detail',record)}} >查看</Button>
                        {this.props.acl.indexOf('/modify')>-1? <Button type='primary' onClick={()=> {this.handleOperator('modify',record)}}>修改</Button>:null}
                        {this.props.acl.indexOf('/delete')>-1? <Button type='primary' onClick={()=> {this.handleOperator('delete',record)}}>删除</Button>:null}
                    </ButtonGroup>
                }
            },
        ]
        //查询框
        const formList = [
            {
                type: 'SELECT',
                label: '主题分类',
                placeholder: '请选择文库种类',
                field: 'subjectClassification',
                width: 150,
                list: this.state.businessType||[]
            },
            {
                type: 'INPUT',
                label: '标题',
                placeholder: '请输入查询关键词',
                field: 'title',
                width: 150,
            },
            {
                type: 'TIME',
                label: '发布日期',
                field: 'time',
            },
            {
                type: 'INPUT',
                label: '文号',
                placeholder: '请输入查询关键词',
                field: 'articleNumber',
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
                        <Button type="danger" onClick={this.handleDelete}>批量删除</Button>
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
                    onOk={this.handleSubmit}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            lewsData:{}
                        })
                    }}
                >
                    <AddForm
                        sourceData ={this.state.lewsData}
                        dispatchLewsData = {(value)=>this.setState({lewsData:value})}
                        dispatchFileList = {(fileList)=>this.setState({fileList:fileList})}
                        fileList = {this.state.fileList||[]}
                     />
                </Modal>
                <Modal
                    width='1000px'
                    title={this.state.title}
                    visible={this.state.isDetailVisible}
                    onOk={()=>this.setState({isDetailVisible:false})}
                    destroyOnClose={true}
                    onCancel={()=>
                        this.setState({
                            isDetailVisible:false,
                            lewsData:{}
                        })
                    }
                >
                    <DetailForm
                        detailData = {this.state.lewsData||{}}
                    />                   
                </Modal>
            </div>
        )
    }
} 
export default Laws;
