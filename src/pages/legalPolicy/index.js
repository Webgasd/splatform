import React, { Component } from 'react'
import {Button,Card,Collapse,Table,Modal} from 'antd'
import  BaseForm  from '../../components/BaseForm';
import Utils from "../../utils";
import axios from "../../axios";
import DetailForm from './DetailForm';
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group

const formList = [
    {
        type: 'SELECT',
        label: '文库分类',
        placeholder: '请选择文库种类',
        field: 'workType',
        width: 150,
        list: [{id: 0, name: '0'}, {id: 1, name: '1'}]
    },
    {
        type: 'SELECT',
        label: '主题分类',
        placeholder: '请选择主题种类',
        field: 'workType',
        width: 150,
        list: [{id: 0, name: '0'}, {id: 1, name: '1'}]
    },
    {
        type: 'SELECT',
        label: '业务分类',
        placeholder: '请选择业务种类',
        field: 'workType',
        width: 150,
        list: [{id: 0, name: '0'}, {id: 1, name: '1'}]
    },
    {
        type: 'INPUT',
        label: '请输入关键词',
        field: 'workType',
        width: 150,
    },
    {
        type: 'SELECT',
        label: '检索类型',
        placeholder: '请选择检索类型',
        field: 'workType',
        width: 150,
        list: [{id: 0, name: '标题'}, {id: 1, name: '内容'}, {id: 2, name: '附件'}]
    },
]

export default class LegalPolicy extends Component {
    
    state = {
        //查看拟态框的状态
        isVisible:false,
        title:'',
        list:[
            {
                key:1,
                type:'1',
                title:'1',
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
            },
            {
                key:2,
                type:'1',
                title:'1',
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
            }
        ]
    }
    //查询条件
    params = {
        pageNo:1
    }

    componentDidMount(){
        // this.requestList();
    }
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
    //获取全库分类
    getPoolType = (params) => {
        let _this = this
        axios.ajax({
            url:'',
            data:{
                params:{}
            }
        }).then((res) => {
            if(res.status == 'success'){
                console.log('接口调用成功')
            }
        })
    }
    //获取法律分类
    getLowType = (params) => {
        let _this = this
        axios.ajax({
            url:'',
            data:{
                params:{}
            }
        }).then((res) => {
            if(res.status == 'success'){
                console.log('接口调用成功')
            }
        })
    }
    //获取业务分类
    getBusinessType = (params) => {
        let _this = this
        axios.ajax({
            url:'',
            data:{
                params:{}
            }
        }).then((res) => {
            if(res.status == 'success'){
                console.log('接口调用成功')
            }
        })
    }
    //查询
    handleFilterSubmit = (params) => {
        this.params = params;
        this.requestList()
    }
    
    render() {
        const columns = [
            {
                title: '文库分类',
                dataIndex: 'type',
                key:'type'
            },
            {
                title: '主题分类',
                dataIndex: ''
            },
            {
                title: '标题',
                dataIndex: 'title',
                key:"title"
            },
            {
                title: '业务分类',
                dataIndex: ''
            },
            {
                title: '文号',
                dataIndex: ''
            },
            {
                title: '发布日期',
                dataIndex: ''
            },
            {
                title: '检索情况',
                dataIndex: '',
                render:(text,record) => {
                    return <p style={{margin:0}}>命中{}条</p>
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text,record) => {
                    return <ButtonGroup>
                        <Button type='primary' onClick={() => {this.setState({isVisible:true,title:record.title})}}>查看</Button>
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
                    <div style={{marginTop:10}}>
                        <Table
                        bordered
                        dataSource={this.state.list}
                        defaultExpandAllRows={true}
                        // pagination={this.state.pagination}
                        columns={columns}
                        expandedRowRender={ record => {
                        return(<p style={{margin:0,textAlign: "left"}}>题注：{record.description}</p>)}}
                        />
                    </div>
                </Card>
                <Modal
                width='1000px'
                title= {'法律法规'+ '>' + this.state.title }
                visible={this.state.isVisible}
                onOk={() => {
                    this.setState({
                        isVisible:false
                    })
                }}
                destroyOnClose={true}
                onCancel={()=>{
                    this.setState({
                        isVisible:false
                    })
                }}
                >
                    <DetailForm/>
                </Modal>
            </div>
        )
    }
}