import React,{Component} from 'react';
import {Card, Row, Col, Tree, Button, Modal, Table} from 'antd';
import Utils from "../../../utils";
import axios from "../../../axios";
import DeptForm from "./DeptForm";
import UserRoleForm from "../userManager/UserRoleForm";
import DeptAreaForm from './DeptAreaForm';
import DeptGridForm from './DeptGridForm';
import DeptIndustryForm from './DeptIndustryForm';
import SupervisorForm from "../../supervision/enterprise/childrenForm/supervisorForm";
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;


export default class deptManager extends Component{
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
        this.requestData();
    }
    requestList = ()=>{
        axios.ajax({
            url:'/sys/dept/tree',
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
    requestData = ()=>{
        axios.ajax({
            url:'/sys/dept/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    deptList:list,
                    pagination:Utils.pagination(res,(current)=>{
                        this.params.pageNo = current;//	当前页数
                        this.requestData(); //刷新列表数据
                    })
                })
            }
        })
    }
    setRowClassName = (record) => {
        return record.id === this.state.rowId ? 'clickRowStyl' : '';
    }
    handleOperatorDept = (type,item)=>{
        if(type=='create'){
            this.setState({
                isDeptVisible:true,
                deptType:'add'
            })
        } else if(type=="edit"){
            this.setState({
                isDeptVisible:true,
                deptInfo:item,
                deptType:type
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
                        url:'/sys/dept/delete',
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

    handleOperator = (option,item) =>{
        if(option=='area'){
            axios.ajax({
                url:'/sys/dept/getAreaIds',
                data:{
                    params:{
                      deptId:item.id
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                      this.setState({
                          treeData:Utils.getDataSource(res.data.tree),
                          checkKey:res.data.checkKey,
                          isDeptAreaVisible:true,
                          deptId:item.id

                      })
                }
            })
        }else if(option=='grid'){
            axios.ajax({
                url:'/sys/dept/getGridIds',
                data:{
                    params:{
                        deptId:item.id
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    this.setState({
                        treeData:Utils.getDataSource(res.data.tree),
                        checkKey:res.data.checkKey,
                        isDeptGridVisible:true,
                        deptId:item.id
                    })
                }
            })
        }else if(option=='industry'){
            axios.ajax({
                url:'/sys/dept/getIndustryIds',
                data:{
                    params:{
                        deptId:item.id
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    this.setState({
                        treeData:res.data.tree,
                        checkKey:res.data.checkKey,
                        isDeptIndustryVisible:true,
                        deptId:item.id
                    })
                }
            })
        }else if(option=='leader'){
            this.setState({
                isDeptLeaderVisible:true,
                deptId:item.id
            })
        }
    }
    // 权限模块提交
    handleDeptSubmit = ()=>{
        let data = this.deptForm.props.form.getFieldsValue();
        let type = this.state.deptType;
        axios.ajax({
            url:type=='add'?'/sys/dept/save':'/sys/dept/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.deptForm.props.form.resetFields();
                this.setState({
                    isDeptVisible:false,
                    deptInfo:''
                })
                this.requestList();
                this.requestData();
            }
        })
    }
    handleDeptAreaSubmit=()=>{
        axios.ajax({
            url:'/sys/dept/changeArea',
            data:{
                params:{
                    deptId:this.state.deptId,
                    areaIds:this.state.checkKey.join(','),
                    halfIds:this.state.halfCheckedKeys.join(',')
                }
            }
        }).then((res)=>{
                this.setState({
                    isDeptAreaVisible: false,
                    checkKey: [],
                    treeData: [],
                    halfCheckedKeys: []
                })
        })
    }
    handleDeptGridSubmit=()=>{
        axios.ajax({
            url:'/sys/dept/changeGrid',
            data:{
                params:{
                    deptId:this.state.deptId,
                    gridIds:this.state.checkKey.join(',')
                }
            }
        }).then((res)=>{
            this.setState({
                isDeptGridVisible:false,
                checkKey:[],
                treeData:[]
            })
        })
    }
    handleDeptIndustrySubmit=()=>{
        axios.ajax({
            url:'/sys/dept/changeIndustry',
            data:{
                params:{
                    deptId:this.state.deptId,
                    industryIds:this.state.checkKey.join(',')
                }
            }
        }).then((res)=>{
            this.setState({
                isDeptIndustryVisible:false,
                checkKey:[],
                treeData:[]
            })
        })
    }
    handleDeptLeaderSubmit=(data)=>{
        axios.ajax({
            url:'/sys/dept/changeLeader',
            data:{
                params:{
                    deptId:this.state.deptId,
                    leaderId:data.id
                }
            }
        }).then((res)=>{
            this.setState({
                isDeptLeaderVisible:false,
            })
            this.requestData();
        })
    }

    render() {
        const DeptColumns = [
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
                        <Button type="primary" ghost size="small"  icon="edit" onClick={() => { this.handleOperatorDept('edit',item)}}/>
                        <Button type="danger" size="small"  icon="delete" onClick={() => { this.handleOperatorDept('delete',item)}}/>
                    </ButtonGroup>
                }}

        ];
        const UserColumns = [
            {
                title: '上级部门',
                dataIndex: 'parentId'
            },
            {
                title: '部门名称',
                dataIndex: 'name'
            },{
                title: '部门类型',
                dataIndex: 'type'
            },  {
                title: '管辖领导',
                dataIndex: 'leaderId'
            },{
                title: '操作',
                dataIndex:'operation',
                width:'40%',
                render:(text, item)=>{
                    return <ButtonGroup>
                        <Button type="primary" onClick={() => { this.handleOperator('area',item)}}>区域权限</Button>
                        {/*<Button type="primary" onClick={() => { this.handleOperator('grid',item)}}>网格权限</Button>*/}
                        <Button type="primary" onClick={() => { this.handleOperator('industry',item)}}>行业权限</Button>
                        {/*<Button type="primary" onClick={() => { this.handleOperator('leader',item)}}>管辖领导</Button>*/}
                    </ButtonGroup>
                }}
        ];
        return(
            <Card>
                <Row>
                    <Col span={6}>
                        <Card title='部门列表' extra={<Button type="primary" icon={'plus'} onClick={() => { this.handleOperatorDept('create',null)}}>添加</Button>}>
                            <Table
                                style={{marginTop:'-20px'}}
                                columns={DeptColumns}
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
                    <Col span={18}>
                        <Card title='部门列表' style={{marginLeft:'30px'}}>
                            <div style={{marginTop:25}}>
                                <Table
                                    columns={UserColumns}
                                    bordered
                                    dataSource={this.state.deptList||[]}
                                    pagination={this.state.pagination}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="部门管理"
                    visible={this.state.isDeptVisible}
                    onOk={this.handleDeptSubmit}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.deptForm.props.form.resetFields();
                        this.setState({
                            isDeptVisible:false,
                            deptInfo:''
                        })
                    }}
                >
                    <DeptForm deptInfo={this.state.deptInfo} deptList={Utils.getDataSource(this.state.list||[])} wrappedComponentRef={(inst) => this.deptForm = inst }/>
                </Modal>
                <Modal
                    title="选择区域"
                    visible={this.state.isDeptAreaVisible}
                    width={600}
                    destroyOnClose={true}
                    onOk={this.handleDeptAreaSubmit}
                    onCancel={()=>{
                        this.setState({
                            isDeptAreaVisible:false,
                            checkKey:[],
                            treeData:[],
                            halfCheckedKeys:[]
                        })
                    }}>
                    <DeptAreaForm
                        treeData={this.state.treeData||[]}
                        checkKey={this.state.checkKey||[]}
                        patchCheckKey={(checkedKeys,halfCheckedKeys)=>{
                            this.setState({
                                checkKey: checkedKeys,
                                halfCheckedKeys:halfCheckedKeys
                            });
                        }}
                    />
                </Modal>
                <Modal
                    title="选择网格"
                    visible={this.state.isDeptGridVisible}
                    width={600}
                    destroyOnClose={true}
                    onOk={this.handleDeptGridSubmit}
                    onCancel={()=>{
                        this.setState({
                            isDeptGridVisible:false,
                            checkKey:[],
                            treeData:[]
                        })
                    }}>
                    <DeptGridForm
                        treeData={this.state.treeData||[]}
                        checkKey={this.state.checkKey||[]}
                        patchCheckKey={(checkedKeys)=>{
                            this.setState({
                                checkKey: checkedKeys
                            });
                        }}
                    />
                </Modal>
                <Modal
                    title="选择行业"
                    visible={this.state.isDeptIndustryVisible}
                    width={600}
                    destroyOnClose={true}
                    onOk={this.handleDeptIndustrySubmit}
                    onCancel={()=>{
                        this.setState({
                            isDeptIndustryVisible:false,
                            checkKey:[],
                            treeData:[]
                        })
                    }}>
                    <DeptIndustryForm
                        treeData={this.state.treeData||[]}
                        checkKey={this.state.checkKey||[]}
                        patchCheckKey={(checkedKeys)=>{
                            this.setState({
                                checkKey: checkedKeys
                            });
                        }}
                    />
                </Modal>
                <Modal
                    width='700px'
                    title="人员信息列表"
                    visible={this.state.isDeptLeaderVisible}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isDeptLeaderVisible:false
                        })
                    }}
                >
                    <SupervisorForm dispatchSupervisor={(data)=>{this.handleDeptLeaderSubmit(data);}}/>
                </Modal>
            </Card>
        );
    }
}