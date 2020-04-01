import React,{Component} from 'react';
import {Card, Row, Col, Tree, Button,Modal, Radio} from 'antd';
import menu_config from '../../../components/NavLeft/menuConfig';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from "./AddForm";
const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;


const columns = [
    {
        title: '导航名称',
        dataIndex: 'title'
    }, {
        title: '排序',
        dataIndex: 'order'
    },{
        title: '父级导航',
        dataIndex: 'parentNavigation'
    }, {
        title: '所属菜单',
        dataIndex: 'parentMenu'
    }, {
        title: '创建时间',
        dataIndex: 'establishTime'
    }, {
        title: '操作',
        dataIndex: 'operation',
    }

];


export default class menuConfig extends Component{
     state={}
    params = {
        page:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/menuList.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.result.menuList.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;
                        _this.requestList();
                    })
                })
            }
        })
    }

    handleAdd = ()=>{
        this.setState({
            isAddVisible:true
        })
    }
    handleAddSubmit = ()=>{
        let data = this.addForm.props.form.getFieldsValue();
        axios.ajax({
            url:'/post.json',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isAddVisible:false
                })
                this.requestList();
            }
        })
    }

    renderTreeNodes = (data,key='') => {
        return data.map((item) => {
            let parentKey = key+item.key;
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={parentKey} dataRef={item} >
                        {this.renderTreeNodes(item.children,parentKey)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode TreeNode {...item}/>
                );
            }
        });
    };

    render() {
        return(
            <Card>
            <Row>
                <Col span={4}>
                    <DirectoryTree
                        multiple
                    >
                        {this.renderTreeNodes(menu_config)}
                    </DirectoryTree>
                </Col>
                <Col span={20}>
                    <Card title='后台配置'>
                        <div className='button-box'>
                            <Button type="primary" onClick={this.handleAdd}>添加</Button>
                            <Button type="primary" >删除</Button>
                        </div>
                        <div style={{marginTop:25}}>
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
                </Col>
            </Row>
                <Modal
                    width='800px'
                    title="添加菜单信息"
                    visible={this.state.isAddVisible}
                    onOk={this.handleAddSubmit}
                    onCancel={()=>{
                        this.addForm.props.form.resetFields();
                        this.setState({
                            isAddVisible:false
                        })
                    }}
                >
                    <AddForm wrappedComponentRef={(inst) => this.addForm = inst }/>
                </Modal>
            </Card>
        );
    }
}