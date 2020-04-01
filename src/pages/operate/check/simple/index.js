import React,{Component} from 'react';
import {Row, Col,Modal, Card, Button, Collapse} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import moment from "moment";
import connect from "react-redux/es/connect/connect";
import {changeSimple, clearSimple} from '../../../../redux/action';

const formList = [
    {
        type: 'INPUT',
        label: '企业名称',
        field: 'enterprise'
    },
    {
        type: 'SELECT',
        label: '餐次',
        field: 'meal',
        initialValue: '',
        width: 200,
        list: [{id: '早餐', name: '早餐'}, {id: '午餐', name: '午餐'}, {id: '晚餐', name: '晚餐'}]
    },{
        type: 'DATE',
        label: '起始日期',
        field: 'start'
    },
    {
        type: 'DATE',
        label: '结束日期',
        field: 'end'
    }
]
const {Panel}=Collapse;
@connect(
    state=>({
        input:state.simple
    }),{
        clearSimple,
        changeSimple
    }
)
class Simple extends Component{
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
            url:'/formatleave/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
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
    handleDetailSubmit = ()=>{
        axios.PostAjax({
            url:'/formatleave/update',
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
                this.props.clearSimple();
                this.requestList();
            }
        })
    }
    handleOperator = (type,item)=>{
        if(type=="edit" || type=='detail'){
            axios.ajax({
                url:'/formatleave/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    this.setState({
                        title:type=='edit'?'审核':'查看详情',
                        isVisible:true,
                        type
                    })
                    let data = res.data;
                    this.props.changeSimple({...data,document:JSON.parse(data.document||JSON.stringify([]))});
                }
            })
        }
    }
    render(){
                const columns = [
            {
                title:"企业名称",
                dataIndex:"enterpriseName"
            },{
                title:"所在区域",
                dataIndex:"areaName"
            },{
                title:"就餐日期",
                dataIndex:"date",
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },{
                title:"就餐类型",
                dataIndex:"type"
            },{
                title:"餐次",
                dataIndex:"meal"
            },{
                title:"就餐人数",
                dataIndex:"number"
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                        return <div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div>
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
            <div ref="simple">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        {/* <Button type="primary" >导出</Button> */}
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
                    getContainer={()=>this.refs.simple}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleDetailSubmit}
                       okText={"确定"}
                       cancelText={"取消"}
                    onCancel={()=>{
                        this.props.clearSimple();
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
export default Simple;