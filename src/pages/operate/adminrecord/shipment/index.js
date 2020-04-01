import React,{Component} from 'react';
import {Row, Col, Icon, Modal, Card, Button, Collapse, message, Upload} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import LogForm from "./LogForm";
import ImportForm from "./ImportForm";
import connect from "react-redux/es/connect/connect";
import {changeShipment, clearShipment} from '../../../../redux/action';
import moment from "moment";
import {commonUrl} from "../../../../axios/commonSrc";

const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '产品名称',
        field: 'name'
    },{
        type: 'SELECT',
        label: '类型',
        field: 'type',
        placeholder: '',
        //initialValue: '0',
        width: 200,
        list: [{id: '散装食品', name: '散装食品'}, {id: '预包装食品', name: '预包装食品'}]
    },{
        type: 'INPUT',
        label: '供应商',
        field: 'supplier'
    }
]
@connect(
    state=>({
        input:state.shipment
    }),{
        clearShipment,
        changeShipment
    }
)
class Shipment extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
    }
    params = {
        //page:1
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            //url:'/dishes.json'                        ',
            url:'/formatgoods/getPageOut',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    // let list  = res.result.item_list.map((item,i)=>{
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
    handleDetailSubmit = ()=>{
        let type =this.state.type;
        axios.PostAjax({
            url:type=='create'?'/formatgoods/insertOut':'/formatgoods/updateOut',
            data:{
                params:{
                    ...this.props.input
                }
            }

        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false //关闭弹框
                })
                this.props.clearShipment();
                this.requestList();
            }
        })
    }
    handleLogSubmit = ()=>{
        let data = this.logForm.props.form.getFieldsValue();
        axios.ajax({
            url:'/post.json',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    islogVisible:false
                })
                this.requestList();
            }
        })
    }
    handleImpSubmit = ()=>{
        let data = this.importForm.props.form.getFieldsValue();
        axios.ajax({
            url:'/post.json',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isimpVisible:false
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
                    url:'/formatgoods/deleteOut',
                    data:{
                        params:{
                            id: item.id
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
    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'添加',
                isVisible:true,
                type
            })
        }else if(type =='import'){
            this.setState({
                title:'导入',
                isimpVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                userInfo:item,
                isVisible:true,
                type
            })
            this.props.changeShipment({...item,document:JSON.parse(item.document||JSON.stringify([]))});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/formatgoods/deleteOut',
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
        }else if(type=='log'){
            this.setState({
                title:'日志',
                userInfo:item,
                islogVisible:true,
                type
            })
        }
    }
    render(){
        const columns = [
            {
                title:"产品类型",
                dataIndex:"type"
            },{
                title:"产品名称",
                dataIndex:"name"
            },{
                title:"供应商",
                dataIndex:"supplier"
            },{
                title:"生产日期",
                dataIndex:"time",
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },{
                title:"有效期限",
                dataIndex:"day"
            },{
                title:"出货数量",
                dataIndex:"num"
            },{
                title:"单位",
                dataIndex:"goodsType"
            },{
                title:"出货日期",
                dataIndex:"date",
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    return <Row>
                        <Col span={12}><div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div></Col>
                        {/*<Col span={8}><div className="textButton" onClick={()=>{this.handleOperator('edit',item)}}>修改</div></Col>*/}
                        <Col span={12}><div className="textButton" onClick={()=>{this.handleOperator('delete',item)}}>删除</div></Col>
                        {/*<Col span={6}><div className="textButton" onClick={()=>{this.handleOperator('log',item)}}>日志</div></Col>*/}
                    </Row>
                }
            }
        ];
        let footer = {};
        if(this.state.type == 'detail'){
            footer = {
                footer: null
            }
        }
        return(
            <div ref="shipment">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        {/*<Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>*/}
                        {/*<Button type="primary" onClick={()=>{this.handleDelete()}}>删除</Button>*/}
                        {/*<Upload action={commonUrl+"/formatgoods/importExcelOut"}*/}
                                {/*showUploadList={false}*/}
                                {/*withCredentials={true}*/}
                                {/*onChange={(info)=>{*/}
                                    {/*if (info.file.status === 'done') {*/}
                                        {/*message.success(`${info.file.name} file uploaded successfully`);*/}
                                        {/*this.requestList();*/}
                                    {/*} else if (info.file.status === 'error') {*/}
                                        {/*message.error(`${info.file.name} file upload failed.`);*/}
                                    {/*}*/}
                                {/*}}>*/}
                            {/*<Button type="primary" >导入</Button>*/}
                        {/*</Upload>*/}
                        {/*<Button type="primary" >导出</Button>*/}
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
                <Modal {...footer}
                    width='800px'
                    maskClosable={false}
                    getContainer={()=>this.refs.shipment}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleDetailSubmit}
                       okText={"确定"}
                       cancelText={"取消"}
                    onCancel={()=>{
                        this.props.clearShipment();
                        this.setState({
                            isVisible:false,
                        })
                    }}
                >
                    <DetailForm type={this.state.type}/>
                </Modal>
                <Modal footer={null}
                       width='800px'
                       title={this.state.title}
                       visible={this.state.islogVisible}
                       onOk={this.handleLogSubmit}
                       okText={"确定"}
                       cancelText={"取消"}
                       onCancel={()=>{
                           this.setState({
                               islogVisible:false,
                           })
                       }}
                >
                    <LogForm  userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.logForm = inst }/>
                </Modal>
                <Modal footer={null}
                       width='800px'
                       title={this.state.title}
                       visible={this.state.isimpVisible}
                       onOk={this.handleImpSubmit}
                       okText={"确定"}
                       cancelText={"取消"}
                       onCancel={()=>{
                           this.setState({
                               isimpVisible:false,
                           })
                       }}
                >
                    <ImportForm  userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.importForm = inst }/>
                </Modal>
            </div>
        );
    }
}
export default Shipment;