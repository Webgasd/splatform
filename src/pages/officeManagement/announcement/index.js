import React, { Component } from 'react'
import {Button,Card,Collapse,Modal,Table, Tag, Space} from 'antd'
import  BaseForm  from '../../../components/BaseForm'
import ETable from '../../../components/ETable'
import Utils from '../../../utils'
import axios from '../../../axios'
import AddForm from './AddForm'
import DetailForm from './DetailForm'
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm


const formList = [
    {
        type: 'SELECT',
        label: '通知类型',
        placeholder: '请选择通知类型',
        field: 'noticeType',
        width: 150,
        list: [{id: 0, name: '0'}, {id: 1, name: '1'}]
    },
    {
        type: 'INPUT',
        label: '通知公告标题',
        placeholder: '请输入通知公告标题',
        field: 'noticeTitle',
        width: 150,
    },
    {
        type: 'TIME',
        label: '发布日期',
        field: 'time',
    },
    {
        type: 'INPUT',
        label: '通知文号',
        placeholder: '请输入通知文号',
        field: 'noticeNum',
        width: 150,
    },
    {
        type: 'INPUT',
        label: '审核人',
        placeholder: '请输入审核人',
        field: 'people',
        width: 150,
    },
]


export default class Announcement extends Component{
    state = {
        annoData:{},
        selectedRowKeys: [], //表格选择的条目记录
        title:'',  //拟态框标题
        list:[
            {
                key: '1',
                name: 'John Brown',
                noticeType:'教育',
                noticeNum:'1010110',
                noticeTitle:'疫情防控',
                money: '￥300,000.00',
                address: 'New York No. 1 Lake Park',
              },
              {
                key: '2',
                name: 'Jim Green',
                noticeType:'教育',
                noticeNum:'10143110',
                noticeTitle:'地震防控',
                money: '￥1,256,000.00',
                address: 'London No. 1 Lake Park',
              },
              {
                key: '3',
                name: 'Joe Black',
                noticeType:'教育',
                noticeNum:'1025110',
                noticeTitle:'洪水防控',
                money: '￥120,000.00',
                address: 'Sidney No. 1 Lake Park',
              },
        ]    
    }
    params = {
        pageNo:1
    }
    //安装完组件后立即调用
    // componentDidMount(){
    //     this.requestList();
    // }

    //查询列表 刷新数据
    requestList = (params) => {
        let _this = this
        axios.ajax({
            url:'',
            data:{
                params:{...this.params}
            }
        }).then((res) => {
            if(res.status == 'success'){
                console.log('接口调用成功')
            }
        })
    }
    //查询
    handleFilterSubmit = (params) => {
        console.log(params)
        this.params = params;
        this.requestList()
    }
    //这个作用是什么
    start = () => {

        // ajax request after empty completing
        this.setState({
            selectedRowKeys: [],
        })
    }
    //查看 修改 删除数据   拟态框  主要修改state状态
    handleOperator = (type,item) => {
        let _this = this
        if(type == 'create'){
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
                    annoData:item,
                    type
                })
            }
            else if(type == 'detail'){
                //console.log('index deteil',item)
                _this.setState({
                    title:item.title,
                    isDetailVisible:true,
                    annoData:item,
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
    }
    handleDelete = ()=>{
        let item = this.state.selectedItem;
        console.log(this.state.selectedItem)
        let _this = this;
        if(!item){
            Modal.info({
                title: '信息',
                content: '请选择一个通知'
            })
            return;
        }
        Modal.confirm({
            content:'确定要删除此通知吗？',
            onOk:()=>{
                axios.ajax({
                    url:'',
                    data:{
                        params:{
                            id:item.id
                        }
                    }
                }).then((res)=>{
                    if(res.status == "success"){
                        _this.setState({
                            isVisible:false //这里为啥要设置为false
                        })
                        _this.requestList();
                    }
                })
            }
        })
    }
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    //提交新增 更改
    handleSubmit = () => {
        let data = this.state.annoData
        data.fileList = this.state.fileList
        data.content=data.content.toHTML();
    }
    render() {

        const columns = [
            {
              title: '通知类型',
              dataIndex: 'noticeType',
              render: text => <a>{text}</a>,
            },
            {
              title: '通知公告标题',
              className: 'column-money',
              dataIndex: 'noticeTitle',
            },
            {
              title: '通知文号',
              dataIndex: 'noticeNum',
            },
            {
                title: '发布人',
                className: 'column-money',
                dataIndex: 'money',
            },
            {
                title: '发布日期',
                dataIndex: 'address',
            },
            {
                title: '审核人',
                dataIndex: '1',
                render: text => <a>{text}</a>,
            },
            {
                title: '审核状态',
                dataIndex: 'name',
                render: text => <a>{text}</a>,
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text,record) => {
                    return <ButtonGroup>
                        <Button type='primary' onClick={()=> {this.handleOperator('detail',record)}}>查看</Button>
                        <Button type='primary' onClick={()=> {this.handleOperator('modify',record)}}>修改</Button>
                        <Button type='primary' onClick={()=> {this.handleOperator('delete',record)}}>删除</Button>
                    </ButtonGroup>
                }
            },
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
                        <Button type="primary" onClick={this.handleDelete}>批量删除</Button>
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
                    onOK={this.handleSubmit}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            annoData:{},
                        })
                    }}
                >
                    <AddForm
                        annoData ={this.state.annoData} 
                        dispatchannoData = {(value)=>this.setState({annoData:value})}
                        dispatchFileList = {(fileList)=>this.setState({fileList:fileList})}
                        fileList = {this.state.fileList||[]}
                     />
                </Modal>
                <Modal
                    width='1000px'
                    title='通知公告'
                    visible={this.state.isDetailVisible}
                    onOk={()=>this.setState({isDetailVisible:false})}
                    destroyOnClose={true}
                    onCancel={()=>
                        this.setState({
                            isDetailVisible:false,
                            annoData:{}
                        })
                    }
                > 
                    <DetailForm
                        annoData = {this.state.annoData||{}}
                    />
                </Modal>
            </div>
        )
    }
}


