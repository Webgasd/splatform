import React,{Component} from 'react';
import {
    Card,
    Button,
    Tabs,
    Form,
    Input,
    Select,
    Radio,
    Row,
    Col,
    Badge,
    Modal,
    DatePicker,
    Collapse,
    message,
    Icon
} from 'antd';
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
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300'
    }
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
        let _this=this

        //   let data = this.userForm.props.form.getFieldsValue();//获取表单的值
        axios.PostAjax({
            // url:'/post.json',
            url:'/inspect/dailyFood/update ',

            data:{
                params:{
                    ..._this.state.detailData

                    //  ...data
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
        this.setState({
            title:'查看',
            isVisible:true,
            detailData:item,
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
                title: '是否整改复查',
                dataIndex: 'yn',
                render(text, record,index){
                    let checkResult = record.checkResult;

                    return checkResult =='符合' ?'否':'是';
                }
            },
            {
                title: '完成情况',
                dataIndex: 'achieve',
                render(text, record,index){
                    let checkResult = record.checkResult;
                    return checkResult =='符合' ?'已完成':'未完成';
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return  <Row>
                            <Col span={10}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>查看</div></Col>
                            <Col span={10}><div className='textButton' onClick={()=> {this.handleDaily(record.key)}}>日志</div></Col>
                        </Row>
                }
            }
        ];
        const SearchForm =<div style={{display:'table-cell',verticalAlign:'middle',paddingLeft:30}}><BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
        const Information = <Row style={{height:120}}>
            <Col span={3} style={{margin:5,marginRight:30,background:"#99CC66",height:"95px",marginLeft:" 70px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    企业基本档案
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.comAmount} 家</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#33CCCC",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="solution" style={{fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}}/>
                    人员基本档案
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.perAmount} 人</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#FF9900",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="schedule" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    省局许可系统
                </div>
                <div style={{margin:10,marginLeft:5}}>门户超链接</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#99CC00",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="file-search" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    信用体系系统
                </div>
                <div style={{margin:10,marginLeft:5}}>门户超链接</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#0066CC",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="smile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    企业基本档案
                </div>
                <div style={{margin:10,marginLeft:5}}>门户超链接</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#3399CC",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="smile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    企业基本档案
                </div>
                <div style={{margin:10,marginLeft:5}}>门户超链接</div>
            </Col>
        </Row>
        return (
            <div>
                <div style={{height:120,display:'table',width:'100%'}}>
                    {this.state.headStatus?SearchForm:Information}
                </div>
                <Card>
                    <div className='button-box-left'>
                        <Button type="primary" onClick={()=>this.setState({headStatus:this.state.headStatus?false:true})}>查询</Button>
                    </div>
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

                    width={800}
                    onCancel={()=>{
                        this.addForm.props.form.resetFields();
                        this.setState({
                            isAddVisible:false,
                            userInfo:''
                        })
                    }}
                >
                    <AddForm addData={this.state.addData} dispatchState={(value)=>{this.setState({addData:value})}}/>
                </Modal>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    width={800}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        //     this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            detailData:{}
                        })
                    }}
                >
                    <DetailForm  detailData={this.state.detailData} type={this.state.type} dispatchState={(value)=>{this.setState({detailData:value})}}/>

                </Modal>
            </div>
        );
    }
}
class AddForm extends React.Component{

    state={ loading: true,isVisible:false}
    onChange = (checked) => {
        this.setState({ loading: !checked });
    }


