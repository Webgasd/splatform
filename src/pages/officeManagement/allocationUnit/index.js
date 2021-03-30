import React, { Component } from 'react'
import {Button,Card,Collapse,Modal} from 'antd'
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable'
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm'
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm



class AllocationUnit extends Component {
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
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList()
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
            url:'/documentSourceunit/getPage',
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
            url:'/documentSourceunit/getPage',
            data:{
                params:{..._this.params,isPage:1}
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
                title:'来文单位配置',
                isVisible:true,
                type
            })
        }
        else if(type == 'modify'||type == 'detail'){
            let _this = this;
            _this.setState({
                isVisible:true,
                type,
                informData:item
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
                            url:'/documentSourceunit/delete',
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
                url:this.state.type=='create'?'/documentSourceunit/insert':'/documentSourceunit/update',
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
    
    render() {
        const formList = [
            {
                type: 'INPUT',
                label: '来文单位',
                placeholder: '请输入查询关键词',
                field: 'name',
                width: 150,
            },
            {
                type: 'INPUT',
                label: '联系人',
                placeholder: '请输入查询关键词',
                field: 'contactPerson',
                width: 150,
            },
            {
                type: 'INPUT',
                label: '联系电话',
                placeholder: '请输入查询关键词',
                field: 'phone',
                width: 150,
            }
        ];
        const columns = [
            {
                title:'来文单位',
                dataIndex:'name',
                key:'name'
            },
            {
                title:'联系人',
                dataIndex:'contactPerson',
                key:'contactPerson'
            },
            {
                title:'联系电话',
                dataIndex:'phone',
                key:'phone'
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) => {                  
                    return <ButtonGroup>
                        <Button type='text'  onClick={()=> {this.handleOperator('detail',record)}} >查看</Button>
                        <Button type='text'  onClick={()=> {this.handleOperator('modify',record)}}>修改</Button>
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
                    title='来文单位'
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
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
            </div>
        )
    }
} 
export default AllocationUnit;
