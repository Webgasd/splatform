import React,{Component} from 'react';
import {Card, Button, Modal, Collapse, Row, Col} from 'antd';
import ETable from '../../../components/ETable';
import  BaseForm  from '../../../components/BaseForm';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm';
const Panel = Collapse.Panel;
const confirm = Modal.confirm;
const formList = [
    {
        type: 'INPUT',
        label: '教材名称',
        field: 'name',
    },
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
        label: '上传人',
        field: 'operator',
    },
]

export default class TrainMaterial extends Component{
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
            url:'/exam/trainMaterial/getPage',
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

    handleSubmit = ()=>{
        let type = this.state.type;
        axios.PostAjax({
            url:type=='create'?'/exam/trainMaterial/insert':'/exam/trainMaterial/update',
            data:{
                params:{
                    ...this.state.materialInfo,
                    picture:this.state.picture,
                    content:this.state.content
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    materialInfo:{},
                    picture:[],
                    content:[],
                    imageUrl:''
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
            let materialInfo={contentType:2}
            this.setState({
                title:'创建员工',
                isVisible:true,
                materialInfo,
                type
            })
        }else if(type=="edit" || type=='detail'){
            let materialInfo={...item}
            this.setState({
                title:type=='edit'?'编辑用户':'查看详情',
                isVisible:true,
                materialInfo,
                picture:JSON.parse(item.picture),
                content:JSON.parse(item.content),
                type
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
                        url:'/exam/trainMaterial/delete',
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
                title: 'id',
                dataIndex: 'key',

            }, {
                title: '培训教材名称',
                dataIndex: 'name'
            },{
                title: '行业类别',
                dataIndex: 'industryName',

            },{
                title: '工作种类',
                dataIndex: 'workTypeName',
            },{
                title: '上传人',
                dataIndex: 'operator',
            },{
                title: '教材种类',
                dataIndex: 'contentType',
                render(contentType){
                    if (contentType == 1) {
                        return "视频教材"
                    } else {
                        return "文本教材"
                    }
                }
            },{
                title: '课程分值',
                dataIndex: 'score',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return  <Row>
                        <Col span={7}><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>
                        <Col span={7}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>
                        <Col span={7}><div className='textButton' onClick={() => { this.handleOperator('delete',record) }}>删除</div></Col>
                    </Row>
                }
            }
        ];

        return (
            <div ref="material">
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
                    width='700px'
                    title="教材信息"
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    getContainer={()=>this.refs.material}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            materialInfo:{},
                            picture:[],
                            content:[],
                            imageUrl:''
                        })
                    }}
                >
                    <AddForm materialInfo={this.state.materialInfo||{}}
                             picture={this.state.picture||[]}
                             content={this.state.content||[]}
                             imageUrl={this.state.imageUrl||''}
                             dispatchMaterialInfo={(data)=>this.setState({materialInfo:data})}
                             dispatchPicture={(data)=>this.setState({picture:data})}
                             dispatchContent={(data)=>this.setState({content:data})}
                             disPatchImageUrl={(data)=>this.setState({imageUrl:data})}
                             type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}