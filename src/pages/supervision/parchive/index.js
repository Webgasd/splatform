import React,{Component} from 'react';
import {Card, Button, Select, Input, Radio, message, Row, Col, Collapse, Modal, Form, Tabs} from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm';
import {connect} from 'react-redux';
import {changeParchive} from '../../../redux/action';
import DetailForm from './Detail';

const ButtonGroup = Button.Group;
const Panel = Collapse.Panel;

// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
    {
        type: 'SELECT',
        label: '单位名称',
        field: 'unit',
        placeholder: '全部',
        initialValue: '0',
        width: 200,
        list: [{id: '0', name: '全部'}, {id: '1', name: '进行中'}, {id: '3', name: '行程结束'}]
    }, {
        type: 'SELECT',
        label: '部门名称',
        field: 'department',
        placeholder: '全部',
        initialValue: '0',
        width: 200,
        list: [{id: '0', name: '全部'}, {id: '1', name: '进行中'}, {id: '3', name: '行程结束'}]
    },{
        type: 'INPUT',
        label: '姓名',
        field: 'name'
    },
    {
        type: 'SELECT',
        label: '职务',
        field: 'duties',
        placeholder: '全部',
        initialValue: '0',
        width: 200,
        list: [{id: '0', name: '全部'}, {id: '1', name: '进行中'}, {id: '3', name: '行程结束'}]
    },{
        type: 'INPUT',
        label: '移动电话',
        field: 'telephone'
    }
]

class parchive extends Component{
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
            url:'/supervision/ca/getPage',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;
                        _this.requestList();
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

    handleAdd = ()=>{
        this.setState({
            isaddVisible:true
        })
    }
    handleAddSubmit = ()=>{
        let data = this.addForm.props.form.getFieldsValue();
        axios.ajax({
            url:'ca/insert',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isaddVisible:false
                })
                this.requestList();
            }
        })
    }

    handleSubmit = ()=>{
        let _this=this
        axios.ajax({
            url:'/ca/update',
            data:{
                params:{
                    ..._this.props.parchive
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false
                })
                this.requestList();
            }
        })
    }

    handleOperator = (type,item)=>{
        if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                isVisible:true,
                type
            })
            this.props.dispatch(changeParchive(item))
        }else if(type=="delete"){
            Modal.confirm({
                text:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/post.json',
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
                title: '所在单位',
                dataIndex: 'unit'
            }, {
                title: '姓名',
                dataIndex: 'name'
            },
            {
                title: '性别',
                dataIndex: 'sex',
                render(sex){
                    return sex ==1 ?'男':'女'
                }
            },{
                title: '文化程度',
                dataIndex: 'education'
            },
            {
                title: '体检',
                dataIndex: 'test',
            },{
                title: '健康证号',
                dataIndex: 'number'
            },  {
                title: '健康证有限期限',
                dataIndex: 'term',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, item)=>{
                    return <ButtonGroup >
                        <Button type="primary" size="small" onClick={() => { this.handleOperator('detail',item)}}>查看</Button>
                        <Button type="primary" size="small"  onClick={()=> {this.handleOperator('edit',item)}}>修改</Button>
                        <Button type="primary" size="small" onClick={() => {this.handleOperator('delete',item)}}>删除</Button>
                        <Button type="primary" size="small" onClick={() => { this.handleOperator('journal',item)}}>日志</Button>
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
                        <Button type="primary" onClick={this.handleAdd}>添加</Button>
                        <Button type="primary" >删除</Button>
                        <Button type="primary" >导入</Button>
                        <Button type="primary" >导出</Button>
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
                    width='850px'
                    title="添加企业信息"
                    visible={this.state.isaddVisible}
                    onOk={this.handleAddSubmit}
                    onCancel={()=>{
                        this.addForm.props.form.resetFields();
                        this.setState({
                            isaddVisible:false
                        })
                    }}
                >
                    <AddForm  userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.addForm = inst }/>
                </Modal>
                <Modal
                       width='800px'
                       title={this.state.title}
                       visible={this.state.isVisible}
                       onOk={this.handleSubmit}
                       onCancel={()=>{
                           this.setState({
                               isVisible:false,
                           })
                           this.props.dispatch(changeParchive({}))
                       }}
                >
                    <DetailForm type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps=(state)=>({
    parchive:state.parchive,

})


export default connect(mapStateToProps)(parchive);



class RMsg extends Component{
    state={
        selectedRowKeys: [],
    };


    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/rmsg.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.result.item_list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }


    start = () => {

        // ajax request after empty completing

        this.setState({
            selectedRowKeys: [],
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'num',

            }, {
                title: '调离时间',
                dataIndex: 'movedate'
            },{
                title: '旧岗位',
                dataIndex: 'old',
            },
            {
                title: '新岗位',
                dataIndex: 'new',
            },
            {
                title: '登记时间',
                dataIndex: 'recorddate',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <ButtonGroup>
                        <Button type="primary"  onClick={() => { this.handleOperator('detail',record)}}>查询</Button>
                        <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>修改</Button>
                        <Button type="primary"  onClick={() => { this.handleDelete1(record.key) }}>删除</Button>
                    </ButtonGroup>


                }
            }
        ];
        return (
            <div>

                <Card style={{marginTop:10}}>

                    {/*使用封装好的ETable组件实现角色列表的展示*/}
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
                </Card>
            </div>

        )
    }
}

class CMsg extends Component{
    state={
        selectedRowKeys: [],
    };


    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/cmsg.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.result.item_list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }


    start = () => {

        // ajax request after empty completing

        this.setState({
            selectedRowKeys: [],
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    render() {
        const columns = [
            {
                title: '日期',
                dataIndex: 'date',

            }, {
                title: '晨检记录',
                dataIndex: 'checkrecord'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <ButtonGroup>
                        <Button type="primary"  onClick={() => { this.handleOperator('detail',record)}}>查询</Button>
                        <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>编辑</Button>
                        <Button type="primary"  onClick={() => { this.handleDelete1(record.key) }}>删除</Button>
                    </ButtonGroup>


                }
            }
        ];


        return (
            <div>

                <Card style={{marginTop:10,heighet:400}}>

                    {/*使用封装好的ETable组件实现角色列表的展示*/}
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
                </Card>
            </div>

        )
    }
}
