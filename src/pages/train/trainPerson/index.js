import React,{Component} from 'react';
import {Card, Button, Modal,Row, Col, Icon,Progress } from 'antd';
import ETable from '../../../components/ETable';
import  BaseForm  from '../../../components/BaseForm';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm';
const formList = [
    {
        type: 'INPUT',
        label: '企业名称',
        field: 'companyName',
    },
    {
        type: 'INPUT',
        label: '姓名',
        field: 'caName',
    }, {
        type: 'SELECT',
        label: '完成情况',
        field: 'completion',
        placeholder: '请选择培训情况',
        width: 150,
        list: [{id: 1, name: '完成'}, {id: 2, name: '未完成'}]
    },
    {
        type: 'INPUT',
        label: '身份证号',
        field: 'idNumber',
    },
]

export default class TrainPerson extends Component{
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
        this.requestInfo();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/exam/enquiry/getTrainPage',
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
    requestInfo=()=>{
        axios.noLoadingAjax({
            url:'/exam/subject/getIndustryAndWorkType'
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    industryList:res.data.allIndustry,
                    workTypeList:res.data.allWorkType
                })
            }
        })
    }

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };



    handleSubmit = ()=>{
        axios.ajax({
            url:'/post.json',
            data:{
                params:{

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
        // ajax request after empty completing
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
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'创建员工',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){

            this.setState({
                title:type=='edit'?'编辑用户':'查看详情',
                isVisible:true,
                caInfo:item,
                type
            })
            //console.log(item);
        }
    }


    render() {
        let _this = this;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name'
            },
            {
                title: '培训进度',
                dataIndex: 'completionRate',
                render(completionRate){
                    return <Progress showInfo={false} percent={completionRate*100} />

                }
            },
            {
                title: '性别',
                dataIndex: 'sexy',
                render(sexy){
                    return {1:'女',0:'男'}[sexy]
                }
            },
            {
                title: '所属企业',
                dataIndex: 'companyName'
            }, {
                title: '行业类别',
                dataIndex: 'industry',
                render(industry){
                    let data = (_this.state.industryList||[]).find((item)=>item.id==industry)||{};
                    return data.name;
                }
            },{
                title: '工作种类',
                dataIndex: 'workType',
                render(workType){
                    let data = (_this.state.workTypeList||[]).find((item)=>item.id==workType)||{};
                    return data.name;
                }
            },{
                title: '身份证号',
                dataIndex: 'idNumber'
            },
            {
                title: '联系电话',
                dataIndex: 'telephone',
            },
            {
                title: '总完成度',
                dataIndex: 'completionRate',
                render(completionRate){
                    var percent = Math.round(completionRate * 10000) / 100 + "%";
                    return percent;
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Button type='primary' onClick={() => { this.handleOperator('detail',record)}}>查看</Button>
                    // return  <Row>
                    //         <Col span={7}><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>
                    //         <Col span={7}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>
                    //         <Col span={7}><div className='textButton' onClick={() =>{this.handleOperator('delete',record)}}>删除</div></Col>
                    //     </Row>
                }}

        ];
        const SearchForm =<div style={{paddingLeft:30}}><BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
        // 2020.06.26修改，取消信息框 --wjb
        // const Information = <Row style={{height:120}}>
        //     <Col span={3} style={{margin:5,marginRight:30,background:"#99CC66",height:"95px",marginLeft:" 70px"}}>
        //         <div style={{fontSize:16,color:"white",fontWeight:1000}}>
        //             <Icon type="profile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
        //             企业基本档案
        //         </div>
        //         <div style={{margin:10,marginLeft:5}}>数量: {this.state.comAmount} 家</div>
        //     </Col>

        //     <Col span={3} style={{margin:5,marginRight:30,background:"#33CCCC",height:"95px"}}>
        //         <div style={{fontSize:16,color:"white",fontWeight:1000}}>
        //             <Icon type="solution" style={{fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}}/>
        //             人员基本档案
        //         </div>
        //         <div style={{margin:10,marginLeft:5}}>数量: {this.state.perAmount} 人</div>
        //     </Col>

        //     <Col span={3} style={{margin:5,marginRight:30,background:"#FF9900",height:"95px"}}>
        //         <div style={{fontSize:16,color:"white",fontWeight:1000}}>
        //             <Icon type="schedule" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
        //             省局许可系统
        //         </div>
        //         <div style={{margin:10,marginLeft:5}}>门户超链接</div>
        //     </Col>

        //     <Col span={3} style={{margin:5,marginRight:30,background:"#99CC00",height:"95px"}}>
        //         <div style={{fontSize:16,color:"white",fontWeight:1000}}>
        //             <Icon type="file-search" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
        //             信用体系系统
        //         </div>
        //         <div style={{margin:10,marginLeft:5}}>门户超链接</div>
        //     </Col>

        //     <Col span={3} style={{margin:5,marginRight:30,background:"#0066CC",height:"95px"}}>
        //         <div style={{fontSize:16,color:"white",fontWeight:1000}}>
        //             <Icon type="smile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
        //             企业基本档案
        //         </div>
        //         <div style={{margin:10,marginLeft:5}}>门户超链接</div>
        //     </Col>

        //     <Col span={3} style={{margin:5,marginRight:30,background:"#3399CC",height:"95px"}}>
        //         <div style={{fontSize:16,color:"white",fontWeight:1000}}>
        //             <Icon type="smile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
        //             企业基本档案
        //         </div>
        //         <div style={{margin:10,marginLeft:5}}>门户超链接</div>
        //     </Col>
        // </Row>
        return (
            <div ref='trainPerson'>
                {/* <div style={{height:120,display:'table',width:'100%'}}>
                    {this.state.headStatus?SearchForm:Information}
                </div> */}
                <Card>
                    {SearchForm}
                </Card>
                {/* <Card>
                    <div className='button-box-left'>
                        <Button type="primary" onClick={()=>this.setState({headStatus:this.state.headStatus?false:true})}>查询</Button>
                    </div>
                </Card> */}
                <Card style={{marginTop:10}}>
                    {/*<div className='button-box'>*/}
                        {/*<Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>*/}
                        {/*<Button type="primary" onClick={this.handleDelete}>删除</Button>*/}
                    {/*</div>*/}
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
                    width='1200px'
                    title="培训信息"
                    okText="确定"
                    cancelText="取消"
                    destroyOnClose
                    maskClosable={false}
                    getContainer={()=>this.refs.trainPerson}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        //this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                   <AddForm caInfo={this.state.caInfo||{}}/>
                </Modal>
            </div>
        );
    }
}