import React, { Component } from 'react'
import {Button,Card,Collapse,Modal} from 'antd'
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import {connect} from "react-redux";
import AddForm from './AddForm'
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm

const formList = [
    {
        type: 'SELECT',
        label: '企业通知类型',
        placeholder: '请选择通知类型',
        field: 'type',
        width: 150,
        list: [{id: 0, name: '0'}, {id: 1, name: '1'}]
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
        field: 'author',
        width: 150,
    },
    {
        type: 'INPUT',
        label: '核验人',
        placeholder: '请输入查询关键词',
        field: 'reviewer',
        width: 150,
    },
    {
        type: 'TIME',
        label: '发布日期',
        field: 'issueDate',
    }
];
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
        this.getMessage()
    }
    //发布人和发布日期信息
    getMessage = () => {
        let today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let informData = this.state.informData
        informData.date = date
        console.log(informData)
        this.setState({
            informData:informData
        })
    }
    //查询
    handleFilterSubmit = (params) => {
        this.params = params
        this.params.startData = this.params.startTime
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
                _this.setState({
                    title:item.title,
                    isVisible:true,
                    // informData,
                    type
                })
            }
            else if(type == 'detail'){
                _this.setState({
                    title:item.title,
                    isDetailVisible:true,
                    // informData,
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
                       url:'',
                       data:{
                           params:{
                               
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
    handleSubmit = () => {
        let data = this.state.informData
        data.fileList = this.state.fileList
        data.content=data.content.toHTML()
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
                key:'reviewResult'
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) => {
                    return <ButtonGroup>
                        <Button type='primary'  onClick={()=> {this.handleOperator('detail',record)}} >查看</Button>
                        {this.props.acl.indexOf('/modify')>-1? <Button type='primary' onClick={()=> {this.handleOperator('modify',record)}}>修改</Button>:null}
                        {/* <Button type='primary' onClick={()=>{this.handleOperator('issue',record)}}>发布</Button> */}
                        {this.props.acl.indexOf('/delete')>-1? <Button type='primary' onClick={()=> {this.handleOperator('delete',record)}}>删除</Button>:null}
                    </ButtonGroup>
                }
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
                    title='通知公告'
                    visible={this.state.isVisible}
                    footer = {[
                        <Button type='primary' key='toPublic'>保存直接发布</Button>,
                        <Button type='primary' key='toPerson'>转发给核验人</Button>
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
