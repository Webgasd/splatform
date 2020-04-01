import React,{Component} from 'react';
import {Modal, Card, Collapse, Button} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import {connect} from "react-redux";
import {changeCleaning, clearCleaning} from "../../../../redux/action";
import moment from "moment";

const {Panel}=Collapse;

@connect(
    state=>({
        input:state.cleaning
    }),{
        clearCleaning,
        changeCleaning
    }
)
class Cleaning1 extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        //console.log(this.params)
        let _this = this;
        axios.PostAjax({
            //url:'/cleaning.json',
            url:'/formatdisinfection/getPage',
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
    handleOperator = (type,item)=>{
        if(type=="detail"){
            this.setState({
                title:'查看详情',
                isVisible:true,
                addInfo:item,
                type
            })
            this.props.changeCleaning(item);
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
                title:"物品名称",
                dataIndex:"name"
            },{
                title:"数量",
                dataIndex:"amount"
            },{
                title:"消毒日期",
                dataIndex:"date",
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },{
                title:"消毒人员",
                dataIndex:"person"
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    return <div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div>
                }
            }
        ];
        const formList = [
            {
                type: 'INPUT',
                label: '企业名称',
                field: 'enterprise'
            },{
                type: 'DATE',
                label: '起始日期',
                field: 'start'
            },
            {
                type: 'DATE',
                label: '结束日期',
                field: 'end'
            },
            {
                type: 'INPUT',
                label: '物品名称',
                field: 'name'
            }, {
                type: 'INPUT',
                label: '数量',
                field: 'amount'
            }, {
                type: 'INPUT',
                label: '消毒人员',
                field: 'person'
            }
        ]

        return(
            <div ref="cleaning">
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
                            row_selection='checkbox'
                        />
                    </div>
                </Card>
                <Modal footer={null}
                    //0destroyOnClose
                    width='500px'
                    maskClosable={false}
                    getContainer={()=>this.refs.cleaning}
                    title={this.state.title}
                       okText={"确定"}
                       cancelText={"取消"}
                    visible={this.state.isVisible}
                    onCancel={()=>{
                        this.detailForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            addInfo:{}
                        })
                    }}
                >
                    <DetailForm type={this.state.type} addInfo={this.state.addInfo||{}} wrappedComponentRef={(inst) => this.detailForm = inst }/>
                </Modal>
            </div>
        );
    }
}
export default Cleaning1;