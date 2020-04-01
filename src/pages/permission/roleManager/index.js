import React,{Component} from "react";
import { Card,Button,Modal } from 'antd';
import ETable from '../../../components/ETable';
import Utils from '../../../utils';
import axios from '../../../axios';
import RoleForm from './RoleForm';
import PermEditForm from './PermEditForm';
import RoleAuthForm from './RoleAuthForm';
const confirm = Modal.confirm;

export default class Permission extends Component{
    state={}
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        axios.ajax({
            url:'/sys/role/getAll',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list
                })
            }
        })
    }

    requestAclsTree = (roleId)=>{
        axios.ajax({
            url:'/sys/role/roleTree',
            data:{
                params:{roleId}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let roleTree  = Utils.getDataSource(res.data);
                this.setState({
                    roleTree,
                    detailInfo: this.state.selectedItem,
                    isPermVisible: true,
                    treeKey:Utils.getTreeKey(roleTree)
                })
            }
        })
    }

    // 角色创建
    handleRole = ()=>{
        this.setState({
            isRoleVisible:true
        })
    }

    handleDelete=()=>{
        if (!this.state.selectedItem) {
            Modal.info({
                title: '信息',
                content: '请选择一个角色'
            })
            return;
        }
        confirm({
            title: '确定删除?',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk:()=>{
                axios.ajax({
                    url:'/sys/role/delete',
                    data:{
                        params:{
                            id:this.state.selectedItem.id
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


    // 角色提交
    handleRoleSubmit = ()=>{
        let data = this.roleForm.props.form.getFieldsValue();
        this.roleForm.props.form.resetFields();
        axios.ajax({
            url:'/sys/role/save',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isRoleVisible:false
                })
                this.requestList();
            }
        })
    }

    handlePermission = ()=>{
        if (!this.state.selectedItem) {
            Modal.info({
                title: '信息',
                content: '请选择一个角色'
            })
            return;
        }
        this.requestAclsTree(this.state.selectedItem.id);
    }

    handlePermEditSubmit = ()=>{
        let data = this.roleForm.props.form.getFieldsValue();
        data.roleId = this.state.selectedItem.id;
        data.aclIds = this.state.treeKey.join(',');
        axios.ajax({
            url:'/sys/role/changeAcls',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isPermVisible:false
                })
                this.requestList();
            }
        })
    }

    // 用户授权
    handleUserAuth = ()=>{
        if (!this.state.selectedItem) {
            Modal.info({
                title: '信息',
                content: '未选中任何项目'
            })
            return;
        }
        this.getRoleUserList(this.state.selectedItem.id);
        this.setState({
            isUserVisible: true,
            isAuthClosed: false,
            detailInfo: this.state.selectedItem
        });
    }
    getRoleUserList = (id)=>{
        axios.ajax({
            url:'/userList.json',
            data:{
                params:{
                    id:id
                }
            }
        }).then((res)=>{
            if(res){
                this.getAuthUserList(res.result);
            }
        })
    }
    // 筛选目标用户
    getAuthUserList = (dataSource) => {
        const mockData = [];
        const targetKeys = [];
        if (dataSource && dataSource.length > 0) {
            for (let i = 0; i < dataSource.length; i++) {
                const data = {
                    key: dataSource[i].user_id,
                    title: dataSource[i].user_name,
                    status: dataSource[i].status,
                };
                if (data.status == 1) {
                    targetKeys.push(data.key);
                }
                mockData.push(data);
            }
        }
        this.setState({mockData, targetKeys});
    };

    patchUserInfo = (targetKeys) => {
        this.setState({
            targetKeys: targetKeys
        });
    };

    // 用户授权提交
    handleUserSubmit = ()=>{
        let data = {};
        data.user_ids = this.state.targetKeys || [];
        data.role_id = this.state.selectedItem.id;
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
                    isUserVisible:false
                })
                this.requestList();
            }
        })
    }


    render() {
        const columns = [
            {
                title: '角色ID',
                dataIndex: 'key',
                render(key) {
                    return key+1;
                }
            }, {
                title: '角色名称',
                dataIndex: 'name'
            },{
                title: '操作时间',
                dataIndex: 'operateTime',
                render: Utils.formatDate
            }, {
                title: '使用状态',
                dataIndex: 'status',
                render(status){
                    if (status == 1) {
                        return "启用"
                    } else {
                        return "停用"
                    }
                }
            },{
                title: '授权人',
                dataIndex: 'operator',
            }
        ];
        return (
            <div>
                <Card>
                    <Button type="primary" onClick={this.handleRole}>创建角色</Button>
                    <Button type="primary" onClick={this.handlePermission}>设置权限</Button>
                    <Button type="primary" onClick={this.handleDelete}>删除角色</Button>
                    {/*<Button type="primary" onClick={this.handleUserAuth}>用户授权</Button>*/}
                    <div style={{marginTop:20}}>
                    <ETable
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedIds={this.state.selectedIds}
                        selectedItem={this.state.selectedItem}
                        dataSource={this.state.list}
                        columns={columns}
                    />
                    </div>
                </Card>
                <Modal
                    title="创建角色"
                    visible={this.state.isRoleVisible}
                    onOk={this.handleRoleSubmit}
                    onCancel={()=>{
                        this.roleForm.props.form.resetFields();
                        this.setState({
                            isRoleVisible:false
                        })
                    }}
                >
                    <RoleForm wrappedComponentRef={(inst) => this.roleForm = inst }/>
                </Modal>
                <Modal
                    title="权限设置"
                    visible={this.state.isPermVisible}
                    width={600}
                    onOk={this.handlePermEditSubmit}
                    onCancel={()=>{
                        this.setState({
                            isPermVisible:false
                        })
                    }}>
                    <PermEditForm
                        wrappedComponentRef={(inst) => this.roleForm = inst }
                        detailInfo={this.state.detailInfo}
                        roleTree={this.state.roleTree}
                        checkKey={this.state.treeKey}
                        patchMenuInfo={(checkedKeys)=>{
                            this.setState({
                                treeKey: checkedKeys
                            });
                        }}
                    />
                </Modal>
                <Modal
                    title="用户授权"
                    visible={this.state.isUserVisible}
                    width={800}
                    onOk={this.handleUserSubmit}
                    onCancel={()=>{
                        this.setState({
                            isUserVisible:false
                        })
                    }}>
                    <RoleAuthForm
                        wrappedComponentRef={(inst) => this.userAuthForm = inst }
                        isClosed={this.state.isAuthClosed}
                        detailInfo={this.state.detailInfo}
                        targetKeys={this.state.targetKeys}
                        mockData={this.state.mockData}
                        patchUserInfo={this.patchUserInfo}
                    />
                </Modal>

            </div>
        );
    }
}