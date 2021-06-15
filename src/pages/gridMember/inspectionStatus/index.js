import React, { Component } from 'react'
import {Button,Card,Collapse,Modal,Tag} from 'antd'
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm'
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm



class InspectionStatus extends Component {
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
        InfoValidity:[
            {
            "className": "信息无效",
            "infoValid": 0,
            },
            {
            "className": "信息有效",
            "infoValid": 1,
            }
        ]
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList()
        this.requestInspectionType()
        this.requestInspectionHandle()
        this.getRegion()
    }
     //查询
     handleFilterSubmit = (params) => {
        this.params = params
        this.params.startDate = this.params.startissueDate
        this.params.endDate = this.params.endissueDate
        this.requestListByCondition()
    }
    //按条件获取数据
    requestListByCondition = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/gridInspection/getPage',
            data:{
                params:{..._this.params,isPage:1}
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
            url:'/gridInspection/getPage',
            data:{
                params:{..._this.params,isPage:1}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    item.taskDate = item.taskLimitStart+"~"+item.taskLimitEnd
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
    //获取巡检情况问题类型
    requestInspectionType = ()=>{
        let _this = this;
        axios.ajax({
            url:'/documentTypeConfig/getByType',
            data:{
                params:{type:4}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.map((item,i)=>{
                    item.id = item.id
                    item.name = item.className
                    return item;
                })
                _this.setState({
                    InspectionType:list,
                })
            }
        })
    }
    //获取区域信息
    getRegion = () => {
        let _this = this
        axios.PostAjax({
            url: '/sys/area/tree',
            data: {
                params: { }
            }
        }).then((res) => {
            if (res.status == 'success') {
                const originTargetKeys = res.data[0].childrenList.map((item, index) => {
                    item.id = item.id
                    item.name = item.name
                    return item;
                })
                _this.setState({
                    mockData: originTargetKeys,
                })
            }
        })
    }
    //获取巡检情况处理方式
    requestInspectionHandle = ()=>{
        let _this = this;
        axios.ajax({
            url:'/documentTypeConfig/getByType',
            data:{
                params:{type:5}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.map((item,i)=>{
                    item.id = item.id
                    item.name = item.className
                    return item;
                })
                _this.setState({
                    inspectionHandle:list,
                })
            }
        })
    }
    //根据id获取详情
    getInfoById = (id) =>{
        let _this = this;
        axios.ajax({
            url:'/gridInspection/getById',
            data:{
                params:{id}
            }
        }).then((res)=>{
            if(res.status == "success"){
                _this.setState({
                    informData:res.data,
                })
            }
        })
    }
    //查看 修改 删除数据   拟态框
    handleOperator = (type,item) => {
        let _this = this
        if(type == 'create'){
            this.setState({
                title:'巡检情况',
                isVisible:true,
                type
            })
        }
        else if(type == 'detail'||type == 'handle'){
            _this.getInfoById(item.id)
            _this.setState({
                title:'巡检情况',
                isVisible:true,
                type,
            })
        }    
        else if(type == 'delete'||type =='deleteGroup'){
            let idList = []
            if(type =='delete'){
                idList=[item.id]
                // console.log("idlist",idList)
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
                            url:'/gridInspection/delete',
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
    }
    //提交新增 更改
    handleSubmit = () => {
        let data = this.state.informData
        this.setState({
            informData:data
        })
        this.handleOk()
    }
    handleOk = () =>{
        let _this = this
        if(this.state.type=='detail'){
            _this.setState({
                isVisible:false,
                informData:{},
            })
        }else{
            axios.PostAjax({
                url:this.state.type=='create'?'/gridInspection/insert':'/gridInspection/reviewTerm',
                data:{
                    params:{...this.state.informData}
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
    }
    handleToSave = () =>{
        let data = this.state.informData
        let {id,infoValid,handleType,reviewDate,reviewContent} = data
        // let id = data.id||''
        // let infoValid = data.infoValid||''
        // let handleType = data.handleType||''
        // let reviewDate = data.reviewDate||''
        // let reviewContent = data.reviewContent||''
        let checkData = {id,infoValid,handleType,reviewDate,reviewContent}
        console.log('checkData',checkData)
        axios.PostAjax({
            url:'/gridInspection/reviewTerm',
            data:{
                params:{...checkData}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    isVisible:false,
                    informData:{},
                })
                this.requestList()
            }
        })
    }
    render() {
        const formList = [
            {
                type: 'SELECT',
                label: '巡检区域',
                placeholder: '请选择巡检区域',
                field: 'inspectStreet',
                width: 150,
                list: this.state.mockData
            },
            {
                type: 'INPUT',
                label: '巡检问题标题',
                placeholder: '请输入查询关键词',
                field: 'inspectTitle',
                width: 150,
            },
            {
                type: 'TIME',
                label: '上报日期',
                placeholder: '请输入查询关键词',
                field: 'issueDate',
                width: 150,
            },
            {
                type: 'SELECT',
                label: '处理状态',
                placeholder: '请输入查询关键词',
                field: 'reviewFlag',
                width: 150,
                list: this.state.reviewFlag
            },
            {
                type: 'SELECT',
                label: '问题类型',
                placeholder: '请输入查询关键词',
                field: 'typeId',
                width: 150,
                list: this.state.InspectionType
            }
        ];
        const columns = [
            {
                title:'巡检区域',
                dataIndex:'area',
                key:'area',
            },
            {
                title:'巡检问题标题',
                dataIndex:'inspectTitle',
                key:'inspectTitle'
            },
            {
                title:'网格员',
                dataIndex:'grider',
                key:'grider'
            },
            {
                title:'问题类型',
                dataIndex:'type',
                key:'type',
            },
            {
                title:'上报日期',
                dataIndex:'operateTime',
                key:'operateTime'
            },
            {
                title:'处理状态',
                dataIndex:'reviewFlag',
                key:'reviewFlag',
                render:(reviewFlag)=>{
                    let review = ''
                    let color = ''
                    if(reviewFlag == 0){
                        review = '已处理'
                        color ='blue'
                    }
                    else if(reviewFlag == 1){
                        review = '未处理'
                        color ='green'
                    }
                    return <Tag color={color} key={reviewFlag}>
                     {review.toUpperCase()} 
                    </Tag>
                }
            },
            {
                title:'信息有效性',
                dataIndex:'reviewContent',
                key:'reviewContent'
            },
            {
                title:'处理方式',
                dataIndex:'handle',
                key:'handle'
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) => {                  
                    return <ButtonGroup>
                        <Button type='text'  onClick={()=> {this.handleOperator('detail',record)}} >查看</Button>
                        <Button type='text'  onClick={()=> {this.handleOperator('handle',record)}}>处理</Button>
                        <Button type='text' onClick={()=> {this.handleOperator('delete',record)}}>删除</Button>
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
                        <Button type="primary" onClick={()=> this.handleOperator('create',null)} disabled={true}>数据新增</Button>
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
                    title={this.state.title}
                    visible={this.state.isVisible}
                    footer = {this.state.type=='detail'?"":
                        <Button type='primary' key='toPublic' onClick={this.handleToSave}>保存并回复</Button>
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
                        dispatchInformData = {(value) => this.setState({informData:value})}
                        status = {this.state.type}
                        state = {this.state}
                        informData = {this.state.informData}
                        checkData = {this.state.checkData}
                     />
                </Modal>
            </div>
        )
    }
} 
export default InspectionStatus;
