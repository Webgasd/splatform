import React,{Component} from 'react';
import {Modal, Card, Button, Row, Col, Collapse} from 'antd';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import BaseForm  from '../../../../components/BaseForm';
import {changeSamplingdeploy, clearSamplingdeploy} from "../../../../redux/action";


const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '检测机构全称',
        field: 'enterprise'
    },{
        type: 'INPUT',
        label: '简称',
        field: 'nickname'
    }
]
@connect(
    state=>({
        input:state.samplingdeploy
    }),{
        clearSamplingdeploy,
        changeSamplingdeploy
    }
)
class Dsamplingdeploy extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/spotCheckEnterprise/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                console.log(list)
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
    handleRequest = () => {
        this.params = {pageNo:1}
        this.requestList();
    }
    handleDetailSubmit = ()=>{
        let type =this.state.type;
        axios.PostAjax({
            url:type=='create'?'/spotCheckEnterprise/insert':'/spotCheckEnterprise/update',
            data:{
                params:{
                    ...this.props.input
                }
            }

        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false //关闭弹框
                })
                this.props.clearSamplingdeploy();
                //window.location.href = '#/login';
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
                content: '请选择一个用户'
            })
            return;
        }
        Modal.confirm({
            content:'确定要删除此用户吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/spotCheckEnterprise/delete',
                    data:{
                        params:{
                            id: item.id
                        }
                    }
                }).then((res)=>{
                    if(res.status == "success"){
                        _this.setState({
                            isVisible:false
                        })
                        _this.requestList();
                    }
                })
            }
        })
    }
    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'添加',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                userInfo:item,
                isVisible:true,
                type
            })
            this.props.changeSamplingdeploy({...item,document:JSON.parse(item.document||JSON.stringify([]))});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/spotCheckEnterprise/delete',
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
        }else if(type=="check"){
            Modal.confirm({
                content:'确定要审核通过吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/spotCheckEnterprise/check',
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
    render(){
        const columns = [
            {
                title:"检测机构全称",
                dataIndex:"enterpriseName"
            },{
                title:"社会信用代码证",
                dataIndex:"number"
            },{
                title:"注册地址",
                dataIndex:"address"
            },{
                title:"负责人",
                dataIndex:"enterpriseCharger"
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    return (<Row>
                        <Col span={6}><div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div></Col>
                        <Col span={6}><div className="textButton" onClick={()=>{this.handleOperator('edit',item)}}>修改</div></Col>
                        <Col span={6}><div className="textButton" onClick={()=>{this.handleOperator('delete',item)}}>删除</div></Col>
                    </Row>)
                }
            }
        ];
        let footer = {};
        if(this.state.type == 'detail'){
            footer = {
                footer: null
            }
        }
        return(
            <div ref="samplingdeploy">
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
                <Modal {...footer}
                       width='800px'
                       maskClosable={false}
                       getContainer={()=>this.refs.samplingdeploy}
                       title={this.state.title}
                       visible={this.state.isVisible}
                       onOk={this.handleDetailSubmit}
                       onCancel={()=>{
                           this.props.clearSamplingdeploy();
                           this.setState({
                               isVisible:false,
                           })
                       }}
                >
                    <DetailForm type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}
export default Dsamplingdeploy;