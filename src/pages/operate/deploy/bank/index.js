import React,{Component} from 'react';
import {Card, Button, Form, Select, Modal, Collapse, message, Row, Col, Icon} from 'antd';
import ETable from '../../../../components/ETable';
import  BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import {changeInput} from "../../../../redux/action";
import connect from "react-redux/es/connect/connect";

const { Panel } = Collapse;
const formList = [
   
    {
        type: 'INPUT',
        label: '原料类型',
        field: 'materialcategory',
    },
    {
        type: 'INPUT',
        label: '原料名称',
        field: 'materialname',
    },
    {
        type: 'INPUT',
        label: '品牌',
        field: 'brand',
    }
]
@connect(
    state=>({
        input:state.input
    }),
    {
        changeInput,
    }
)

 class Bank extends Component{
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
            url:'/formatoriginextra/getPage',
           // url:'/bank.json',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
              //  let list  = res.result.item_list.map((item,i)=>{
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


    handleCancel=()=>{
        this.detailForm.props.form.resetFields();//表单重置
        this.setState({
            isVisible:false,
            userInfo:{}
        })
    }
    handleSubmit = ()=>{
        let type = this.state.type;
        let data = this.detailForm.props.form.getFieldsValue();
        axios.ajax({
            url:type=='create'?'/formatoriginextra/insert':'/formatoriginextra/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false ,
                    userInfo:{}//关闭弹框
                })
                this.detailForm.props.form.resetFields();
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
                    url:'/formatoriginextra/delete',
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
            this.props.changeInput({...item});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/formatoriginextra/delete',
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
       // console.log(this.state.type)
        const columns = [
            {
                title: '原料名称',
                dataIndex: 'materialname'
            }, {
                title: '原料类型',
                dataIndex: 'materialcategory'
            },{
                title: '静含量/规格	',
                dataIndex: 'specifications'
            },{
                title: '品牌',
                dataIndex: 'brand'
            },{
                title: '生产商',
                dataIndex: 'manufacturer'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return  <Row>
                            <Col span={7}><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>
                            <Col span={7}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>
                            <Col span={7}><div className='textButton' onClick={() =>{this.handleOperator('delete',record)}}>删除</div></Col>
                        </Row>
                }}

        ];

        return (
            <div>
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
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
                    width='500px'
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
                    maskClosable={false}
                    footer={this.state.type=='detail'?'':[
                        <Button key="back" onClick={this.handleCancel}>
                         Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleSubmit}>
                          OK
                        </Button>
                      ]}          
                >
                   <DetailForm type={this.state.type} userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.detailForm = inst }/>
                </Modal>
            </div>
        );
    }
}
export default Bank;