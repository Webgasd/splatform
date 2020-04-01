import React,{Component} from 'react';
import {Card, Button, Form, Select, Modal, message, Row, Col, Icon, Collapse} from 'antd';
import ETable from '../../../../components/ETable';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import BaseForm  from '../../../../components/BaseForm';

const { Panel } = Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '名称',
        field: 'name'
    }
]
export default class Valid extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300',
        initialValue:''
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
        axios.PostAjax({
            url:'/formatmeasurement/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
               // let list  = res.result.item_list.map((item,i)=>{
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
        let data = this.detailForm.props.form.getFieldsValue();

        axios.ajax({
            url:type=='create'?'/formatmeasurement/insert':'/formatmeasurement/update',
            data:{
                params:{
                   ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false, //关闭弹框
                    userInfo:{}
                })
                this.detailForm.props.form.resetFields();//重置到上一环节
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
                    url:'/formatmeasurement/delete',
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
                        _this.detailForm.props.form.resetFields();
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
                title:'创建',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'编辑':'查看',
                isVisible:true,
                userInfo:item,
                type
            })
          //  console.log(item);
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/formatmeasurement/delete',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                            this.setState({
                                isVisible:false
                            })
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
                title: '名称',
                dataIndex: 'name'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return  <Row>
                            <Col span={12}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>
                            <Col span={12}><div className='textButton' onClick={() =>{this.handleOperator('delete',record)}}>删除</div></Col>
                        </Row>
                }}

        ];

        return (
            <div>
                <Collapse accordion={true}>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
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
                    width='600px'
                    maskClosable={false}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    okText={"确定"}
                    cancelText={"取消"}
                    onCancel={()=>{
                        this.detailForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            userInfo:{}
                        })
                    }}
                >
                   <DetailForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.detailForm = inst }/>
                </Modal>
            </div>
        );
    }
}