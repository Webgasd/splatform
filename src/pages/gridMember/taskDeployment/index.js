import React, { Component } from 'react'
import {Button,Card,Collapse,Modal,Tag,Dropdown,Menu} from 'antd'
import  BaseForm  from '../../../components/BaseForm';
import RecordsFRorm from './RecordsFRorm'
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm'
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm



class TaskDeployment extends Component {
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
        releaseStatus:[
            {
            "className": "未发布",
            "taskStatus": 0,
            },
            {
            "className": "已发布",
            "taskStatus": 1,
            }
        ]
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList()
        this.requestTaskType()
        this.getRegion()
    }
     //查询
     handleFilterSubmit = (params) => {
        this.params = params
        this.requestListByCondition()
    }
    //按条件获取数据
    requestListByCondition = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/gridTaskContent/getAll',
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
            url:'/gridTaskContent/getAll',
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
                console.log("list",list)
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
    //获取任务类型
    requestTaskType = ()=>{
        let _this = this;
        axios.ajax({
            url:'/documentTypeConfig/getByType',
            data:{
                params:{type:3}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.map((item,i)=>{
                    item.id = item.id
                    item.name = item.className
                    return item;
                })
                _this.setState({
                    taskType:list,
                })
            }
        })
    }
    //查看 修改 删除数据   拟态框
    handleOperator = (type,item) => {
        let _this = this
        if(type == 'create'){
            this.setState({
                title:'网格员任务部署',
                isVisible:true,
                type
            })
        }
        else if(type == 'detail'||type == 'modify'){
            _this.getDetail(item.id)
            _this.setState({
                title:'网格员任务',
                isVisible:true,
                type,
            })
        }    
        else if(type == 'delete'||type =='deleteGroup'){
            let idList = []
            if(type =='delete'){
                idList=[item.id]
                console.log("idlist",idList)
            }else if(type =='deleteGroup'){
                idList=_this.state.selectedRowKeys
                console.log("idlist",idList)
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
                            url:'/gridTaskContent/delete',
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
        }else if(type == 'records'){
            axios.PostAjax({
                url:'/gridTaskRead/getById',
                data:{
                    params:{id:item.id}
                }
            }).then((res)=>{
                if(res.status == "success"){
                    if(res.data!=null){
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
                    }else{
                        _this.setState({
                            recordsData:[],
                            isRecordsVisible:true,
                        })
                    }
                }
            })
        }
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
            // if (res.status == 'success') {
            //     let TopArea = []
            //     res.data[0].childrenList.map((item) => {
            //         TopArea.push(item)
            //     })
            //     this.setState({
            //         areaList: res.data,
            //         TopArea
            //     })
            // }
            if (res.status == 'success') {
                const originTargetKeys = res.data[0].childrenList.map((item, index) => {
                    return {
                        key: item.id.toString(),
                        name: item.name,
                        id: item.id
                    }
                })
                _this.setState({
                    mockData: originTargetKeys,
                })
            }
        })
    }
    
    //根据id获取任务详细信息
    getDetail = (id)=>{
        let _this = this;
        axios.PostAjax({
            url:'/gridTaskContent/getById',
            data:{
                params:{id}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let data = res.data||{}
                //匹配街道
                const valueSelect = data.areaList||[]
                const list = valueSelect.map((item, index) => {
                    const region = this.state.mockData.find(
                        data => parseInt(item) === data.id
                    )
                    return region.name
                })
                data.area = list.toString()
                _this.setState({
                  informData:data
                })
            }
        })
    }
    //
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
                url:this.state.type=='create'?'/gridTaskContent/insert':'/gridTaskContent/update',
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
    //发布 取消发布
    handleRelese = (type,record)=>{
        this.getDetail(record.id)
        let title = ''
        let taskStatus = 0
        if(type=="notRelease"){
            title = '确定取消发布?'
            taskStatus = 0
        }else{
            title = '确定发布?'
            taskStatus = 1
        }
        confirm({
            title:title,
            okText:'是',
            okType:'danger',
            cancelText:'否',
            onOk:() => {
                axios.PostAjax({
                    url:'/gridTaskContent/update',
                    data:{
                        params:{
                            ...this.state.informData,
                            "taskStatus":taskStatus
                        }
                    }
                }).then((res)=>{
                    if(res.status == "success"){
                        this.requestList();
                    }
                })
            }
        })
    }
    //下拉菜单
    menu =(record)=>{
        return(
            <Menu>
                <Menu.Item key="0">
                    <Button type='text'  onClick={()=> {this.handleOperator('records',record)}}>查阅记录</Button>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button type='text'  onClick={()=> {this.handleOperator('delete',record)}}>删除数据</Button>
                </Menu.Item>
            </Menu>
        )
    }
    render() {
        const formList = [
            {
                type: 'SELECT',
                label: '任务类型',
                placeholder: '请选择任务类型',
                field: 'taskType',
                width: 150,
                list: this.state.taskType
            },
            {
                type: 'INPUT',
                label: '任务标题',
                placeholder: '请输入查询关键词',
                field: 'taskTitle',
                width: 150,
            },
            {
                type: 'DATE',
                label: '发布日期',
                placeholder: '请输入查询关键词',
                field: 'issueDate',
                width: 150,
            }
        ];
        const columns = [
            {
                title:'任务类型',
                dataIndex:'taskType',
                key:'taskType',
                render:(taskType)=>{
                    let data = (this.state.taskType||[]).find((item)=>item.id==taskType)||{};
                    return data.className
                }
            },
            {
                title:'任务标题',
                dataIndex:'taskTitle',
                key:'taskTitle'
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
                title:'任务状态',
                dataIndex:'taskStatus',
                key:'taskStatus',
                render:(taskStatus)=>{
                    let review = ''
                    let color = ''
                    if(taskStatus == 0){
                        review = '待发布'
                        color ='blue'
                    }
                    else if(taskStatus == 1){
                        review = '有效'
                        color ='green'
                    }
                    else if(taskStatus == 2){
                        review = '过期'
                        color ='red'
                    }
                    return <Tag color={color} key={taskStatus}>
                     {review.toUpperCase()} 
                    </Tag>
                }
            },
            {
                title:'任务期限',
                dataIndex:'taskDate',
                key:'taskDate'
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) => {   
                    //若通过                  
                    const releaseFlag = record.taskStatus == 1?true:false               
                    return <ButtonGroup>
                        <Button type='text'  onClick={()=> {this.handleOperator('detail',record)}} >查看</Button>
                        <Button type='text'  onClick={()=> {this.handleOperator('modify',record)}}>修改</Button>
                        {releaseFlag?<Button type='text' onClick={()=> {this.handleRelese('notRelease',record)}} >取消发布</Button>
                        :<Button type='text' onClick={()=> {this.handleRelese('release',record)}} >发布</Button>}
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
                    width='1000px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    footer = {this.state.type=="detail"?null:
                        <Button type='primary' key='toPublic' onClick={this.handleSubmit}>保存直接发布</Button>
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
                        sourceData ={this.state.informData}
                        dispatchInformData = {(value) => this.setState({informData:value})}
                        status = {this.state.type}
                        taskType = {this.state.taskType}
                        releaseStatus = {this.state.releaseStatus}
                        mockData = {this.state.mockData}
                     />
                </Modal>
            </div>
        )
    }
} 
export default TaskDeployment;
