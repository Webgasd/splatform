import React,{Component} from 'react';
import {Card, Button, Collapse, Modal} from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm'
import connect from "react-redux/es/connect/connect";
import {changeInput, clearInput} from "../../../redux/action";
const ButtonGroup = Button.Group;
const Panel = Collapse.Panel;

// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
    {
        type: 'SELECT',
        label: '企业行业类型',
        field: 'ctype',
        placeholder: '全部',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '全部'}, {id: '1', name: '进行中'}, {id: '3', name: '行程结束'}]
    },{
        type: 'INPUT',
        label: '企业名称',
        field: 'name'
    }, {
        type: 'SELECT',
        label: '企业类型',
        field: 'type',
        placeholder: '全部',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '全部'}, {id: '1', name: '进行中'}, {id: '3', name: '行程结束'}]
    },{
        type: 'INPUT',
        label: '社会信用代码',
        field: 'number'
    },{
        type: 'INPUT',
        label: '注册地址',
        field: 'address'
    },{
        type: 'INPUT',
        label: '法人或负责人',
        field: 'name'
    }
]

@connect(
    state=>({
        input:state.input
    }),{
        clearInput,
        changeInput
    }
)
class carchive extends Component{
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/supervision/credit/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    // let list  = res.result.item_list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };
    handleSubmit = ()=>{
        let type =this.state.type;
        let _this=this;
        axios.PostAjax({
            url:type=='create'?'/supervision/credit/insert':'/supervision/credit/update',
            data:{
                params:{
                    ..._this.props.input
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false
                })
                this.props.clearInput();
                this.requestList();
            }
        })
    }

    handleOperator = (type,item)=>{ if(type =='create'){
        this.setState({
            title:'创建',
            isVisible:true,
            type
        })
    }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'编辑用户':'查看详情',
                isVisible:true,
                type
            })
        this.props.changeInput({...item,document:JSON.parse(item.document||JSON.stringify([]))});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确认删除？',
                onOk:()=>{
                    axios.ajax({
                        url:'/supervision/credit/delete',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                            this.setState({
                                isVisible:false
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
                title: '企业行业类型',
                dataIndex: 'industry'
            }, {
                title: '企业名称',
                dataIndex: 'enterpriseName'
            },
            {
                title: '企业类型',
                dataIndex: 'type'
            },
            {
                title: '社会信用代码',
                dataIndex: 'creditCode'
            },  {
                title: '注册地址',
                dataIndex: 'address',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, item)=>{
                    return <ButtonGroup >
                        <Button type="primary" size="small"  onClick={()=> {this.handleOperator('edit',item)}}>修改</Button>
                        <Button type="primary" size="small" onClick={() => { this.handleOperator('detail',item)}}>查看</Button>
                        <Button type="primary" size="small" onClick={() => { this.handleOperator('delete',item)}}>删除</Button>
                        <Button type="primary" size="small" onClick={() => { this.handleOperator('detail',item)}}>日志</Button>
                    </ButtonGroup>
                }}

        ];

        return (
            <div>
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
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
                            row_selection='checkbox'
                        />
                    </div>
                </Card>
                <Modal
                    width='1000px'
                    title="添加信用信息"
                    visible={this.state.isVisible}
                    destroyOnClose
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.props.clearInput();
                        this.setState({
                            isVisible:false
                        })
                    }}>
                    <AddForm/>
                </Modal>
            </div>
        );
    }
}

export default carchive;