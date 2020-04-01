import React,{Component} from 'react';
import {Card, Button, Modal, Collapse, Row, Col} from 'antd';
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
        type: 'INPUT',
        label: '企业名称',
        field: 'enterprise',
    },
    {
        type: 'SELECT',
        label: '类型',
        field: 'kind',
        width: 150,
        list: [{id: '原料采购', name: '原料采购'}, {id: '清洗消毒', name: '清洗消毒'},{id: '废弃物台账', name: '废弃物台账'}]
            //[{id: '月度自查表', name: '月度自查表'}, {id: '自查自检', name: '自查自检'},{id: '进货凭证', name: '进货凭证'},{id: '消毒记录', name: '消毒记录'},{id: '索证索票', name: '索证索票'},{id: '原料采购', name: '原料采购'}]

    },
    {
        type: 'DATE',
        label: '进货时间区间开始',
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
        input:state.ledger
    }),{
        clearLedger,
        changeLedger
    }
)
 class Material extends Component{
    state={
        selectedRowKeys: [], 
        headStatus:false,
        comAmount:'3000',
        perAmount:'300'
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/formatpicture/getPage',
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
   
    handleSubmit = ()=>{
        let type = this.state.type;
        let data = this.detailForm.props.form.getFieldsValue();
        data.purchasedate=moment(data.purchasedate).format("YYYY-MM-DD");
        data.acceptor =  this.props.input.acceptor;
        data.document=this.props.input.document;
        axios.PostAjax({
            url:type=='create'?'/formatpicture/insert':'/formatpicture/update',
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
                content: '请选择一个用户'
            })
            return;
        }
        Modal.confirm({
            content:'确定要删除此用户吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/formatpicture/delete',
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
                        url:'/formatpicture/delete',
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
                title: '企业名称',
                dataIndex: 'enterpriseName'
            },{
                title: '地区',
                dataIndex: 'areaName'
            },{
                title: '类型',
                dataIndex: 'kind'
            },{
                title: '进货日期',
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
                            <Col span={24}><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>
                            
                        </Row>
                }}

        ];

        return (
            <div  ref="ledger">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
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
                    maskClosable={false}
                    getContainer={()=>this.refs.ledger}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    footer={null}
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
export default Material;