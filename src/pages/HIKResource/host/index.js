import React,{Component} from 'react';
import {Card, Button, Form, Select, Modal, message, Row, Col, Icon, Collapse} from 'antd';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import DetailForm from "./DetailForm";
import  BaseForm  from './../../../components/BaseForm';

const { Panel } = Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '名称',
        field: 'name'
    }
]
class host extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300',
        initialValue:'',
        host: {
            id:0,
            hostNumber: "",
            appkey: "",
            appsecret:"",
        }
    }
    params = {
        pageNo:1,
        pageSize:50
    }



    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/HIKResource/getPageHost',
            data:{
                params:this.params
            }
        }).then((res)=>{
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
            url:type=='create'?'/HIKResource/insert':'/HIKResource/update',
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
        }
        else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/HIKResource/delete',
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
                title: 'host',
                dataIndex: 'hostNumber',
                width:400,
            },
            {
                title: 'appkey',
                dataIndex: 'appkey',
                width:300,
            },
            {
                title: 'appsecret',
                dataIndex: 'appsecret',
                width:400,
            },
            {
                title: '操作',
                dataIndex:'operation',
                width:200,
                render:(text, record)=>{
                    return  <Row>
                        <Col span={7}><div className='textButton' onClick={() => { this.handleOperator('edit',record)}}>修改</div></Col>
                        <Col span={7}><div className='textButton' onClick={() => { this.handleOperator('delete',record)}}>删除</div></Col>
                    </Row>
                }}

        ];

        return (
            <div>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>

                        <Button type="primary" onClick={()=> {this.requestList()}}>刷新</Button>
                        <Button type="primary" disabled={this.state.list&&this.state.list.length?true:false} onClick={()=> {this.handleOperator('create',null)}}>添加</Button>

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
export default host;