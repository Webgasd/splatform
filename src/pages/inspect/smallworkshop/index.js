import React,{Component} from 'react';
import { Card,Button,Tabs, Form, Input, Select,Radio,Row,Col, Badge,Modal, DatePicker ,Collapse, message } from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";

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


export default class restaurantscheck extends Component{
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
            // url:'/restaurantscheck.json',
            data:{
                params:{
                    industry:2
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    // let list  = res.result.item_list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;
                        // _this.params.page = current;//	当前页数
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
        console.log(data)
        axios.PostAjax({
            url:'/inspect/dailyFood/update',
            // url:'/post.json',
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
            } })
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
        this.setState({
            title:'查看',
            isVisible:true,
            userInfo:item,
            type
        })
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
                dataIndex: 'operatorTime',

            }, {
                title: '检查类型',
                dataIndex: 'checkType'
            },{
                title: '所属区域',
                dataIndex: 'region',
            },
            {
                title: '被检单位（对象）',
                dataIndex: 'checkObject',
            },
            {
                title: '检查日期',
                dataIndex: 'checkDate',
            },
            {
                title: '检查人员',
                dataIndex: 'supervisor',
            },
            {
                title: '检查结果',
                dataIndex: 'checkResult',
            },
            {
                title: '结果处理',
                dataIndex: 'resultProcess',
            },
            {
                title: '巡查频次',
                dataIndex: 'checkFrequence',
            },
            {
                title: '本年度第_次检查',
                dataIndex: 'checkCount',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <ButtonGroup>
                        <Button type="primary"  onClick={()=> {this.handleOperator('detail',record)}}>查看</Button>
                        <Button type="primary"  onClick={()=> {this.handleDaily(record.key)}}>日志</Button>
                    </ButtonGroup>
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
                    title={this.state.title}
                    visible={this.state.isAddVisible}
                    onOk={this.handleAddSubmit}
                    width={800}
                    onCancel={()=>{
                        this.addForm.props.form.resetFields();
                        this.setState({
                            isAddVisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <AddForm userInfo={this.state.userInfo} wrappedComponentRef={(inst) => this.addForm = inst }/>
                </Modal>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    footer={null}
                    onOk={this.handleSubmit}
                    width={800}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <UserForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>

                </Modal>
                <Modal
                    title={this.state.title}
                    visible={this.state.isDvisible}
                    width={800}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isDvisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <Daily userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>
                </Modal>
            </div>
        );
    }
}
class UserForm extends React.Component{

    state={ loading: true,isVisible:false}
    onChange = (checked) => {
        this.setState({ loading: !checked });
    }


    getState = (health)=>{
        return {
            '1':'合格',
            '2':'不合格'
        }[health]
    }
    getState1 = (sex)=>{
        return {
            '1':'男',
            '2':'女'
        }[sex]
    }

    handleAdd = ()=>{
        this.setState({
            isVisible:true
        })
    }
    render(){

        const { loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 14}
        };
        const userInfo = this.props.userInfo || {};
        const type = this.props.type;

        function callback(key) {

        }

        return (
            <Tabs defaultActiveKey="1" onChange={callback}  >
                <TabPane tab="基本信息" key="1">
                    <Card title="检查基本信息">
                        <div className="Box">
                            <table><tbody>

                            <tr>
                                <td colSpan={24} >
                                    <FormItem  label="检查对象类型" {...formItemLayout}>
                                        {
                                            userInfo && type=='detail'?userInfo.checkType:
                                                getFieldDecorator('checkType',{
                                                    initialValue:userInfo.checkType
                                                })(
                                                    <Input type="text" placeholder="请输入检查对象类型"/>
                                                )
                                        }
                                    </FormItem>
                                </td>
                            </tr>
                            <tr><td colSpan={24}>
                                <FormItem  label="被检查单位/对象" {...formItemLayout}>
                                    {
                                        userInfo && type=='detail'?userInfo.checkObject:
                                            getFieldDecorator('checkObject',{
                                                initialValue:userInfo.checkObject
                                            })(
                                                <Input type="text" placeholder="请输入被检查单位/对象"/>
                                            )
                                    }
                                </FormItem>
                            </td>
                            </tr>
                            <tr>
                                <td  width="50%" colSpan={12}>

                                    <FormItem label="所属区域" labelCol= {{span: 10}}
                                              wrapperCol={{span: 12}}>
                                        {
                                            userInfo && type=='detail'?userInfo.region:
                                                getFieldDecorator('region',{
                                                    initialValue:userInfo.region
                                                })(
                                                    <Select  placeholder="请选择所属区域">
                                                        <Option value="大明湖街道">大明湖街道</Option>
                                                        <Option value={1}>博士</Option>
                                                        <Option value={2}>硕士</Option>
                                                        <Option value={3}>本科</Option>
                                                    </Select>
                                                )
                                        }
                                    </FormItem>
                                </td>
                                <td colSpan={12}>
                                    <FormItem label="所属网格" labelCol= {{span: 10}}
                                              wrapperCol={{span: 12}}>
                                        {
                                            userInfo && type=='detail'?userInfo.grid:
                                                getFieldDecorator('grid',{
                                                    initialValue:userInfo.grid
                                                })(
                                                    <Select placeholder="请输入所属网格">
                                                        <Option value="大明湖">大明湖</Option>
                                                        <Option value={1}>博士</Option>
                                                        <Option value={2}>硕士</Option>
                                                        <Option value={3}>本科</Option>
                                                    </Select>
                                                )
                                        }
                                    </FormItem>

                                </td>
                            </tr>
                            <tr>
                                <td colSpan={24}>
                                    <FormItem  label="检查地址" {...formItemLayout}>
                                        {
                                            userInfo && type=='detail'?userInfo.checkAddress:
                                                getFieldDecorator('checkAddress',{
                                                    initialValue:userInfo.checkAddress
                                                })(
                                                    <Input type="text" placeholder="请输入检查地址"/>
                                                )
                                        }
                                    </FormItem>
                                </td></tr>
                            <tr><td colSpan={12}>


                                <FormItem label="许可证号" labelCol= {{span: 10}}
                                          wrapperCol={{span: 12}}>
                                    {
                                        userInfo && type=='detail'?userInfo.okNumber:
                                            getFieldDecorator('okNumber',{
                                                initialValue:userInfo.okNumber
                                            })(
                                                <Input type="text" placeholder="请输入许可证号"/>
                                            )
                                    }
                                </FormItem>

                            </td>
                                <td colSpan={12}>

                                    <FormItem label="被检单位负责人" labelCol= {{span: 10}}
                                              wrapperCol={{span: 12}}>
                                        {
                                            userInfo && type=='detail'?userInfo.chargePerson:
                                                getFieldDecorator('chargePerson',{
                                                    initialValue:userInfo.chargePerson
                                                })(
                                                    <Input type="text" placeholder="请输入被检单位负责人"/>
                                                )
                                        }
                                    </FormItem>

                                </td>
                            </tr>
                            <tr><td colSpan={12}>

                                <FormItem
                                    label="检查机构"
                                    labelCol= {{span: 10}}
                                    wrapperCol={{span: 12}}
                                >
                                    {
                                        userInfo && type=='detail'?userInfo.checkOrgan:
                                            getFieldDecorator('checkOrgan',{
                                                initialValue:userInfo.checkOrgan
                                            })(
                                                <Input type="text" placeholder="请输入检查机构"/>
                                            )
                                    }
                                </FormItem>

                            </td>
                                <td colSpan={12}>

                                    <FormItem label="联系方式"
                                              labelCol= {{span: 10}}
                                              wrapperCol={{span: 12}}>
                                        {
                                            userInfo && type=='detail'?userInfo.contactPhone:
                                                getFieldDecorator('contactPhone',{
                                                    initialValue:userInfo.contactPhone
                                                })(
                                                    <Input type="text" placeholder="请输入联系方式"/>
                                                )
                                        }
                                    </FormItem>

                                </td></tr>
                            <tr><td colSpan={24}>
                                <FormItem label="陪同人员" {...formItemLayout}>
                                    {
                                        userInfo && type=='detail'?userInfo.entourage:
                                            getFieldDecorator('entourage',{
                                                initialValue:userInfo.entourage
                                            })(
                                                <Input type="text" placeholder="请输入陪同人员"/>
                                            )
                                    }
                                </FormItem>
                            </td></tr>
                            <tr><td colSpan={24}>
                                <FormItem label="执法人员" {...formItemLayout}>
                                    {
                                        userInfo && type=='detail'?userInfo.supervisor:
                                            getFieldDecorator('supervisor',{
                                                initialValue:userInfo.supervisor
                                            })(
                                                <Input type="text" placeholder="请输入执法人员"/>
                                            )
                                    }
                                </FormItem>
                            </td></tr>
                            <tr><td colSpan={24}>
                                <FormItem label="执法证号" {...formItemLayout}>
                                    {
                                        userInfo && type=='detail'?userInfo.supervisorNumber:
                                            getFieldDecorator('supervisorNumber',{
                                                initialValue:userInfo.supervisorNumber
                                            })(
                                                <Input type="text" placeholder="请输入执法证号"/>
                                            )
                                    }
                                </FormItem>
                            </td></tr>
                            <tr><td colSpan={12}>
                                <FormItem label="检查时间" {...formItemLayout}>
                                    {
                                        userInfo && type=='detail'?userInfo.checkDate:
                                            getFieldDecorator('checkDate',{
                                                initialValue:userInfo.checkDate
                                            })(
                                                <Input type="text" placeholder="请输入检查时间"/>
                                            )
                                    }
                                </FormItem>
                            </td>
                                <td colSpan={12}>
                                    <Row> <Col span={6}>
                                        <FormItem >
                                            {
                                                userInfo && type=='detail'?userInfo.checkStartHour+'时':
                                                    getFieldDecorator('checkStartHour',{
                                                        initialValue:userInfo.checkStartHour+'时'
                                                    })(
                                                        <Input type="text" />
                                                    )
                                            }
                                        </FormItem>
                                    </Col>
                                        <Col span={6}>
                                            <FormItem >
                                                {
                                                    userInfo && type=='detail'?userInfo.checkStartMinute+'分':
                                                        getFieldDecorator('checkStartMinute',{
                                                            initialValue:userInfo.checkStartMinute+'分'
                                                        })(
                                                            <Input type="text"/>
                                                        )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label=" - " labelCol= {{span: 3}} wrapperCol= {{span: 21}}>
                                                {
                                                    userInfo && type=='detail'?userInfo.checkEndHour+'时':
                                                        getFieldDecorator('checkEndHour',{
                                                            initialValue:userInfo.checkEndHour+'时'
                                                        })(
                                                            <Input type="text" />
                                                        )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem >
                                                {
                                                    userInfo && type=='detail'?userInfo.checkEndMinute+'分':
                                                        getFieldDecorator('checkEndMinute',{
                                                            initialValue:userInfo.checkEndMinute+'分'
                                                        })(
                                                            <Input type="text"/>
                                                        )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </td>
                            </tr>
                            <tr><td colSpan={24}>
                                <FormItem label="最近一次检查日期" {...formItemLayout}>
                                    {
                                        userInfo && type=='detail'?userInfo.lastCheckTime:
                                            getFieldDecorator('lastCheckTime',{
                                                initialValue:userInfo.lastCheckTime
                                            })(
                                                <Input type="text" placeholder="请输入最近一次检查日期"/>
                                            )
                                    }
                                </FormItem>
                            </td></tr>

                            </tbody></table>
                        </div>
                    </Card>
                    <Card title="附件信息">
                        {/*<Extra userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>*/}
                    </Card>
                    <ButtonGroup>
                        <Button type="primary"  onClick={()=> {}}>结束检查</Button>
                        <Button type="primary"  onClick={()=> {}}>确认</Button>
                        <Button type="primary"  onClick={()=> {}}>取消</Button>
                        <Button type="primary"  onClick={()=> {}}>添加文书</Button>
                    </ButtonGroup>
                </TabPane>
                <TabPane tab="文书处理" key="2" >
                    {/*<Extra userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>*/}
                </TabPane>
            </Tabs>
        );
    }
}

UserForm = Form.create({})(UserForm);
class AddForm extends React.Component{

    state={ loading: true,isVisible:false}
    onChange = (checked) => {
        this.setState({ loading: !checked });
    }


    getState = (health)=>{
        return {
            '1':'合格',
            '2':'不合格'
        }[health]
    }
    getState1 = (sex)=>{
        return {
            '1':'男',
            '2':'女'
        }[sex]
    }

    handleAdd = ()=>{
        this.setState({
            isVisible:true
        })
    }
    render(){

        const { loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };
        const userInfo = this.props.userInfo || {};

        function callback(key) {

        }

        return (
            <Tabs defaultActiveKey="1" onChange={callback}  >
                <TabPane tab="基本信息" key="1">
                    <Card title="检查基本信息">
                        <div>

                        </div>
                    </Card>
                    <Card title="检查要点项处理">
                        <Check userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>
                    </Card>
                    <Card title="检查结果信息">
                        <Form layout="horizontal">
                            <Row>
                                <Col offset={2} span={10}>
                                    <FormItem label="检查结果" {...formItemLayout}>
                                        {

                                            getFieldDecorator('result',{
                                                initialValue:userInfo.result
                                            })(
                                                <Select placeholder="请选择检查结果">
                                                    <Option value="符合">符合</Option>
                                                    <Option value="不符合">不符合</Option>
                                                    <Option value="基本符合">基本符合</Option>
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="结果处理" {...formItemLayout}>
                                        {

                                            getFieldDecorator('resultdeal',{
                                                initialValue:userInfo.resultdeal
                                            })(
                                                <Select placeholder="请选择结果处理">
                                                    <Option value="符合">符合</Option>
                                                    <Option value="不符合">不符合</Option>
                                                    <Option value="基本符合">基本符合</Option>
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem  label="发现问题" {...formItemLayout}>
                                {

                                    getFieldDecorator('problem',{
                                        initialValue:userInfo.problem
                                    })(
                                        <Input.TextArea rows={3} type="text" placeholder="请输入问题"/>
                                    )
                                }
                            </FormItem>
                            <FormItem label="处理措施" {...formItemLayout}>
                                {

                                    getFieldDecorator('deal',{
                                        initialValue:userInfo.deal
                                    })(
                                        <Input.TextArea rows={3} type="text" placeholder="请输入处理措施"/>
                                    )
                                }
                            </FormItem>
                        </Form>
                    </Card>
                    <Card title="附件信息">
                        <Extra userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>
                    </Card>
                    <ButtonGroup>
                        <Button type="primary"  onClick={()=> {}}>结束检查</Button>
                        <Button type="primary"  onClick={()=> {}}>确认</Button>
                        <Button type="primary"  onClick={()=> {}}>取消</Button>
                        <Button type="primary"  onClick={()=> {}}>添加文书</Button>
                    </ButtonGroup>
                </TabPane>
                <TabPane tab="文书处理" key="2" >
                    <Extra userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>
                </TabPane>
            </Tabs>
        );
    }
}

AddForm = Form.create({})(AddForm);
class Daily extends Component{
    state={
        selectedRowKeys: [],
    };


    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/daily.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
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
                title: '动作',
                dataIndex: 'op',

            }, {
                title: '操作时间',
                dataIndex: 'movedate'
            },{
                title: '操作说明',
                dataIndex: 'explain',
            },
            {
                title: '操作人',
                dataIndex: 'person',
            }
        ];


        return (
            <div>
                <Card style={{marginTop:10}}>
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

Daily = Form.create({})(Daily);
class Check extends Component{
    state={
        selectedRowKeys: [],
    };


    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/checkimp.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
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
                title: '项目',
                dataIndex: 'op',

            }, {
                title: '编号',
                dataIndex: 'id'
            },{
                title: '核查内容',
                dataIndex: 'content',
            },
            {
                title: '重要性',
                dataIndex: 'imp',
            },
            {
                title: '结果判定',
                dataIndex: 'result',
            },
            {
                title: '备注',
                dataIndex: 'ex',
            }
        ];


        return (
            <div>
                <Card style={{marginTop:10}}>
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

Check = Form.create({})(Check);

class Extra extends Component{
    state={
        selectedRowKeys: [],
    };


    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/extra.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
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
                title: '文件名',
                dataIndex: 'name',

            }, {
                title: '修改日期',
                dataIndex: 'date'
            },{
                title: '对应检查项',
                dataIndex: 'content',
            },
            {
                title: '上传人',
                dataIndex: 'author',
            },
            {
                title: '操作',
                dataIndex: 'op',
            }
        ];


        return (
            <div>
                <Card style={{marginTop:10}}>
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

Extra = Form.create({})(Extra);