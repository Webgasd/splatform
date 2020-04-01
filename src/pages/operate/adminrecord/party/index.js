import React,{Component} from 'react';
import {Row, Col, Modal, Card, Button, Collapse} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import moment from "moment";
import connect from "react-redux/es/connect/connect";
import {changeParty, clearParty} from '../../../../redux/action';

const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '企业名称',
        field: 'enterprise'
    },{
        type: 'INPUT',
        label: '申报人',
        field: 'person'
    },{
        type: 'INPUT',
        label: '备案号',
        field: 'record'
    }
]
@connect(
    state=>({
        input:state.party
    }),{
        clearParty,
        changeParty
    }
)
class Party extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        mar:'0'
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
            url:'/formatparty/getPage',
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
            url:type=='create'?'/formatparty/insert':'/formatparty/update',
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
                this.props.clearParty();
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
                    url:'/formatparty/delete',
                    data:{
                        params:{
                            fpId: item.id
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
        }else if(type=="edit" || type=='detail'){
            axios.ajax({
                url:'/formatparty/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    this.setState({
                        title:type=='edit'?'编辑':'查看详情',
                        isVisible:true,
                        type
                    })
                    let data = res.data;
                    //console.log(data)
                    this.props.changeParty({...data,document:JSON.parse(data.document||JSON.stringify([]))});
                }
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/formatparty/delete',
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
        }else if(type=="report"){
            Modal.confirm({
                title:'信息',
                content:'确定上报吗，上报后不可修改',
                onOk:()=>{
                axios.ajax({
                    url: '/formatparty/updateRecord',
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
    render(){

        const columns = [
            {
                title:"所在企业",
                dataIndex:"enterpriseName"
            },{
                title:"所在地区",
                dataIndex:"areaName"
            },{
                title:"备案号",
                dataIndex:"record"
            },{
                title:"申报人",
                dataIndex:"person"
            },{
                title:"备案时间",
                dataIndex:"time",
                render:(item)=>{
                    return item===''?moment():moment(item).format("YYYY-MM-DD HH:mm:ss")
                }
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    // return item.up=='未上报'?<Row>
                    //     <Col span={6}><div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div></Col>
                    //     <Col span={6}><div className="textButton" onClick={()=>{this.handleOperator('edit',item)}}>修改</div></Col>
                    //     <Col span={6}><div className="textButton" onClick={()=>{this.handleOperator('delete',item)}}>删除</div></Col>
                    //     <Col span={6}><div className="textButton" onClick={()=>{this.handleOperator('report',item)}}>上报</div></Col>
                    // </Row>:
                        return <Row>
                        <Col span={12}><div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div></Col>
                        <Col span={12}><div className="textButton" onClick={()=>{this.handleOperator('delete',item)}}>删除</div></Col>
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
            <div ref="party">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        {/*<Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>*/}
                        {/* <Button type="primary" onClick={()=>{this.handleDelete()}}>删除</Button> */}
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
                    getContainer={()=>this.refs.party}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleDetailSubmit}
                       okText={"确定"}
                       cancelText={"取消"}
                    onCancel={()=>{
                        this.props.clearParty();
                        this.setState({
                            isVisible:false,
                        })
                    }}
                >
                    <DetailForm type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}
export default Party;