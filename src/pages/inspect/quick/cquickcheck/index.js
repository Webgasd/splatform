import React,{Component} from 'react';
import {Card, Button, Form, Select, Modal, Collapse, message, Row, Col, Icon} from 'antd';
import ETable from '../../../../components/ETable';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import {changeCquick,clearCquick} from "../../../../redux/action";

 

@connect(
    state=>({
        input:state.cquick
    }),
    {
        changeCquick,
        clearCquick
    }
)
class Cquickcheck extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300'
    }
    params = {
        pageNo:1,
        mark:0
    }



    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
       
        axios.PostAjax({
            url:'/quickCheckEnterprise/getPage',
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
                if(list!=''){this.state.mark=1}
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
        data.document=this.props.input.document;
        axios.PostAjax({
            
            url:type=='create'?'/quickCheckEnterprise/insert':'/quickCheckEnterprise/update',
            data:{
                
                params:{
                    ...data
                }
               
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    userInfo:{}
                   //关闭弹框
                })
                this.props.clearCquick();
                this.detailForm.props.form.resetFields();
                window.location.href = '#/login';
                
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
                    url:'/quickCheckEnterprise/delete',
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
            this.props.changeCquick({...item,document:JSON.parse(item.document||JSON.stringify([]))});       
           }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/quickCheckEnterprise/delete',
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
        }else if(type=="publicity"){

            Modal.confirm({
                content:'确定要公示吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/quickCheckEnterprise/updateRecord',
                        data: {
                            params: {
                                id: item.id,
                                publicity: '已公示'
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
           
            // {
            //     title: '排序',
            //     dataIndex: 'recordNo',
            //     defaultSortOrder: 'descend',
            //     sorter: (a, b) => a.recordNo - b.recordNo,
            // },
            {
                title: '检测机构全称',
                dataIndex: 'enterpriseName',
               
            },
            {
                title: '简称',
                dataIndex: 'enterpriseNickname',
               
            },{
                title: '社会信用代码证',
                dataIndex: 'number'
            },
            {
                title: '注册地址',
                dataIndex: 'address',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    //console.log(record)
                    return  <Row>
                    <Col ><div className='textButton' onClick={()=> {this.handleOperator('detail',record)}}>查看</div></Col>
                   
                </Row>
                }}

        ];
        let footer = {};
        if(this.state.type == 'detail'){
            footer = {
                footer: null
            }
        }
      //console.log('快检机构配置');
        return (
            <div ref="cquick">

                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}  disabled={this.state.mark==1?true:false}>添加</Button>
                        {/* <Button type="primary" onClick={this.handleDelete}>删除</Button> */}
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
                <Modal {...footer}
                    width='600px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    maskClosable={false}
                    getContainer={()=>this.refs.cquick}
                    onCancel={()=>{
                        this.props.clearCquick();
                        this.detailForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            userInfo:{}
                        })
                    }}
                >
                   <DetailForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.detailForm = inst } />
                </Modal>
            </div>
        );
    }
}
export default  Cquickcheck;