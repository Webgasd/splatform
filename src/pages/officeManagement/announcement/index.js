import React, { Component } from 'react'
import {Button,Card,Collapse,Modal,Tag,Dropdown,Menu} from 'antd'
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import {connect} from "react-redux";
import AddForm from './AddForm'
import moment from 'moment';
import RecordsFRorm from '../documentRouting/RecordsFRorm'
import { green } from 'chalk';
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm


@connect(
    state=>({
        acl:state.acls['/announcement'],
        userInfo:state
    }),{
    }
)
class Announcement extends Component {
    state = {
        informData:{},
        selectedRowKeys: [], //表格选择的条目记录
        list:[     //获取的数据列表
            {
                data:'1',
                key:1
            }
        ],
        title:'' , //拟态框标题
        idList:[]
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList()
        this.getClass()
    }
    //发布人和发布日期信息
    getMessage = () => {
        let date = moment().format("YYYY-MM-DD")
        let informData = this.state.informData
        informData.date = date
        informData.issueDate = date
        this.setState({
            informData:informData
        })
    }
     //查询
     handleFilterSubmit = (params) => {
        this.params = params
        this.params.startDate = this.params.startissueDate
        this.params.endDate = this.params.endissueDate
        console.log(this.params)
        this.requestListByCondition()
    }
    //按条件获取数据
    requestListByCondition = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/documentCirculate/getPage',
            data:{
                params:{..._this.params,"situation":2,module:0}
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
            url:'/documentCirculate/getPage',
            data:{
                params:{..._this.params,situation:2,module:0}
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
                type,
                status:false
            })
        }
        else if(type == 'modify'||type == 'detail'||type == 'check'){
            let _this = this;
            axios.PostAjax({
                url:'/documentCirculate/getById',
                data:{
                    params:{docId:item.id,module:0}
                }
            }).then((res)=>{
                let informData = res.data||{}
                if(res.status == "success"){
                    // _this.setState({
                    //     isVisible:true,
                    //     type,
                    //     informData:informData
                    // })
                    if(type == 'modify'){
                        _this.setState({
                            title:"公文流转",
                            isVisible:true,
                            status:false,
                            type,
                            informData:informData
                        })
                    }
                    else if(type == 'check'||type == 'detail'){
                        _this.setState({
                            title:"公文流转",
                            status:true, //拟办不需要右下角的按钮
                            isVisible:true,
                            type,
                            informData:informData
                        })
                    }
                }
                
            })
            
        }
        else if(type == 'delete'||type =='deleteGroup'){
            let idList = []
            if(type =='delete'){
                idList=[item.id]
            }else if(type =='deleteGroup'){
                idList=_this.state.selectedRowKeys
            }
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
                            url:'/documentCirculate/delete',
                            data:{
                                params:{
                                 idList:idList
                                }
                            }
                        }).then((res)=>{
                            if(res.status == "success"){
                                _this.setState({selectedRowKeys:[]})
                                _this.requestList();
                            }
                        })
                    }
                })
            }
        }else if(type == 'records'){
            axios.PostAjax({
                url:'/documentAuthorReader/getById',
                data:{
                    params:{..._this.params,"module":0,id:item.id}
                }
            }).then((res)=>{
                if(res.status == "success"){
                    let recordsData = res.data.data||[]
                    let list = recordsData.map((item,key)=>{
                        item.id = item.id
                        item.name = item.name
                        if(item.readState==1){
                            item.readstatus="已查阅"
                        }else if(item.readState==0){
                            item.readstatus="未读"
                        }
                        return item
                    })
                    _this.setState({
                        recordsData:list,
                        isRecordsVisible:true,
                        pagination:Utils.pagination(res,(current)=>{
                            _this.params.pageNo = current;//	当前页数
                            _this.requestList(); //刷新列表数据
                        })
                    })
                }
            })
        }
    }
    //提交新增 更改
    handleSubmit = (key) => {
        let data = this.state.informData
        data.fileList = this.state.fileList
        if(key == 1){
            data.reviewResult = 1
            this.setState({
                informData:data
            })
            this.handleOk()
        }
        else {
            data.reviewResult = 0
            this.setState({
                informData:data
            })
            this.handleOk()
        }
    }
    handleOk = () =>{
        let _this = this
        axios.PostAjax({
                    url:this.state.type=='create'?'/documentCirculate/insert':'/documentCirculate/update',
                    data:{
                        params:{...this.state.informData,module:0}
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
    //获取通知类型
    getClass = () => {
        let _this = this
        axios.ajax({
            url: '/documentTypeConfig/getByType',
            data: {
                params: {
                    type: 1
                }
            }
        }).then((res) => {
            if (res.status == 'success') {
                let data = res.data||[]
                let list = data.map((item,key)=>{
                    item.id = item.id
                    item.name = item.className
                    return item
                })
                _this.setState({
                    class: list
                })
            }
        })
    }
    //下拉菜单
    menu =(record)=>{
        let direct = this.state.direct
        return(
            <Menu>
                <Menu.Item key="0">
                  <Button type='text'  size='small' onClick={()=> {this.handleOperator('records',record)}} >查阅记录</Button>
                </Menu.Item>
                <Menu.Item key="1">
                  <Button type='text' size='small' onClick={()=> {this.handleOperator('delete',record)}}>删除数据</Button>
                </Menu.Item>
            </Menu>
        )
    }
    render() {
        //如果选择了拟办人  则转发给拟办人   否则直接发布
        let selected = this.state.informData.reviewer?'':'none'
        let notSelected = this.state.informData.reviewer?'none':''
        const formList = [
            {
                type: 'SELECT',
                label: '企业通知类型',
                placeholder: '请选择通知类型',
                field: 'typeId',
                width: 150,
                list: this.state.class
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
                field: 'reviewerName',
                width: 150,
            },
            {
                type: 'TIME',
                label: '发布日期',
                field: 'issueDate',
            }
        ];
        const columns = [
            {
                title:'通知类型',
                dataIndex:'typeId',
                key:'typeId',
                render:(typeId)=>{
                    let data = (this.state.class||[]).find((item)=>item.id==typeId)||{};
                    console.log(data)
                    return data.className;
                }
            },
            {
                title:'通知公告标题',
                dataIndex:'title',
                key:'title'
            },
            {
                title:'通知文号',
                dataIndex:'docNumber',
                key:'docNumber'
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
            //  {
            //     title:'核验日期',
            //     dataIndex:'reviewTime',
            //     key:'reviewTime'
            // },
            {
                title:'发布状态',
                dataIndex:'reviewResult',
                key:'reviewResult',
                render:(reviewResult)=>{
                    if(reviewResult == 0){
                        let review = '待审核'
                        return <Tag color='green' key={reviewResult}>
                            {review.toUpperCase()}
                        </Tag>
                    }
                    else if(reviewResult == 1){
                        let review = '通过/下发'
                        return <Tag color='blue' key={reviewResult}>
                            {review.toUpperCase()}
                        </Tag>
                    }
                    else if(reviewResult == 2){
                        let review = '不通过/退回'
                        return <Tag color='red' key={reviewResult}>
                            {review.toUpperCase()}
                        </Tag>
                    }
                }
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) => {                  
                        const reviewStatus = record.reviewResult == 1?'none':''
                        // const obReviewStatus = record.reviewResult == 1?'':'none'
                        //两种情况不显示：1.已经审核 2.无需审核   0代表未审核 1代表通过 2代表不通过  直接下发     显示条件审核人id与当前用户一样
                        const hanleStatus = record.reviewResult == 1||record.reviewResult == 2||!record.reviewer?'none':''
                    return <ButtonGroup>
                        <Button type='text'  size='small' onClick={()=> {this.handleOperator('detail',record)}} >查看</Button>
                        <Button type='text' size='small' style={{display:reviewStatus}} onClick={()=> {this.handleOperator('modify',record)}}>修改</Button>
                        <Button type='text' size='small' style={{display:hanleStatus}} onClick={()=>{this.handleOperator('check',record)}}>审核处理</Button>
                        <Dropdown overlay={()=>this.menu(record)} trigger={['click']}>
                            <a  onClick={()=>this.setState({record:record})}>
                            ... 
                            </a>
                        </Dropdown>
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
                        <Button type="danger" onClick={()=>this.handleOperator('deleteGroup',null)}>批量删除</Button>
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
                    footer = {this.state.status
                    ?true:[
                            <Button type='primary' key='toPublic' onClick={e=>this.handleSubmit(1)} style={{display:notSelected}}>保存直接发布</Button>,
                            <Button type='primary' key='toPerson' onClick={e=>this.handleSubmit(2)} style={{display:selected}}>转发给核验人</Button>
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
                        class={this.state.class}
                        informData ={this.state.informData}
                        dispatchInformData = {(value) => this.setState({informData:value})}
                        status = {this.state.type}
                     />
                </Modal>
                <Modal
                    width='1000px'
                    title='查阅记录'
                    visible={this.state.isRecordsVisible}
                    onOk={()=>this.setState({isRecordsVisible:false})}
                    destroyOnClose={true}
                    onCancel={()=>
                        this.setState({
                            isRecordsVisible:false,
                            informData:{}
                        })
                    }
                >
                   <RecordsFRorm recordsData={this.state.recordsData}/>
                </Modal>
            </div>
        )
    }
} 
export default Announcement;
