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
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm


const formList = [
    {
        type: 'SELECT',
        label: '主题分类',
        placeholder: '请选择文库种类',
        field: 'workType',
        width: 150,
        list: [{id: 0, name: '0'}, {id: 1, name: '1'}]
    },
    {
        type: 'INPUT',
        label: '标题',
        placeholder: '请输入查询关键词',
        field: 'workType',
        width: 150,
    },
    {
        type: 'INPUT',
        label: '文号',
        placeholder: '请输入查询关键词',
        field: 'workType',
        width: 150,
        list: [{id: 0, name: '0'}, {id: 1, name: '1'}]
    },
    {
        type: 'TIME',
        label: '发布日期',
        field: 'time',
    }
];

@connect(
    state=>({
        acl:state.acls['/laws'],
        userInfo:state
    }),{
    }
)
class Laws extends Component {
    state = {
        lewsData:{},
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
    //查询
    handleFilterSubmit = (params) => {
        this.params = params
    }
    //获取表格数据
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'',
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
            this.setState({
                title:'法律法规',
                isVisible:true,
                type
            })
        }
        else if(type == 'modify'||type == 'detail'){
            if(type == 'modify'){
                _this.setState({
                    title:item.title,
                    isVisible:true,
                    // lewsData,
                    type
                })
            }
            else if(type == 'detail'){
                _this.setState({
                    title:item.title,
                    isDetailVisible:true,
                    // lewsData,
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
        //             let lewsData = res.data;
        //             lewsData.content = BraftEditor.createEditorState(lewsData.content)
        //             _this.setState({
        //                 title:item.title,
        //                 isVisible:true,
        //                 lewsData,
        //                 type
        //             })
        //         }
        //     })
        // }
    }
    //提交新增 更改
    handleSubmit = () => {
        let data = this.state.lewsData
        data.fileList = this.state.fileList
        data.content=data.content.toHTML();
    }
    
    render() {
        console.log(this.props.userInfo)
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
                    title='法律法规'
                    visible={this.state.isVisible}
                    onOK={this.handleSubmit}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            lewsData:{},
                        })
                    }}
                >
                    <AddForm
                        lewsData ={this.state.lewsData}
                        dispatchLewsData = {(value)=>this.setState({lewsData:value})}
                        dispatchFileList = {(fileList)=>this.setState({fileList:fileList})}
                        fileList = {this.state.fileList||[]}
                     />
                </Modal>
                <Modal
                    width='1000px'
                    title='法律法规'
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
                        lewsData = {this.state.lewsData||{}}
                    />
                </Modal>
            </div>
        )
    }
} 
export default Laws;
