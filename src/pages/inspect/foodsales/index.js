import React,{Component} from 'react';
import { Card,Button,Tabs, Form, Input, Select,Radio,Row,Col, Badge,Modal, DatePicker ,Collapse, message } from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm'
import "./style.less"

const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;
const RadioGroup=Radio.Group;
// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
    {
        type: 'SELECT',
        label: '年度',
        field: 'year',
        list: [{id: '0', name: '2019'}, {id: '1', name: '2018'}, {id: '2', name: '2017'}]
    },  {
        type: 'SELECT',
        label: '检查类型',
        field: 'kind',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '日常检查'}, {id: '1', name: '双随机'}, {id: '2', name: '专项检查'}]
    },
    {
        type: 'SELECT',
        label: '所在区域',
        field: 'area',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '黄岛区'}, {id: '1', name: '市南区'}, {id: '2', name: '市北区'}]
    },
    {
        type: 'INPUT',
        label: '被检单位(对象)',
        field: 'checkclass',
    },
    {
        type: 'INPUT',
        label: '检查人员',
        field: 'person',
    },
    {
        type: 'TIME',
        label: '检查日期',
        field: 'date',
    },
    {
        type: 'SELECT',
        label: '完成情况',
        field: 'achieve',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '正在检查'}, {id: '1', name: '已完成'}]
    },
    {
        label: '检查结果',
    },
    {
        type: 'CHECKBOX',
        label: '检查结果',
        field: 'result',
    },
    {
        type: 'CHECKBOX',
        label: '结果处理',
        field: 'resultdeal',
    },
    {
        type: 'SELECT',
        label: '巡查频次',
        field: 'rate',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '1次'}, {id: '1', name: '2次'}]
    },
    {
        type: 'INPUT',
        label: '本年度第_次检查',
        field: 'num',
    },
    {
        type: 'SELECT',
        label: '是否整改复查',
        field: 'rate',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '是'}, {id: '1', name: '否'}]
    }
]


