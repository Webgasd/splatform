import React,{Component} from 'react';
import {Card, Button, Modal, Collapse} from 'antd';
import ETable from '../ETable';
import Utils from "../../utils";
import axios from "../../axios";
import AddForm from './AddForm';
import BaseForm from "../BaseForm";
const ButtonGroup = Button.Group;
const Panel = Collapse.Panel;
export default class CommonPage extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column
    };
    params = {
        pageNo:1
    }

    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:this.props.baseUrl+'/getPage',
            data:{
                params:{..._this.params}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
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
        let type = this.state.type;
        let data = this.addForm.props.form.getFieldsValue();//获取表单的值
        axios.ajax({
            url:type=='create'?this.props.baseUrl+'/insert':this.props.baseUrl+'/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false ,
                    addInfo:{}
                })
                this.addForm.props.form.resetFields();//表单重置
                this.requestList();
            }
        })
    }
    handleDelete = ()=>{
        let item = this.state.selectedItem;
        let _this = this;
        if(!item){
            Modal.info({
                title: '信息',
                content: '请选择信息'
            })
            return;
        }
        Modal.confirm({
            content:'确定删除？',
            onOk:()=>{
                axios.ajax({
                    url:this.props.baseUrl+'/delete',
                    data:{
                        params:{
                            id:item.id
                        }
                    }
                }).then((res)=>{
                    if(res.status == 'success'){
                        _this.setState({
                            isVisible:false
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
    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'创建',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'编辑':'查看详情',
                isVisible:true,
                addInfo:item,
                type
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:this.props.baseUrl+ '/delete',
                        data: {
                            params: {
                                id: item.id
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
        const baseColumns = this.props.baseColumns||[];
        const quireList = this.props.quireList||[];
        const formList = this.props.formList||[];
        const columns = [
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <ButtonGroup>
                        <Button type="primary"  onClick={() => { this.handleOperator('detail',record)}}>查看</Button>
                        <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>修改</Button>
                        <Button type="primary"  onClick={() => {this.handleOperator('delete',record)}}>删除</Button>
                    </ButtonGroup>
                }
            }
        ];

        return (
            <div>
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={quireList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={() => {this.handleOperator('create',null)}}>添加</Button>
                        {/* <Button type="primary" onClick={this.handleDelete}>删除</Button> */}
                    </div>
                    <div style={{marginTop:30}}>
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                            columns={baseColumns.concat(columns)}
                            row_selection = 'checkbox'
                        />
                    </div>
                </Card>
                <Modal
                    width='500px'
                    maskClosable={false}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            addInfo:{}
                        })
                    }}
                >
                    <AddForm formList={formList} addInfo={this.state.addInfo||{}} wrappedComponentRef={(inst) => this.addForm = inst }/>
                </Modal>

            </div>
        );
    }
}

