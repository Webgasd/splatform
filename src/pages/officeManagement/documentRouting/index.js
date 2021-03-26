import React, { Component } from 'react'
import {Button,Card,Collapse,Modal,Tag,Steps,Dropdown,Menu} from 'antd'
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import {connect} from "react-redux";
import AddForm from './AddForm'
import RecordsFRorm from './RecordsFRorm'
import moment from 'moment';
import 'braft-editor/dist/index.css'
import { green } from 'chalk';
import  './style.less'
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm
const { Step } = Steps;


@connect(
    state=>({
        userInfo:state.userInfo
    }),{
    }
)
class DocumentRouting extends Component {
    state = {
        informData:{userName:this.props.userInfo.name},
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
                params:{..._this.params,"situation":2,"module":1}
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
                let list = Importance.map((item,key)=>{
                    item.id = item.id
                    item.name = item.className
                    return item
                })
                _this.setState({
                    Importance:list
                })
                console.log("list",list)
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
        let _this = this
        if(type == 'create'){
            _this.getMessage()
            _this.setState({
                title:'添加公文',
                isVisible:true,
                informData:{author:_this.props.userInfo.userName,issueDate:_this.state.informData.date},
                status:false,
                type
            })
        }
        else if(type == 'modify'||type == 'detail'||type == 'check'){
            _this.requestDetailById(item.id)
            if(type == 'modify'){
                _this.setState({
                    title:"公文流转修改",
                    isVisible:true,
                    status:false,
                    type
                })
            }
            else if(type == 'check'){
                _this.setState({
                    title:"公文流转拟办",
                    status:true, //拟办不需要右下角的按钮
                    isVisible:true,
                    type
                })
            }
            else if(type == 'detail'){
                _this.setState({
                    title:"公文流转查看",
                    status:true, //查看不需要右下角的按钮
                    isVisible:true,
                    type
                })
            }
        }     
        else if(type == 'delete'||type =='deleteGroup'){
            let idList = []
            if(type =='delete'){
                idList=[item.id]
                console.log("idlist",idList)
            }else if(type =='deleteGroup'){
                idList=_this.state.selectedRowKeys
                // console.log("idlist",idList)
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
                    params:{..._this.params,"module":1,id:item.id}
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
        }else if(type == 'process'){
            console.log("record",item)
            let record = item
            let current = 0
            let line1 = record.author+'    发布    '+record.issueDate
            let line2 = record.reviewer+'    待审核  '
            let line3 = ''
            if(record.reviewResult==0){
                current = 1
            }else if(record.reviewResult==1){
                current = 2
                line3 = record.reviewer+'    通过    '+record.reviewTime
            }else if(record.reviewResult==2){
                current = 2
                line3 = record.reviewer+'    不通过    '+record.reviewTime
            }
            _this.setState({
                record:item.record,
                current:current,
                isProcessVisible:true,
                line1,
                line2,
                line3
            })
        }
    }
    //提交新增 更改
    handleSubmit = (key) => {
        let data = this.state.informData
        // data.fileList = this.state.fileList
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
                        params:{...this.state.informData,module:1}
                    }
                }).then((res)=>{
                    if(res.status == 'success'){
                        //提示增加或修改成功
                        confirm({
                            title:'数据保存成功',
                            okText:'好的',
                            okType:'primary',
                            onOk:() => {   
                                _this.setState({
                                    isVisible:false,
                                    informData:{},
                                })
                                this.requestList()
                            }
                        }) 
                    }
                })
    }
    //修改行样式
    getRowClassName = (record, index) => {
        let className = 'notChecked';
        if(record.reviewResult == 1){
            className = 'checked'
        }else if(record.reviewResult == 2){
            className = 'failed'
        }
        return className;

    } 
    //下拉菜单
    menu =(record)=>{
        let direct = this.state.direct
        return(
            <Menu>
                <Menu.Item key="0">
                    <Button type='text' size='small' onClick={()=> {this.handleOperator('records',record)}}>查阅记录</Button>
                </Menu.Item>
                <Menu.Item key="1" style={{display:direct}} >
                    <Button type='text' size='small' onClick={()=> {this.handleOperator('process',record)}} >审核情况</Button>
                </Menu.Item>
                <Menu.Item key="2">
                    <Button type='text' size='small' onClick={()=> {this.handleOperator('delete',record)}}>删除数据</Button>
                </Menu.Item>
            </Menu>
        )
    }
    render() {
        // console.log("direct",this.state.direct)
        //如果选择了拟办人  则转发给拟办人   否则直接发布
        let selected = this.state.informData.reviewer?'':'none'
        let notSelected = this.state.informData.reviewer?'none':''
        //表格列名
        const columns = [
            {
                title:'公文流转号',
                dataIndex:'docNumber',
                key:'docNumber'
            },
            {
                title:'重要性',
                dataIndex:'typeId',
                key:'typeId', //修改
                render:(typeId)=>{
                    let data = (this.state.Importance||[]).find((item)=>item.id==typeId)||{};
                    let className = data.className
                    let color = ''
                    if(typeId=='1'){
                        color = 'rgba(0, 153, 255, 1)'
                    }else if(typeId=='2'){
                        color = 'rgba(204, 0, 0, 1)'
                    }else if(typeId=='3'){
                        color = 'rgba(102, 102, 204, 1)'
                    }
                    return <Tag color={color} key={typeId}>
                    {className} 
                   </Tag>;
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
                    let review = ''
                    let color = ''
                    if(reviewResult == 0){
                        review = '待审核'
                        color ='blue'
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
                render:(text,record) => {
                        //若通过，则不能修改                  
                        const modifyFlag = record.reviewResult == 1?'none':''
                        //0代表未审核 1代表通过 2代表不通过    未审核显示审核处理  已审核显示审核情况                  
                        const reviewStatus = record.reviewResult == 0?'':'none'
                        //判断是否直接下发 如果是直接下发 则不显示审核情况
                        const direct = !record.reviewer?'none':''
                        //两种情况不显示：1.已经审核 2.无需审核   0代表未审核 1代表通过 2代表不通过  直接下发     显示条件审核人id与当前用户一样
                        const hanleStatus = record.reviewResult == 1||record.reviewResult == 2||!record.reviewer?'none':''
                    return <ButtonGroup>
                        <Button type='text' size='small' onClick={()=> {this.handleOperator('detail',record)}}>查看</Button>
                        <Button type='text' size='small'  onClick={()=> {this.handleOperator('check',record)}} style={{display:hanleStatus}}>审核处理</Button>
                        <Button type='text' size='small'  onClick={()=> {this.handleOperator('modify',record)}} style={{display:modifyFlag}}>修改</Button>
                        <Dropdown overlay={()=>this.menu(record)} trigger={['click']}>
                            <a  onClick={()=>this.setState({record:record,direct:direct})}>
                            ... 
                            </a>
                        </Dropdown>
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
                        <Button type="primary" onClick={()=>this.handleOperator('create',null)}>数据新增</Button>
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
                            // rowClassName={this.getRowClassName}
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
                        <Button type='primary' key='toPublic' onClick={e=>this.handleSubmit(1)} style={{display:notSelected}}>保存直接发布</Button>,
                        <Button type='primary' key='toPerson' onClick={e=>this.handleSubmit(2)} style={{display:selected}}>转发给拟办人</Button>
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
                        units={this.state.units}
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
                <Modal
                    width='500px'
                    title='审核情况'
                    visible={this.state.isProcessVisible}
                    onOk={()=>this.setState({isProcessVisible:false})}
                    destroyOnClose={true}
                    onCancel={()=>
                        this.setState({
                            isProcessVisible:false,
                            informData:{}
                        })
                    }
                >
                   <Steps direction="vertical" size="small" current={this.state.current} style={{margin:0}}>
                        <Step title="发布" description={this.state.line1} />
                        <Step title="审核" description={this.state.line2} />
                        <Step title="审核结果" description={this.state.line3} />
                    </Steps>
                </Modal>
                
                
            </div>
        )
    }
} 
export default DocumentRouting;
