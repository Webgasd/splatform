import React,{Component} from 'react';
import {Card, Button, Modal, Collapse} from 'antd';
import ETable from '../../../components/ETable';
import  BaseForm  from '../../../components/BaseForm';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm';
const Panel = Collapse.Panel;
const formList = [
    {
        type: 'INPUT',
        label: '姓名',
        field: 'caName',
    },
    {
        type: 'INPUT',
        label: '考试名称',
        field: 'examName',
    },
    {
        type: 'SELECT',
        label: '考试情况',
        field: 'examResult',
        placeholder: '请选择考试情况',
        width: 150,
        list: [{id: 1, name: '合格'}, {id: 0, name: '不合格'}]
    },
]

export default class TrainCourse extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column

    };
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
            url:'/exam/enquiry/getPage',
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
                title: '身份证号',
                dataIndex: 'idNumber',
            },
            {
                title: '企业名称',
                dataIndex: 'companyName',
            },{
                title: '考试名称',
                dataIndex: 'examName'
            },
            {
                title: '考试时间',
                dataIndex: 'examDate',
                render: Utils.formatDateNoTime
            },{
                title: '行业类别',
                dataIndex: 'industry',
                render(industry){
                    let data = (_this.state.industryList||[]).find((item)=>item.id==industry)||{};
                    return data.name;
                }

            },  {
                title: '工作种类',
                dataIndex: 'workType',
                render(workType){
                    let data = (_this.state.workTypeList||[]).find((item)=>item.id==workType)||{};
                    return data.name;
                }
            },
            {
                title: '电子从业资格证号',
                dataIndex: 'electronicNumber',
            },
            {
                title: '考试情况',
                dataIndex: 'examResult',
                render(examResult){
                    return {1:'合格',0:'不合格'}[examResult]
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Button type="primary" onClick={() => { this.handleOperator('detail',record)}}>查看</Button>
                            {/*<Col span={7}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>*/}
                            {/*<Col span={7}><div className='textButton' onClick={() =>{this.handleOperator('delete',record)}}>删除</div></Col>*/}
                }}

        ];

        return (
            <div ref='examEnquiry'>
                <Card>
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>
                </Card>
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
                    title="考试信息"
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    getContainer={()=>this.refs.examEnquiry}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    destroyOnClose={true}
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