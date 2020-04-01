import React,{Component} from 'react';
import { unitName } from "../../../axios/commonSrc";
import {Card, Button, Modal, Upload, message, Collapse} from 'antd';
import AddForm from './AddForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";
import BaseForm from "../../../components/BaseForm";
const Panel = Collapse.Panel;


export default class Legal extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
    }
    params = {
        pageNo:1,
    }
    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/sign/getPage',
            //url:'/government.json',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;})
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
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

    handleSubmit = ()=>{
        let type =this.state.type;
        let data = this.state.signInfo;
        if(data.password==data.password2){
            axios.PostAjax({
                url:type=='create'?'/inspect/sign/insert':'/inspect/sign/update',
                data:{
                    params:{
                        ...data,
                        pic:this.state.picture,
                        operateTime:null
                    }
                }
            }).then((res)=>{
                if(res.status == 'success'){
                    this.setState({
                        isVisible:false,
                        signInfo:{},
                        imageUrl:'',
                        picture:[],
                    })
                    this.requestList();
                }
            })
        }else {
            alert("请输入一致密码")
        }

    }



    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'创建',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                isVisible:true,
                signInfo:{...item,password2:item.password},
                picture:JSON.parse(item.pic||JSON.stringify([])),
                type
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/inspect/sign/delete',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
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
                title: '所属部门',
                dataIndex: 'deptName',
            },{
                title: '姓名',
                dataIndex: 'gaName'
            },{
                title: '职务',
                dataIndex: 'gaUnit',
            }, {
                title: '执法证号',
                dataIndex: 'gaEnforce',
            },{
                title: '联系方式',
                dataIndex: 'gaPhone',
            },{
                title: '是否使用签字库',
                dataIndex: 'status',
                render(status){
                    if(status==0){
                        return '开启'
                    }else {
                        return '关闭'
                    }
                }
            },{
                title: '操作',
                dataIndex:'operation',
                render:(text, item)=>{
                    return <div className='textButtonBox'>
                        <div className='textButton' onClick={() => { this.handleOperator('detail',item)}}>查看</div>
                        <div className='textButton' onClick={()=> {this.handleOperator('edit',item)}}>修改</div>
                        <div className='textButton' onClick={()=> {this.handleOperator('delete',item)}}>删除</div>
                    </div>
                }}

        ];
        const formList = [
            {
                type: 'INPUT',
                label: '姓名',
                field: 'gaName',
            },
        ]
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
                        <Button type="primary" onClick={()=>this.handleOperator('create',null)}>添加</Button>
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
                            row_selection='checkbox'
                        />
                    </div>
                </Card>
                <Modal
                    width='800px'
                    title="签字配置"
                    onOk={this.handleSubmit}
                    destroyOnClose
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    visible={this.state.isVisible}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            signInfo:{},
                            imageUrl:'',
                            picture:[],
                        })
                    }}
                >
                    <AddForm signInfo={this.state.signInfo||{}}
                             imageUrl={this.state.imageUrl||''}
                             picture={this.state.picture||[]}
                             dispatchSignData={(data)=>this.setState({signInfo:data})}
                             disPatchImageUrl={(data)=>this.setState({imageUrl:data})}
                             dispatchPicture={(data)=>this.setState({picture:data})}
                             type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}


