import React,{Component} from 'react';
import { Card,Button,Modal,Collapse } from 'antd';
import ETable from '../../../components/ETable';
import  BaseForm  from '../../../components/BaseForm';
import AddForm from './AddForm';
import Utils from "../../../utils";
import axios from "../../../axios";
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;


export default class TopicManage extends Component{
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
            url:'/exam/topic/getPage',
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
        axios.ajax({
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

    handleAdd = ()=>{
        this.setState({
            isVisible:true
        })
    }

    handleSubmit = ()=>{
        let type = this.state.type;
        axios.PostAjax({
            url:type=='create'?'/exam/topic/insert':'/exam/topic/update',
            data:{
                params:{
                    ...this.state.topicData
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    topicData:{}
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
        let item = this.state.selectedIds;
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
                            id:item
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
                title:'创建题目',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            let topicData = { ...item };
            this.setState({
                title:type=='edit'?'编辑题目':'查看详情',
                isVisible:true,
                topicData,
                type
            })
        }else if(type=="delete"){
            confirm({
                title: '确定删除?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/exam/topic/delete',
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
        let _this = this;
        const formList = [
            
            {
                type: 'INPUT',
                label: '考题/问题',
                field: 'title',
            },{
                type: 'SELECT',
                label: '题型',
                field: 'type',
                placeholder: '请选择题型',
                width: 150,
                list: [{id: 1, name: '判断'}, {id: 2, name: '单选'}, {id: 3, name: '多选'}]
            },{
                type: 'SELECT',
                label: '行业类别',
                field: 'industryCategory',
                placeholder: '请选择行业类别',
                width: 150,
                list:(_this.state.industryList||[]).map((item)=>{return{id:item.id,name:item.name}})
            },{
                type: 'SELECT',
                label: '工作种类',
                field: 'workType',
                placeholder: '请选择工作种类',
                width: 170,
                list:(_this.state.workTypeList||[]).map((item)=>{return{id:item.id,name:item.name}})
            },
        ]
        const columns = [
            {
                title: '考题/问题',
                dataIndex: 'title',

            }, {
                title: '题型',
                dataIndex: 'type',
                render(type){
                    if (type == 1) {
                        return "判断题"
                    } if (type == 2) {
                        return "单选题"
                    }if (type == 3) {
                        return "多选题"
                    }
                }
            },{
                title: '答案',
                dataIndex: 'answer',
                render(answer,data){
                    let answerList = answer.split(",");
                    answerList = answerList.map((item)=>{if(data.type==1) {return {1:'正确',2:'错误'}[item]}else {return {1:'A',2:'B',3:'C',4:'D'}[item]}})
                    return answerList.join(",");
                }

            }, 
                // 2020.08.19改动:去掉状态，加类别、种类 --wjb
            //  {
            //     title: '状态',
            //     dataIndex: 'status',
            //     render(status){
            //         if (status == 1) {
            //             return "正常"
            //         } else {
            //             return "停用"
            //         }
            //     }
            // },
            {
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
            <div ref='topicManage'>
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
                        <Button type="primary" onClick={()=>this.handleDelete()}>删除</Button>
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
                    width='850px'
                    title="题目信息"
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    getContainer={()=>this.refs.topicManage}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            topicData:{}
                        })
                    }}
                >
                    <AddForm topicData={this.state.topicData||{}} dispatchTopicData={(value)=>this.setState({topicData:value})} type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}