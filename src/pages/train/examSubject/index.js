import React,{Component} from 'react';
import { Card,Button, Form,  Select,Modal,Collapse, message } from 'antd';
import ETable from '../../../components/ETable';
import  BaseForm  from '../../../components/BaseForm';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm';
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const formList = [
    {
        type: 'INPUT',
        label: '行业类别',
        field: 'industryCategory',
    },{
        type: 'INPUT',
        label: '工作种类',
        field: 'workType',
    }, {
        type: 'INPUT',
        label: '状态',
        field: 'status',
    },
    {
        type: 'INPUT',
        label: '考题/问题',
        field: 'name',
    },
]

export default class ExamTopic extends Component{
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
            url:'/exam/subject/getPage',
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


    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    handleAdd = ()=>{
        this.setState({
            isVisible:true
        })
    }

    handleSubmit = ()=>{
        let type = this.state.type;
        let data = this.addForm.props.form.getFieldsValue();//获取表单的值
        data.topicIds = this.state.targetKeys.join(',');
        console.log(data);
        axios.ajax({
            url:type=='create'?'/exam/subject/insert':'/exam/subject/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.addForm.props.form.resetFields();//表单重置
                this.setState({
                    isVisible:false,
                    targetKeys:[],
                    subjectInfo:{}
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
            axios.ajax({
                url:'/exam/subject/getSubjectTopicIds',
                data:{
                    params:{id:item.id}
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    this.setState({
                        title:type=='edit'?'编辑用户':'查看详情',
                        isVisible:true,
                        targetKeys:res.data,
                        subjectInfo:item,
                        type
                    })
                }
            })
            //console.log(item);
        }else if(type=="delete"){
            confirm({
                title: '确定删除?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/exam/subject/delete',
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


    render() {
        const columns = [
            {
                title: '行业类别',
                dataIndex: 'industryName',

            }, {
                title: '工作种类',
                dataIndex: 'workTypeName'
            },{
                title: '考试总题数',
                dataIndex: 'topicNumber',

            },{
                title: '判断题数',
                dataIndex: 'judgementNumber',

            },{
                title: '单选题数',
                dataIndex: 'singleNumber',

            },{
                title: '多选题数',
                dataIndex: 'multipleNumber',

            },{
                title: '合格分数',
                dataIndex: 'qualifiedScore',

            }, {
                title: '考试时间(分钟)',
                dataIndex: 'examTime',

            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <ButtonGroup>
                        <Button type="primary"  onClick={() => { this.handleOperator('detail',record)}}>查看</Button>
                        <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>修改</Button>
                        <Button type="primary"  onClick={() => { this.handleOperator('delete',record) }}>删除</Button>
                    </ButtonGroup>


                }
            }
        ];

        return (
            <div ref='examSubject'>
                <Card>
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>
                </Card>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> this.handleOperator('create',null)}>添加</Button>
                        <Button type="primary" onClick={()=>this.handleDelete}>删除</Button>
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
                    width='1000px'
                    title="添加试题信息"
                    okText="确定"
                    cancelText="取消"
                    destroyOnClose
                    maskClosable={false}
                    getContainer={()=>this.refs.examSubject}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            targetKeys:[],
                            subjectInfo:{}
                        })
                    }}
                >
                    <AddForm targetKeys={this.state.targetKeys||[]}
                             subjectInfo={this.state.subjectInfo||{}}
                             wrappedComponentRef={(inst) => this.addForm = inst }
                             dispatchKeys={(keys)=>this.setState({targetKeys:keys})}
                             type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}