import React,{Component} from 'react';
import {Row, Col, Icon, Modal, Card, Button, Collapse} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import {changeDishes, clearDishes} from '../../../../redux/action';

const { Panel } = Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '菜品编号',
        field: 'number'
    },{
        type: 'INPUT',
        label: '菜品类别',
        field: 'type'
    },{
        type: 'INPUT',
        label: '菜品名称',
        field: 'name'
    },{
        type: 'INPUT',
        label: '价格',
        field: 'price'
    }
]
@connect(
    state=>({
        input:state.dishes
    }),{
        clearDishes,
        changeDishes
    }
)
class Dishes extends Component{
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
            url:'/formatdishes/getPage',
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
        console.log(filterParams)
        this.params = filterParams;
        this.requestList();
    };
    handleDetailSubmit = ()=>{
        let type =this.state.type;
        axios.PostAjax({
            url:type=='create'?'/formatdishes/insert':'/formatdishes/update',
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
                this.props.clearDishes();
                this.requestList();
            }
        })
    }
    handleRequest = () => {
        this.params = {pageNo:1}
            this.requestList();
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
                    // url:'/post.json',
                    url:'/formatdishes/delete',

                    data:{
                        params:{
                            fdId: item.id
                        }
                    }
                }).then((res)=>{

                    if(res.status == 'success'){

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
            this.props.clearDishes();
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                userInfo:item,
                isVisible:true,
                type
            })
            this.props.changeDishes({...item,photo:JSON.parse(item.photo||JSON.stringify([]))});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                         url: '/formatdishes/delete',
                        data: {
                            params: {
                                fdId: item.id
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
                title:"菜品编号",
                dataIndex:"number"
            },{
                title:"菜品名称",
                dataIndex:"name"
            },{
                title:"价格",
                dataIndex:"price"
            },{
                title:"菜品类别",
                dataIndex:"type"
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
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
            <div ref="dishes">
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
                    width='600px'
                    maskClosable={false}
                    getContainer={()=>this.refs.dishes}
                    title={this.state.title}
                    onOk={this.handleDetailSubmit}
                       okText={"确定"}
                       cancelText={"取消"}
                    destroyOnClose
                    visible={this.state.isVisible}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <DetailForm type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}
export default Dishes;