import React,{Component} from 'react';
import {Card, Button, Form, Select, Modal, Collapse, message, Row, Col, Icon} from 'antd';
import ETable from '../../../../components/ETable';
import BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import {changeLedger,clearLedger} from "../../../../redux/action";

const {Panel}=Collapse;
const formList = [
    {
        type: 'SELECT',
        label: '类型',
        field: 'kind',
        width: 150,
        list: [{id: '电梯', name: '电梯'}, {id: '锅炉', name: '锅炉'},{id: '压力容器', name: '压力容器'},{id: '压力管道', name: '压力管道'},
            {id: '起重机械', name: '起重机械'},{id: '客运索道', name: '客运索道'},{id: '大型游乐设施', name: '大型游乐设施'},
            {id: '场（厂）内专用机动车辆', name: '场（厂）内专用机动车辆'}]
    },

    {
        type: 'DATE',
        label: '录入时间区间开始',
        field: 'start',
    },
    {
        type: 'DATE',
        label: '结束',
        field: 'end',
    },
]
@connect(
    state=>({
        input:state.ledger||''
    }),{
        clearLedger,
        changeLedger
    }
)
 class Material extends Component{
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
            url:'/formatEqup/getPage',
            //url:'ledger.json',
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
    handleRequest = () => {
        this.params = {pageNo:1}
        this.requestList();
    }

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
        data.purchasedate=moment(data.purchasedate).format("YYYY-MM-DD");
      // console.log(this.props)
       data.document=this.props.input.document;
        axios.PostAjax({
            url:type=='create'?'/formatEqup/insert':'/formatEqup/update',
            data:{
                params:{
                   ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false //关闭弹框
                })
                this.props.clearLedger();
                this.requestList();
            }
        })
    }

    start = () => {
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
                content: '请选择一条'
            })
            return;
        }
        Modal.confirm({
            content:'确定要删除吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/formatEqup/delete',
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

           this.props.changeLedger({...item,document:JSON.parse(item.document||JSON.stringify([]))});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/formatEqup/delete',
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
                title: '类型',
                dataIndex: 'kind'
            },{
                title: '录入日期',
                dataIndex: 'purchasedate',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },{
                title: '操作人',
                dataIndex: 'acceptor'
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
            <div ref="ledger">
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
                    width='800px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    getContainer={()=>this.refs.ledger}
                    onCancel={()=>{
                        this.props.clearLedger();
                        this.detailForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            userInfo:{}
                        })
                    }}
                    footer={this.state.type=='detail'?'':[
                        <Button key="back" onClick={this.handleCancel}>
                         Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleSubmit}>
                          OK
                        </Button>
                      ]}
                >
                   <DetailForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.detailForm = inst }/>
                </Modal>
            </div>
        );
    }
}
export default Material;