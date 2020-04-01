import React,{Component} from 'react';
import {Card, Row, Col, Button, Table, Modal} from 'antd';
import Utils from "../../../utils";
import axios from "../../../axios";
import AclsForm from "./AclsForm";
import ModuleForm from "./ModuleForm";
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;



export default class permManager extends Component{
    state={
        pictureList:[]
    }
    params = {
        page:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{;
        axios.ajax({
            url:'/sys/aclModule/tree',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data;
                this.setState({
                    list:list
                })
            }
        })
    }
    handleOperatorModule = (type,item)=>{
        if(type=="edit"){
            this.setState({
                isModuleVisible:true,
                moduleInfo:item,
                moduleType:type,
                pictureList:JSON.parse(item.picture)
            })
           return;
        }else if(type=="delete"){
            confirm({
                    title: '确定删除?',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                 onOk:()=>{
                    axios.ajax({
                        url:'/sys/aclModule/delete',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status =='success'){
                            this.requestList();
                        }
                    })
                }
            })
        }
    }
    handleOperatorAcls = (type,item)=>{
        if(type=="edit"){
            this.setState({
                isAclsVisible:true,
                aclsInfo:item,
                aclsType:type
            })
            return;

        }else if(type=="delete"){
            confirm({
                title: '确定删除?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/sys/acl/delete',
                        data:{
                            params:{
                                aclId:item.id
                            }
                        }
                    }).then((res)=>{

                        if(res.status =="success"){
                            this.requestData(this.state.rowId);

                        }
                    })
                }
            })
        }
    }

    requestData = (aclModuleId)=>{
    //    let _this = this;
        axios.ajax({
            url:'/sys/acl/page',
            data:{
                params:{aclModuleId}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data.data;
                this.setState({
                    aclsData:list
                })
            }
        })
    }
    setRowClassName = (record) => {
        return record.id === this.state.rowId ? 'clickRowStyl' : '';
    }

    handleAclsAdd = ()=>{
        this.setState({
            isAclsVisible:true,
            aclsType:'add'
        })
    }

    // 权限点提交
    handleAclsSubmit = ()=>{
        let data = this.aclsForm.props.form.getFieldsValue();
        let type = this.state.aclsType;
        axios.ajax({
            url:type=='add'?'/sys/acl/save':'/sys/acl/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res.status == 'success'){
                this.aclsForm.props.form.resetFields();
                this.requestData(data.aclModuleId);
                this.setState({
                    isAclsVisible:false,
                    aclsInfo:''
                })
            }
        })
    }

    handleModuleAdd = ()=>{
        this.setState({
            isModuleVisible:true,
            moduleType:'add'
        })
    }

    // 权限模块提交
    handleModuleSubmit = ()=>{
        let data = this.moduleForm.props.form.getFieldsValue();
        let type = this.state.moduleType;
        axios.PostAjax({
            url:type=='add'?'/sys/aclModule/save':'/sys/aclModule/update',
            data:{
                params:{
                    ...data,
                    picture:this.state.pictureList
                }
            }
        }).then((res)=>{
            if(res){
                this.moduleForm.props.form.resetFields();
                this.setState({
                    isModuleVisible:false,
                    moduleInfo:''
                })
                this.requestList();
            }
        })
    }





    render() {
        const ModuleColumns = [
            {
                dataIndex: 'name',
                width:'60%',
                align:'left'
            },
            {
                dataIndex:'operation',
                width:'40%',
                render:(text, item)=>{
                    return <ButtonGroup>
                        <Button type="primary" ghost size="small"  icon="edit" onClick={() => { this.handleOperatorModule('edit',item)}}/>
                        <Button type="danger" size="small"  icon="delete" onClick={() => { this.handleOperatorModule('delete',item)}}/>
                    </ButtonGroup>
                }}

        ];
        const AclsColumns = [
            {
                title: '权限名称',
                width:'20%',
                dataIndex: 'name'
            }, {
                title: '权限模块',
                width:'20%',
                dataIndex: 'aclModuleId'
            },{
                title: '类型',
                width:'15%',
                dataIndex: 'type',
                render(type){
                    return{
                        1:'菜单',2:'按钮'
                    }[type]
                }
            }, {
                title: 'URL',
                width:'20%',
                dataIndex: 'url'
            }, {
                title: '状态',
                width:'10%',
                dataIndex: 'status',
                render(status){
                    return{
                        1:'开启',2:'关闭'
                    }[status]
                }
            }, {
                title: '操作',
                width:'15%',
                dataIndex: 'operation',
                render:(text, item)=>{
                    return <ButtonGroup>
                        <Button type="primary" ghost size="small"  icon="edit" onClick={() => { this.handleOperatorAcls('edit',item)}}/>
                        <Button type="danger" size="small"  icon="delete" onClick={() => { this.handleOperatorAcls('delete',item)}}/>
                    </ButtonGroup>


                }
            }

        ];
        return(
            <Card>
                <Row>
                    <Col span={7}>
                        <Card title='权限模块列表' extra={<Button type="primary" icon={'plus'} onClick={this.handleModuleAdd}/>}>
                        <Table
                            style={{marginTop:'-20px'}}
                            columns={ModuleColumns}
                            childrenColumnName='childrenList'
                            dataSource={Utils.getDataSource(this.state.list||[])}
                            pagination={false}
                            indentSize={30}
                            size="middle"
                            rowKey={'id'}
                            rowClassName={this.setRowClassName}
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        if(!record.hasOwnProperty('childrenList')){
                                            this.requestData(record.id);
                                            this.setState({
                                                rowId: record.id
                                            })
                                        }
                                    }
                                };
                            }}
                        />
                        </Card>
                    </Col>
                    <Col span={17}>
                        <Card title='权限点列表'
                              extra={<Button type="primary" icon={'plus'} onClick={this.handleAclsAdd}>添加</Button>}
                              style={{marginLeft:'30px'}}>
                            <div style={{marginTop:25}}>
                                <Table
                                    columns={AclsColumns}
                                    bordered
                                    rowKey={'id'}
                                    dataSource={this.state.aclsData||[]}
                                    pagination={false}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="权限点"
                    visible={this.state.isAclsVisible}
                    onOk={this.handleAclsSubmit}
                    onCancel={()=>{
                        this.aclsForm.props.form.resetFields();
                        this.setState({
                            isAclsVisible:false,
                            aclsInfo:''
                        })
                    }}
                >
                    <AclsForm aclsInfo={this.state.aclsInfo} moduleList={Utils.getDataSource(this.state.list||[])} wrappedComponentRef={(inst) => this.aclsForm = inst }/>
                </Modal>
                <Modal
                    title="权限模块"
                    visible={this.state.isModuleVisible}
                    onOk={this.handleModuleSubmit}
                    onCancel={()=>{
                        this.moduleForm.props.form.resetFields();
                        this.setState({
                            isModuleVisible:false,
                            moduleInfo:'',
                            pictureList:[]
                        })
                    }}
                >
                    <ModuleForm moduleInfo={this.state.moduleInfo}
                                pictureList={this.state.pictureList||[]}
                                patchPictureList={(pictureList)=>{
                                    this.setState({
                                        pictureList: pictureList
                                    });
                                }}
                                moduleList={Utils.getDataSource(this.state.list||[])}
                                wrappedComponentRef={(inst) => this.moduleForm = inst }/>
                </Modal>
            </Card>
        );
    }
}