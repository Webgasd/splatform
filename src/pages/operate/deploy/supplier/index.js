import React,{Component} from 'react';
import {Row, Col, Icon, Modal, Card, Button, Collapse} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import {changeSupplier, clearSupplier} from '../../../../redux/action';

const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '供应商名称',
        field: 'name'
    },{
        type: 'INPUT',
        label: '营业执照号',
        field: 'number'
    },{
        type: 'INPUT',
        label: '地址',
        field: 'address'
    },{
        type: 'SELECT',
        label: '供应商类型',
        field: 'stype',
        initialValue: '',
        width: 175,
        list: [{id: '流通企业', name: '流通企业'}, {id: '生产企业', name: '生产企业'}]
    }
]
@connect(
    state=>({
        input:state.supplier
    }),{
        clearSupplier,
        changeSupplier
    }
)
class Supplier extends Component{
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
            url:'/formatsupplier/getPage',
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
            url:type=='create'?'/formatsupplier/insert':'/formatsupplier/update',
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
                this.props.clearSupplier();
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
                    url:'/formatsupplier/delete',
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
                title:'创建',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'编辑':'查看详情',
                isVisible:true,
                addInfo:item,
                type
            })
            this.props.changeSupplier({...item,document:JSON.parse(item.document||JSON.stringify([]))});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/formatsupplier/delete',
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
                title:"供应商名称",
                dataIndex:"name"
            },{
                title:"营业执照号",
                dataIndex:"number"
            },{
                title:"社会信用代码证号",
                dataIndex:"license"
            },{
                title:"地址",
                dataIndex:"address"
            },{
                title:"联系人",
                dataIndex:"person"
            },{
                title:"联系电话",
                dataIndex:"phone"
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    return <Row>
                        <Col span={7}><div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div></Col>
                        <Col span={7}><div className="textButton" onClick={()=>{this.handleOperator('edit',item)}}>修改</div></Col>
                        <Col span={7}><div className="textButton" onClick={()=>{this.handleOperator('delete',item)}}>删除</div></Col>
                    </Row>
                }}
        ];
        let footer = {};
        if(this.state.type == 'detail'){
            footer = {
                footer: null
            }
        }
        return(
            <div ref="supplier">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
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
                    getContainer={()=>this.refs.supplier}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleDetailSubmit}
                       okText={"确定"}
                       cancelText={"取消"}
                    onCancel={()=>{
                        this.props.clearSupplier();
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
export default Supplier;