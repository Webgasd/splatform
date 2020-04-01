import React,{Component} from 'react';
import {Card, Button, Modal,Row, Col} from 'antd';
import ETable from '../../../../components/ETable';
import BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import {changeGquick,clearGquick} from "../../../../redux/action";
const formList = [
    {
        type: 'INPUT',
        label: '检测机构名称',
        field: 'enterprise',
    }, {
        type: 'INPUT',
        label: '简称',
        field: 'nickname',
    }

]
 

@connect(
    state=>({
        input:state.gquick
    }),
    {
        changeGquick,
        clearGquick
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
        pageNo:1
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
                this.props.clearGquick();
                //this.detailForm.props.form.resetFields();
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
            this.props.changeGquick({...item,document:JSON.parse(item.document||JSON.stringify([]))});       
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
        }else if(type=="check"){

            Modal.confirm({
                content:'确定吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/quickCheckEnterprise/check',
                        data: {
                            params: {
                                id: item.id,
                                state: 1
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
            //     title: '审核状态',
            //     dataIndex: 'state',
            //     defaultSortOrder: 'descend',
            //     sorter: (a, b) => a.state - b.state,
            //     render:(text, record)=>{
            //       //  console.log(record.state)
            //         return record.state==0?'未审核':'已审核'
            //     }
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
                    return(

                     <Row>
                    <Col span={6} ><div className='textButton' onClick={()=> {this.handleOperator('detail',record)}}>查看</div></Col>
                    <Col span={6}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>
                    <Col span={6}><div className='textButton' onClick={() =>{this.handleOperator('delete',record)}}>删除</div></Col>
                </Row>)
                }}

        ];
      
        return (
            <div ref="gquick">
              <Card>        
                 <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                </Card>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
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
                <Modal
                    width='600px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    maskClosable={false}
                    getContainer={()=>this.refs.gquick}
                    onCancel={()=>{
                        this.props.clearGquick();
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