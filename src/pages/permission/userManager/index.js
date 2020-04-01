import React,{Component} from "react";
import {Card, Button, Table, Modal} from 'antd';
import Utils from '../../../utils';
import axios from '../../../axios';
import BaseForm from "../../../components/BaseForm";
import UserForm from "./UserForm";
import UserRoleForm from "./UserRoleForm";
import ChangePsdForm from './ChangePsdForm';
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

const formList = [
    {
        type: 'INPUT',
        label: '用户名',
        field: 'username'
    }, {
        type: 'INPUT',
        label: '账号',
        field: 'loginName'
    },{
        type: 'SELECT',
        label: '用户类型',
        field: 'userType',
        placeholder: '请选择用户类型',
        width: 150,
        list: [{id: 0, name: '管理员'}, {id: 1, name: '企业用户'},{id: 2, name: '政府人员'},{id: 3, name: '企业人员用户'},{id: 4, name: '快检机构用户'},{id: 5, name: '抽检机构用户'}]
    }
]

export default class UserManger extends Component{
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
        this.requestRoleTree();
    }
    requestList = ()=>{
        let _this=this;
        axios.ajax({
            url:'/sys/user/getPage',
            data:{
                params:this.params
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
    requestRoleTree = ()=>{
        axios.ajax({
            url:'/sys/role/list',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let roleTree  = res.data;
                this.setState({
                    roleTree
                })
            }
        })
    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    handleOperator = (type,item)=>{
        if(type=="edit"){
            this.setState({
                isUserVisible:true,
                userInfo:item,
                userType:type
            })
            return;

        }else if(type=="role"){
            axios.ajax({
                url:'/sys/user/userRole',
                data:{
                    params:{userId:item.id}
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    let userRoleList  = res.data;
                    this.setState({
                        userInfo:item,
                        checkKey:Utils.getListKey(userRoleList),
                        isUserRoleVisible:true
                    })
                }
            })
            return;
        }
        else if(type=="delete"){
            confirm({
                title: '确定删除?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/sys/user/delete',
                        data:{
                            params:{
                                userId:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status =='success'){
                            this.requestList();
                        }
                    })
                }
            })
        }else if(type=="psd"){
            this.setState({
                isPsdVisible:true,
                userInfo:item,
                userType:type
            })
            return;

        }
    }

    handleUser = (type)=>{
        if(type=='add') {
            this.setState({
                isUserVisible: true,
                userType: 'add'
            })
        }else if(type=='delete'){
            confirm({
                title: '确定删除?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/sys/dept/delete',
                        data:{
                            params:{
                                id:this.state.selectedIds
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
    // 提交
    handleUserSubmit = ()=>{
        let data = this.userForm.props.form.getFieldsValue();
        let type = this.state.userType;
        axios.ajax({
            url:type=='add'?'/sys/user/save':'/sys/user/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.userForm.props.form.resetFields();
                this.setState({
                    isUserVisible:false,
                    userInfo:''
                })
                this.requestList();
            }
        })
    }
    handleUserRoleSubmit = ()=>{
        let userId = this.state.userInfo.id;
        let roleIds = this.state.checkKey.join(',');
        axios.ajax({
            url:'/sys/user/changeRole',
            data:{
                params:{
                   userId,roleIds
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isUserRoleVisible:false
                })
                this.requestList();
            }
        })
    }
    handlePsdSubmit=()=>{
        let data = this.psdForm.props.form.getFieldsValue();
        if(data.inputPsd===data.confirmPsd){
            axios.ajax({
                url:'/sys/user/changePsd',
                data:{
                    params:{
                        id:this.state.userInfo.id,
                        password:data.inputPsd
                    }
                }
            }).then((res)=>{
                if(res){
                    this.psdForm.props.form.resetFields();
                    this.setState({
                        isPsdVisible:false,
                        userInfo:''
                    })
                    this.requestList();
                }
            })
        }else{
            alert("密码不一致");
        }
    }


    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            }, {
                title: '账号',
                dataIndex: 'loginName'
            },{
                title: '用户类型',
                dataIndex: 'userType',
                render(userType){
                        return {
                            0:'管理员',1:'企业用户',2:'政府人员',3:'企业人员用户',4:'快检机构人员',5:'抽检机构人员'
                        }[userType]
                    }
            }, {
                title: '时间',
                dataIndex: 'operateTime',
                render: Utils.formatDate
            }, {
                title: '使用状态',
                dataIndex: 'status',
                render(status){
                    if (status == 0) {
                        return "启用"
                    } else {
                        return "停用"
                    }
                }
            },{
                title: '授权人',
                dataIndex: 'operator',
            },
            {
               title: '操作',
                  dataIndex:'operation',
               render:(text, item)=>{
             return <ButtonGroup>
                 <Button  type="primary" onClick={() => { this.handleOperator('role',item)}}>分配角色</Button>
                 <Button  type="primary" onClick={()=> {this.handleOperator('edit',item)}}>编辑</Button>
                 <Button  type="primary" onClick={()=> {this.handleOperator('psd',item)}}>修改密码</Button>
                 <Button  type="primary" onClick={() => {this.handleOperator('delete',item)}}>删除</Button>
             </ButtonGroup>
         }}
        ];
        return (
            <div>
                <Card>
                    <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                </Card>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                    <Button type="primary" onClick={()=>this.handleUser('add')}>创建用户</Button>
                    <Button type="primary" onClick={()=>this.handleUser('delete')}>删除用户</Button>
                    </div>
                    <div style={{marginTop:30}}>
                        <Table
                            rowSelection={{type:'checkbox'}}
                            bordered
                            rowKey={'id'}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                            columns={columns}
                        />
                    </div>
                </Card>
                <Modal
                    title="用户管理"
                    visible={this.state.isUserVisible}
                    onOk={this.handleUserSubmit}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isUserVisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <UserForm userInfo={this.state.userInfo} wrappedComponentRef={(inst) => this.userForm = inst }/>
                </Modal>
                <Modal
                    title="选择角色"
                    visible={this.state.isUserRoleVisible}
                    width={600}
                    onOk={this.handleUserRoleSubmit}
                    onCancel={()=>{
                        this.setState({
                            isUserRoleVisible:false
                        })
                    }}>
                    <UserRoleForm
                        roleTree={this.state.roleTree||[]}
                        checkKey={this.state.checkKey}
                        patchCheckKey={(checkedKeys)=>{
                            this.setState({
                                checkKey: checkedKeys
                            });
                        }}
                    />
                </Modal>
                <Modal
                    title="更改密码"
                    visible={this.state.isPsdVisible}
                    width={400}
                    onOk={this.handlePsdSubmit}
                    onCancel={()=>{
                        this.psdForm.props.form.resetFields();
                        this.setState({
                            isPsdVisible:false
                        })
                    }}>
                    <ChangePsdForm wrappedComponentRef={(inst) => this.psdForm = inst } />
                </Modal>
            </div>
        );
    }
}