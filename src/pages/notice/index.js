import React,{Component} from 'react';
import { Card,Button,Modal,Collapse } from 'antd';
import ETable from '../../components/ETable';
import  BaseForm  from '../../components/BaseForm';
import AddForm from './AddForm';
import Utils from "../../utils";
import axios from "../../axios";
import BraftEditor from "braft-editor";
import Detail from './DetailForm';
import './style.less'
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const formList = [
    {
        type: 'INPUT',
        label: '标题',
        field: 'title',
    },{
        type: 'INPUT',
        label: '作者',
        field: 'author',
    }
]

export default class Notice extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column

    };
    params = {
        pageNo:1
    }

    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/sys/notice/getPage',
            data:{
                params:{..._this.params}
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
        let data=this.state.noticeData;
        data.content=data.content.toHTML();
        data.enclosure=this.state.picture;
        axios.PostAjax({
            url:type=='create'?'/sys/notice/insert':'/sys/notice/update',
            data:{
                params:{
                    ...data,
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    noticeData:{},
                    picture:[],
                    imageUrl:''
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
                title:'创建通知',
                isVisible:true,
                type
            })
        }else if(type=="edit"){
            axios.ajax({
                url:'/sys/notice/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    let noticeData = res.data;
                    noticeData.content = BraftEditor.createEditorState(noticeData.content)
                    this.setState({
                        title:type=='edit'?'编辑通知':'查看详情',
                        isVisible:true,
                        noticeData,
                        picture:JSON.parse(noticeData.enclosure||JSON.stringify([])),
                        type
                    })
                }
            })
        }else if(type=='detail'){
            axios.ajax({
                url:'/sys/notice/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    let noticeData = res.data;
                    this.setState({
                        title:type=='edit'?'编辑通知':'查看详情',
                        isDetailVisible:true,
                        noticeData,
                    })
                }
            })
        }else if("check"){
            confirm({
                title: '确定发布?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/sys/notice/check',
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
        }else if(type=="delete"){
            confirm({
                title: '确定删除?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/sys/notice/delete',
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
                title: '标题',
                dataIndex: 'title',

            }, {
                title: '作者',
                dataIndex: 'author',
            },{
                title: '时间',
                dataIndex: 'pudate',
                render:Utils.formatDate

            }, {
                title: '发布状态',
                dataIndex: 'status',
                render(status){
                    return {0:"未发布",1: '已发布'}[status]
                }

            },{
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <ButtonGroup>
                        <Button type="primary"  onClick={() => { this.handleOperator('detail',record)}}>查看</Button>
                        <Button type="primary"  onClick={()=> {this.handleOperator('edit',record)}}>修改</Button>
                        <Button type="primary"  onClick={()=> {this.handleOperator('check',record)}}>审核</Button>
                        <Button type="primary"  onClick={() => { this.handleOperator('delete',record) }}>删除</Button>
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
                    title="通知信息"
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            noticeData:{},
                            picture:[],
                            imageUrl:''
                        })
                    }}
                >
                    <AddForm noticeData={this.state.noticeData||{}}
                             dispatchNoticeData={(value)=>this.setState({noticeData:value})}
                             imageUrl={this.state.imageUrl||''}
                             picture={this.state.picture||[]}
                             dispatchPicture={(data)=>this.setState({picture:data})}
                             disPatchImageUrl={(data)=>this.setState({imageUrl:data})}/>
                </Modal>

                <Modal
                    width='1000px'
                    title="通知信息"
                    visible={this.state.isDetailVisible}
                    footer={null}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isDetailVisible:false,
                            noticeData:{},
                        })
                    }}
                >
                    <Detail noticeData={this.state.noticeData||{}}/>
                </Modal>

            </div>
        );
    }
}