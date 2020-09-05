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


 class TrainCourse extends Component{
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
            url:'/exam/trainCourse/getPage',
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
                        _this.params.page = current;//	当前页数
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



    handleSubmit = ()=>{
        let type = this.state.type;
        let materialIds = this.state.materialList.map((item)=>item.id).join(',');
        axios.PostAjax({
            url:type=='create'?'/exam/trainCourse/insert':'/exam/trainCourse/update',
            data:{
                params:{
                    ...this.state.trainCourseInfo,
                    materialIds
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    trainCourseInfo:{},
                    materialList:[]
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
            let trainCourseInfo={...item,picture:JSON.parse(item.picture)}
            axios.ajax({
                url:'/exam/trainCourse/getCourseMaterialIds',
                data:{
                    params:{id:item.id}
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    this.setState({
                        title:type=='edit'?'编辑用户':'查看详情',
                        isVisible:true,
                        trainCourseInfo,
                        materialList:res.data,
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
                        url:'/exam/trainCourse/delete',
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
        const columns = [
            {
                title: '课程名称',
                dataIndex: 'name',

            }, {
                title: '课程类型',
                dataIndex: 'courseType',
                render(courseType){
                    if (courseType == 1) {
                        return "选修课"
                    } else {
                        return "必修课"
                    }
                }
            },{
                title: '行业类型',
                dataIndex: 'industryName',

            },  {
                title: '工作种类',
                dataIndex: 'workTypeName',
            },
            {
                title: '课程分值',
                dataIndex: 'courseScore',
                render(courseScore){
                    return courseScore||0;
                }
            },
            {
                title: '文档类教材',
                dataIndex: 'materialNumber',
                render(materialNumber,record){
                    return (materialNumber-record.videoMaterialNumber)||0;
                }
            },
            {
                title: '视频类教材',
                dataIndex: 'videoMaterialNumber',
                render(videoMaterialNumber){
                    return videoMaterialNumber||0;
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <ButtonGroup>
                        <Button type="primary"  onClick={() => { this.handleOperator('detail',record)}}>查看</Button>
                        <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>修改</Button>
                        <Button type="primary"  onClick={() => { this.handleOperator('delete',record)}}>删除</Button>
                    </ButtonGroup>


                }
            }
        ];
        const formList = [
            {
                type: 'INPUT',
                label: '课程名称',
                field: 'courseName',
            },
            // {
            //     type: 'INPUT',
            //     label: '行业类别',
            //     field: 'industryCategory',
            // },
            {
                type: 'SELECT',
                label: '行业类别',
                field: 'industryCategory',
                placeholder: '请选择行业类别',
                width: 150,
                list:(_this.state.industryList||[]).map((item)=>{return{id:item.id,name:item.name}})
            },
            // {
            //     type: 'INPUT',
            //     label: '工作种类',
            //     field: 'workType',
            // },
            {
                type: 'SELECT',
                label: '工作种类',
                field: 'workType',
                placeholder: '请选择工作种类',
                width: 170,
                list:(_this.state.workTypeList||[]).map((item)=>{return{id:item.id,name:item.name}})
            },
        ]

        return (
            <div ref='trainCourse'>

                <Card>
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>
                </Card>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={() => { this.handleOperator('create',null)}}>添加</Button>
                        <Button type="primary" onClick={this.handleDelete}>删除</Button>
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
                    title="培训课程信息"
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    getContainer={()=>this.refs.trainCourse}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        //this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            trainCourseInfo:{},
                            materialList:[]
                        })
                    }}
                >
                    <AddForm
                        trainCourseInfo={this.state.trainCourseInfo||{}}
                        materialList={this.state.materialList||[]}
                        imageUrl={this.state.imageUrl||''}
                        dispatchMaterialList={(data)=>this.setState({materialList:data})}
                        dispatchTrainCourse={(data)=>this.setState({trainCourseInfo:data})}
                        disPatchImageUrl={(data)=>this.setState({imageUrl:data})}
                        type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}
export default  TrainCourse;