export default class smallcatering extends Component{
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
        axios.ajax({
            url:'/inspect/dailyFood/getPage',
            data:{
                params:{
                    industry:1
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    //let list  = res.result.item_list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        //   _this.params.page = current;//	当前页数
                        _this.params.pageNo = current;
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

    handleAdd = ()=>{
        this.setState({
            isAddVisible:true
        })
    }

    handleAddSubmit = ()=>{
        let data = this.addForm.props.form.getFieldsValue();//获取表单的值
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
                    isAddVisible:false //关闭弹框
                })
                this.requestList();
            }
        })
    }

    handleSubmit = ()=>{
        let data = this.userForm.props.form.getFieldsValue();//获取表单的值
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
                    isVisible:false //关闭弹框
                })
                this.requestList();
            }
        })
    }


    start = () => {
        this.setState({
            selectedRowKeys: [],
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
                    url:'/post.json',
                    data:{
                        params:{
                            id:item.id
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
    handleDelete1 = (index)=>{
        Modal.confirm({
            title:'确认',
            content:'您确认要删除此条数据吗？',
            onOk:()=>{
                message.success('删除成功');
                this.requestList(); }
        })
    }

    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleOperator = (type,item)=>{
        if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                isVisible:true,
                userInfo:item,
                type
            })
        }
    }
    handleDaily = (item) =>{
        this.setState({
            title:'日志',
            isDvisible:true,
            userInfo:item,
        })
    }


    render() {
        const columns = [
            {
                title: '年度',
                dataIndex: 'year',

            },{
                title: '所属区域',
                dataIndex: 'area',
            },
            {
                title: '被检单位（对象）',
                dataIndex: 'checkclass',
            },
            {
                title: '检查日期',
                dataIndex: 'date',
            },
            {
                title: '检查人员',
                dataIndex: 'person',
            },
            {
                title: '检查结果',
                dataIndex: 'result',
            },
            {
                title: '结果处理',
                dataIndex: 'resultdeal',
            },
            {
                title: '巡查频次',
                dataIndex: 'rate',
            },
            {
                title: '本年度第_次检查',
                dataIndex: 'num',
            },
            {
                title: '是否整改复查',
                dataIndex: 'yn',
            },
            {
                title: '完成情况',
                dataIndex: 'achieve',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, item) => {
                    return <Row>
                        <Col span={12}>
                            <Button type="primary" size="small" onClick={() => { this.handleOperator('detail',item)}}>查看</Button>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" size="small" onClick={() => {
                                this.handleDaily(item.key)
                            }}>日志</Button>
                        </Col>
                    </Row>
                }
            }
        ];


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
                    <div className='button-box'>
                        <Button type="primary" onClick={this.handleAdd}>添加</Button>
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
                            row_selection = 'checkbox'
                        />
                    </div>
                </Card>
                <Modal
                    visible={this.state.isAddVisible}
                    width={800}
                    title="小餐饮监督检查"
                    onCancel={()=>{
                        // this.userForm.props.form.resetFields();
                        this.setState({
                            isAddVisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <AddForm  userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.addForm = inst }/>
                </Modal>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    width={800}
                    onCancel={()=>{
                        //     this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <ViewForm  userInfo={this.state.userInfo} type={this.state.type} dispatchState={(data)=>{this.setState({detailData:data})}} wrappedComponentRef={(inst) => this.detailForm = inst }/>
                </Modal>
                <Modal
                    title={this.state.title}
                    visible={this.state.isDvisible}
                    width={800}
                    onCancel={()=>{
                        //  this.userForm.props.form.resetFields();
                        this.setState({
                            isDvisible:false,
                            userInfo:''
                        })
                    }}
                >
                </Modal>
            </div>
        )
    }
}

class ViewForm extends Component{
    state = {
        kind:this.props.userInfo.kind,
        checkclass: this.props.userInfo.checkclass,
        area:this.props.userInfo.area,
        grid:this.props.userInfo.grid,
        caddress:this.props.userInfo.caddress,
        permitnum:this.props.userInfo.permitnum,
        principal:this.props.userInfo.principal,
        mechanism:this.props.userInfo.mechanism,
        phonenum:this.props.userInfo.phonenum,
        accompanying:this.props.userInfo.accompanying,
        lawperson:this.props.userInfo.lawperson,
        lawnum:this.props.userInfo.lawnum,
        date:this.props.userInfo.date,
        lasttime:this.props.userInfo.lasttime,
        // issuedate:this.props.userInfo.issuedate,
        //train:"已培训"
    };

    handleKind=(event)=>{
        this.setState({
            kind:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleCheckclass=(event)=>{
        this.setState({
            checkclass:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleArea=(event)=>{
        this.setState({
            area:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleGrid=(event)=>{
        this.setState({
            grid:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleCaddress=(event)=>{
        this.setState({
            caddress:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handlePermitnum=(event)=>{
        this.setState({
            permitnum:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handlePrincipal=(event)=>{
        this.setState({
            principal:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleMechanism=(event)=>{
        this.setState({
            mechanism:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handlePhonenum=(event)=>{
        this.setState({
            phonenum:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleAccompanying=(event)=>{
        this.setState({
            accompanying:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleLawperson=(event)=>{
        this.setState({
            lawperson:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleLawnum=(event)=>{
        this.setState({
            lawnum:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleDate=(event)=>{
        this.setState({
            date:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }
    handleLasttime=(event)=>{
        this.setState({
            lasttime:event.target.value
        },()=>{this.props.dispatchState(this.state)})
    }

    render() {

        //const handleInputChange = this.props.handleInputChange.bind(this)
        // const { getFieldDecorator } = this.props.form;
        // const formItemLayout = {
        //     labelCol: {span: 5},
        //     wrapperCol: {span: 16}
        // };
        // const userInfo = this.props.userInfo || {};
        const type = this.props.type;
        return (
            <div>
                <Tabs>
                    <TabPane tab="1.基本信息" key="1">
                        <table>
                            <tbody>
                            <tr>
                                <td >检查对象类型</td>
                                <select value={this.state.kind}readOnly={type=='detail'?true:false} onChange={this.handleKind}>
                                    <option value={1}>aaa</option>
                                    <option value={2}>bbb</option>
                                </select>
                                <td>被检查对象</td>
                                <select value={this.state.checkclass}readOnly={type=='detail'?true:false} onChange={this.handleCheckclass}>
                                    <option value={1}>aaa</option>
                                    <option value={2}>bbb</option>
                                </select>
                            </tr>
                            <tr>
                                <td>所属区域</td>
                                <td>
                                    <select value={this.state.area}readOnly={type=='detail'?true:false} onChange={this.handleArea}>
                                        <option value={1}>aaa</option>
                                        <option value={2}>bbb</option>
                                    </select>
                                </td>
                                <td>所属网格</td>
                                <td>
                                    <select value={this.state.grid}readOnly={type=='detail'?true:false} onChange={this.handleGrid}>
                                        <option value={0}>请选择所属网格</option>
                                        <option value={1}>ccc</option>
                                        <option value={2}>ddd</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>检查地址</td>
                                <td colSpan={5}><Input value={this.state.caddress} readOnly={type=='detail'?true:false} onChange={this.handleCaddress}/></td>
                            </tr>
                            <tr>
                                <td>许可证号</td>
                                <td><Input value={this.state.permitnum} readOnly={type=='detail'?true:false} onChange={this.handlePermitnum}/></td>
                                <td>被检单位负责人</td>
                                <td><Input value={this.state.principal} readOnly={type=='detail'?true:false} onChange={this.handlePrincipal}/></td>
                            </tr>
                            <tr>
                                <td>检查机构</td>
                                <td><Input value={this.state.mechanism} readOnly={type=='detail'?true:false} onChange={this.handleMechanism}/></td>
                                <td>联系方式</td>
                                <td><Input value={this.state.phonenum} readOnly={type=='detail'?true:false} onChange={this.handlePhonenum}/></td>
                            </tr>
                            <tr>
                                <td>陪同人员</td>
                                <td colSpan={5}><Input value={this.state.accompanying} readOnly={type=='detail'?true:false} onChange={this.handleAccompanying}/></td>
                            </tr>
                            <tr>
                                <td>执法人员</td>
                                <select value={this.state.lawperson}readOnly={type=='detail'?true:false} onChange={this.handleLawperson}>
                                    <option value={1}>eee</option>
                                    <option value={2}>fff</option>
                                </select>
                            </tr>
                            <tr>
                                <td>执法证号</td>
                                <td colSpan={5}><Input value={this.state.lawnum} readOnly={type=='detail'?true:false} onChange={this.handleLawnum}/></td>
                            </tr>
                            <tr>
                                <td>检查时间</td>
                                <td colSpan={5}><Input value={this.state.date} readOnly={type=='detail'?true:false} onChange={this.handleDate}/></td>
                            </tr>
                            <tr>
                                <td>执法证号最后一次检查日期</td>
                                <td colSpan={5}><Input value={this.state.lasttime} readOnly={type=='detail'?true:false} onChange={this.handleLasttime}/></td>
                            </tr>
                            </tbody>
                        </table>
                    </TabPane>
                    <TabPane tab="2.文书处理" key="2" >

                    </TabPane>
                </Tabs>
            </div>
        )
    }
}