    handleAdd = ()=>{
        this.setState({
            isVisible:true
        })
    }
    handleCheckAddress=(event)=>{
        const data = this.props.detailData;
        data.checkAddress=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckType=(value)=>{
        const data = this.props.detailData;
        data.checkType=value;
        this.props.dispatchState(data)
    }
    handleCheckObject=(value)=>{
        const data = this.props.addData;
        data.checkObject=value;
        this.props.dispatchState(data)
    }
    handleRegion=(value)=>{
        const data = this.props.detailData;
        data.region=value;
        this.props.dispatchState(data)
    }
    handleGrid=(value)=>{
        const data = this.props.detailData;
        data.grid=value;
        this.props.dispatchState(data)
    }
    handleOkNumber=(event)=>{
        const data = this.props.detailData;
        data.okNumber=event.target.value;
        this.props.dispatchState(data)
    }
    handleChargePerson=(event)=>{
        const data = this.props.detailData;
        data.chargePerson=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckOrgan=(event)=>{
        const data = this.props.detailData;
        data.checkOrgan=event.target.value;
        this.props.dispatchState(data)
    }
    handleContactPhone=(event)=>{
        const data = this.props.detailData;
        data.contactPhone=event.target.value;
        this.props.dispatchState(data)
    }
    handleEntourage=(event)=>{
        const data = this.props.detailData;
        data.entourage=event.target.value;
        this.props.dispatchState(data)
    }
    handleSupervisor=(event)=>{
        const data = this.props.detailData;
        data.supervisor=event.target.value;
        this.props.dispatchState(data)
    }
    handleSupervisorNumbere=(event)=>{
        const data = this.props.detailData;
        data.supervisorNumber=event.target.value;
        this.props.dispatchState(data)
    }
    handleLastCheckTime=(event)=>{
        const data = this.props.detailData;
        data.lastCheckTime=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckDate=(event)=>{
        const data = this.props.detailData;
        data.checkDate=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckStartHour=(event)=>{
        const data = this.props.detailData;
        data.checkStartHour=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckStartMinute=(event)=>{
        const data = this.props.detailData;
        data.checkStartMinute=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckEndHoure=(event)=>{
        const data = this.props.detailData;
        data.checkEndHour=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckStartMinute=(event)=>{
        const data = this.props.detailData;
        data.checkStartMinute=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckEndMinute=(event)=>{
        const data = this.props.detailData;
        data.checkEndMinute=event.target.value;
        this.props.dispatchState(data)
    }
    render(){


        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };
        const userInfo = this.props.userInfo || {};
        const type = this.props.type;
        console.log(type)
        function callback(key) {

        }

        return (
            <Tabs defaultActiveKey="1" onChange={callback}  >

                <TabPane tab="基本信息" key="1">
                    <Card title="检查基本信息">

                        <div className='commonEnterpriseBox' >

                            <table>
                                <tbody>
                                <tr>
                                    <td width="100px">检查对象类型</td>
                                    <td width="200px"> <Select   onChange={this.handleCheckType.bind(this)} placeholder="请选择检查对象类型">
                                        <Option value="日常检查" >有证已建档</Option>
                                        <Option value="1" >无证</Option>
                                    </Select> </td>
                                    <td width="100px">被检查单位/对象</td>
                                    <td ><Select value={this.props.addData.checkObject}  onChange={this.handleCheckObject.bind(this)} placeholder="请选择被检查单位/对象">
                                        <Option value="被检对象">串串</Option>
                                        <Option value="济南市蜜冰食品公司">博士</Option>
                                        <Option value="1">硕士</Option>
                                        <Option value={3}>本科</Option>
                                    </Select></td>
                                </tr>

                                <tr>

                                    <td>所属区域</td>
                                    <td> <Select   onChange={this.handleRegion.bind(this)} placeholder="请选择所属区域">
                                        <Option value="大明湖街道">大明湖街道</Option>
                                        <Option value="所属区域">博士</Option>
                                        <Option value={1}>硕士</Option>
                                        <Option value={3}>本科</Option>
                                    </Select></td>
                                    <td>所属网格</td>
                                    <td ><Select  onChange={this.handleGrid.bind(this)} placeholder="请选择所属网格">
                                        <Option value="大明湖街道">大明湖街道</Option>
                                        <Option value="所属网格">所属网格</Option>

                                    </Select></td>
                                </tr>
                                <tr>
                                    <td>检查地址</td>
                                    <td ><Input value={this.props.detailData.checkAddress} placeholder={"请输入检查地址"}/></td>
                                    <td>许可证号</td>
                                    <td><Input value={this.props.detailData.okNumber}readOnly={type=='detail'?true:false} onChange={this.handleOkNumber} placeholder={"请输入许可证号"}/></td>
                                </tr>
                                <tr>
                                    <td>被检单位负责人</td>
                                    <td><Input value={this.props.detailData.chargePerson}readOnly={type=='detail'?true:false} onChange={this.handleChargePerson} placeholder={"请输入被检单位负责人"}/></td>
                                    <td>检查机构</td>
                                    <td><Input value={this.props.detailData.checkOrgan}readOnly={type=='detail'?true:false} onChange={this.handleCheckOrgan} placeholder={"请输入检查机构"}/></td>
                                </tr>
                                <tr>
                                    <td>联系方式</td>
                                    <td><Input value={this.props.detailData.contactPhone}readOnly={type=='detail'?true:false} onChange={this.handleContactPhone} placeholder={"请输入联系方式"}/></td>
                                    <td>陪同人员</td>
                                    <td><Input value={this.props.detailData.entourage}readOnly={type=='detail'?true:false} onChange={this.handleEntourage} placeholder={"请输入陪同人员"}/></td>

                                </tr>
                                <tr>
                                    <td>执法人员</td>
                                    <td><Input value={this.props.detailData.supervisor}readOnly={type=='detail'?true:false} onChange={this.handleSupervisor} placeholder={"请输入执法人员"}/></td>
                                    <td>执法证号</td>
                                    <td><Input value={this.props.detailData.supervisorNumber}readOnly={type=='detail'?true:false} onChange={this.handleSupervisorNumber} placeholder={"请输入执法证号"}/></td>
                                </tr>
                                <tr>

                                    <td>检查时间</td>
                                    <td > <div className="checkDate">
                                        <Input value={this.props.detailData.checkDate}readOnly={type=='detail'?true:false} onChange={this.handleCheckDate} placeholder={"请输入检查时间"}/>
                                    </div>
                                    </td>
                                    <td>
                                        <div className="checkStartMinute">
                                            <input  size="5" value={this.props.detailData.checkStartHour}readOnly={type=='detail'?true:false} onChange={this.handleCheckStartHour} />时
                                        </div>
                                    </td>
                                    <td>
                                        <Row>
                                            <Col span={8}>
                                                <input  size="4" value={this.props.detailData.checkStartMinute}readOnly={type=='detail'?true:false} onChange={this.handleCheckStartMinute} />分 - <br/>
                                            </Col>
                                            <Col span={8}>
                                                <input  size="4" value={this.props.detailData.checkEndHour}readOnly={type=='detail'?true:false} onChange={this.handleCheckEndHour}/>时
                                            </Col>
                                            <Col span={8}>

                                                <input size="4" value={this.props.detailData.checkEndMinute}readOnly={type=='detail'?true:false} onChange={this.handleCheckEndMinute} />分
                                            </Col>
                                        </Row>
                                    </td>
                                </tr>
                                <tr>
                                    <td>最近一次检查日期</td>
                                    <td><Input value={this.props.detailData.lastCheckTime}readOnly={type=='detail'?true:false} onChange={this.handleLastCheckTime} placeholder={"请输入最近一次检查日期"}/></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                    </Card>
                    <Card title="检查要点项处理">
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
                    </Card>
                    <ButtonGroup>
                        <Button type="primary"  onClick={()=> {}}>结束检查</Button>
                        <Button type="primary"  onClick={()=> {}}>确认</Button>
                        <Button type="primary"  onClick={()=> {}}>取消</Button>
                        <Button type="primary"  onClick={()=> {}}>添加文书</Button>
                    </ButtonGroup>
                </TabPane>
                <TabPane tab="文书处理" key="2" >
                    {/* <Extra userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>*/}
                </TabPane>
            </Tabs>
        );
    }
}

AddForm = Form.create({})(AddForm);
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
class DetailForm extends React.Component{

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
    handleCheckAddress=(event)=>{
        const data = this.props.detailData;
        data.checkAddress=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckType=(value)=>{
        const data = this.props.detailData;
        data.checkType=value;
        this.props.dispatchState(data)
    }
    handleCheckObject=(value)=>{
        const data = this.props.detailData;
        data.checkObject=value;
        this.props.dispatchState(data)
    }
    handleRegion=(value)=>{
        const data = this.props.detailData;
        data.region=value;
        this.props.dispatchState(data)
    }
    handleGrid=(value)=>{
        const data = this.props.detailData;
        data.grid=value;
        this.props.dispatchState(data)
    }
    handleOkNumber=(event)=>{
        const data = this.props.detailData;
        data.okNumber=event.target.value;
        this.props.dispatchState(data)
    }
    handleChargePerson=(event)=>{
        const data = this.props.detailData;
        data.chargePerson=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckOrgan=(event)=>{
        const data = this.props.detailData;
        data.checkOrgan=event.target.value;
        this.props.dispatchState(data)
    }
    handleContactPhone=(event)=>{
        const data = this.props.detailData;
        data.contactPhone=event.target.value;
        this.props.dispatchState(data)
    }
    handleEntourage=(event)=>{
        const data = this.props.detailData;
        data.entourage=event.target.value;
        this.props.dispatchState(data)
    }
    handleSupervisor=(event)=>{
        const data = this.props.detailData;
        data.supervisor=event.target.value;
        this.props.dispatchState(data)
    }
    handleSupervisorNumbere=(event)=>{
        const data = this.props.detailData;
        data.supervisorNumber=event.target.value;
        this.props.dispatchState(data)
    }
    handleLastCheckTime=(event)=>{
        const data = this.props.detailData;
        data.lastCheckTime=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckDate=(event)=>{
        const data = this.props.detailData;
        data.checkDate=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckStartHour=(event)=>{
        const data = this.props.detailData;
        data.checkStartHour=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckStartMinute=(event)=>{
        const data = this.props.detailData;
        data.checkStartMinute=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckEndHoure=(event)=>{
        const data = this.props.detailData;
        data.checkEndHour=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckStartMinute=(event)=>{
        const data = this.props.detailData;
        data.checkStartMinute=event.target.value;
        this.props.dispatchState(data)
    }
    handleCheckEndMinute=(event)=>{
        const data = this.props.detailData;
        data.checkEndMinute=event.target.value;
        this.props.dispatchState(data)
    }
    render(){


        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
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

                        <div className='commonEnterpriseBox' >

                            <table>
                                <tbody>
                                <tr>
                                    <td width="100px">检查对象类型</td>
                                    <td width="200px"> <Select value={this.props.detailData.checkType}  onChange={this.handleCheckType.bind(this)} placeholder="请选择检查对象类型">
                                        <Option value="日常检查" disabled={type=='detail'?true:false}>有证已建档</Option>
                                        <Option value="1" disabled={type=='detail'?true:false}>无证</Option>
                                    </Select> </td>
                                    <td width="100px">被检查单位/对象</td>
                                    <td ><Select value={this.props.detailData.checkObject}  onChange={this.handleCheckObject.bind(this)} placeholder="请选择被检查单位/对象">
                                        <Option value="被检对象"disabled={type=='detail'?true:false}>串串</Option>
                                        <Option value="济南市蜜冰食品公司"disabled={type=='detail'?true:false}>博士</Option>
                                        <Option value="1"disabled={type=='detail'?true:false}>硕士</Option>
                                        <Option value={3}disabled={type=='detail'?true:false}>本科</Option>
                                    </Select></td>
                                </tr>

                                <tr>

                                    <td>所属区域</td>
                                    <td> <Select  value={this.props.detailData.region} onChange={this.handleRegion.bind(this)} placeholder="请选择所属区域">
                                        <Option value="大明湖街道"disabled={type=='detail'?true:false}>大明湖街道</Option>
                                        <Option value="所属区域"disabled={type=='detail'?true:false}>博士</Option>
                                        <Option value={1}disabled={type=='detail'?true:false}>硕士</Option>
                                        <Option value={3}disabled={type=='detail'?true:false}>本科</Option>
                                    </Select></td>
                                    <td>所属网格</td>
                                    <td ><Select value={this.props.detailData.grid} onChange={this.handleGrid.bind(this)} placeholder="请选择所属网格">
                                        <Option value="大明湖街道"disabled={type=='detail'?true:false}>大明湖街道</Option>
                                        <Option value="所属网格"disabled={type=='detail'?true:false}>所属网格</Option>

                                    </Select></td>
                                </tr>
                                <tr>
                                    <td>检查地址</td>
                                    <td ><Input value={this.props.detailData.checkAddress}readOnly={type=='detail'?true:false} onChange={this.handleCheckAddress}placeholder={"请输入检查地址"}/></td>
                                    <td>许可证号</td>
                                    <td><Input value={this.props.detailData.okNumber}readOnly={type=='detail'?true:false} onChange={this.handleOkNumber} placeholder={"请输入许可证号"}/></td>
                                </tr>
                                <tr>
                                    <td>被检单位负责人</td>
                                    <td><Input value={this.props.detailData.chargePerson}readOnly={type=='detail'?true:false} onChange={this.handleChargePerson} placeholder={"请输入被检单位负责人"}/></td>
                                    <td>检查机构</td>
                                    <td><Input value={this.props.detailData.checkOrgan}readOnly={type=='detail'?true:false} onChange={this.handleCheckOrgan} placeholder={"请输入检查机构"}/></td>
                                </tr>
                                <tr>
                                    <td>联系方式</td>
                                    <td><Input value={this.props.detailData.contactPhone}readOnly={type=='detail'?true:false} onChange={this.handleContactPhone} placeholder={"请输入联系方式"}/></td>
                                    <td>陪同人员</td>
                                    <td><Input value={this.props.detailData.entourage}readOnly={type=='detail'?true:false} onChange={this.handleEntourage} placeholder={"请输入陪同人员"}/></td>

                                </tr>
                                <tr>
                                    <td>执法人员</td>
                                    <td><Input value={this.props.detailData.supervisor}readOnly={type=='detail'?true:false} onChange={this.handleSupervisor} placeholder={"请输入执法人员"}/></td>
                                    <td>执法证号</td>
                                    <td><Input value={this.props.detailData.supervisorNumber}readOnly={type=='detail'?true:false} onChange={this.handleSupervisorNumber} placeholder={"请输入执法证号"}/></td>
                                </tr>
                                <tr>

                                    <td>检查时间</td>
                                    <td > <div className="checkDate">
                                        <Input value={this.props.detailData.checkDate}readOnly={type=='detail'?true:false} onChange={this.handleCheckDate} placeholder={"请输入检查时间"}/>
                                    </div>
                                    </td>
                                    <td>
                                        <div className="checkStartMinute">
                                            <input  size="5" value={this.props.detailData.checkStartHour}readOnly={type=='detail'?true:false} onChange={this.handleCheckStartHour} />时
                                        </div>
                                    </td>
                                    <td>
                                        <Row>
                                            <Col span={8}>
                                                <input  size="4" value={this.props.detailData.checkStartMinute}readOnly={type=='detail'?true:false} onChange={this.handleCheckStartMinute} />分 - <br/>
                                            </Col>
                                            <Col span={8}>
                                                <input  size="4" value={this.props.detailData.checkEndHour}readOnly={type=='detail'?true:false} onChange={this.handleCheckEndHour}/>时
                                            </Col>
                                            <Col span={8}>

                                                <input size="4" value={this.props.detailData.checkEndMinute}readOnly={type=='detail'?true:false} onChange={this.handleCheckEndMinute} />分
                                            </Col>
                                        </Row>
                                    </td>
                                </tr>
                                <tr>
                                    <td>最近一次检查日期</td>
                                    <td><Input value={this.props.detailData.lastCheckTime}readOnly={type=='detail'?true:false} onChange={this.handleLastCheckTime} placeholder={"请输入最近一次检查日期"}/></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                    </Card>
                    <Card title="检查要点项处理">
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
                    </Card>
                    <ButtonGroup>
                        <Button type="primary"  onClick={()=> {}}>结束检查</Button>
                        <Button type="primary"  onClick={()=> {}}>确认</Button>
                        <Button type="primary"  onClick={()=> {}}>取消</Button>
                        <Button type="primary"  onClick={()=> {}}>添加文书</Button>
                    </ButtonGroup>
                </TabPane>
                <TabPane tab="文书处理" key="2" >
                    {/* <Extra userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.userForm = inst }/>*/}
                </TabPane>
            </Tabs>
        );
    }
}

DetailForm = Form.create({})(DetailForm);