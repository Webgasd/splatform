import React,{Component} from 'react';
import {Modal, Card, Button} from 'antd';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import {changeSamplingdeploy, clearSamplingdeploy} from "../../../../redux/action";

@connect(
    state=>({
        input:state.samplingdeploy
    }),{
        clearSamplingdeploy,
        changeSamplingdeploy
    }
)
class Dsamplingdeploy extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        mark:0
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
            //url:'/dishes.json'
            url:'/spotCheckEnterprise/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                console.log(list)
                if(list!=''){this.state.mark=1}
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
            url:type=='create'?'/spotCheckEnterprise/insert':'/spotCheckEnterprise/update',
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
                this.props.clearSamplingdeploy();
                window.location.href = '#/login';
                //this.requestList();
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
            this.setState({
                title:type=='edit'?'修改':'查看',
                userInfo:item,
                isVisible:true,
                type
            })
            this.props.changeSamplingdeploy({...item,document:JSON.parse(item.document||JSON.stringify([]))});
        }
    }
    render(){
        const columns = [
            {
                title:"检测机构全称",
                dataIndex:"enterpriseName"
            },{
                title:"社会信用代码证",
                dataIndex:"number"
            },{
                title:"注册地址",
                dataIndex:"address"
            },{
                title:"负责人",
                dataIndex:"enterpriseCharger"
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
            <div ref="samplingdeploy">
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}} disabled={this.state.mark==1?true:false}>添加</Button>
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
                    getContainer={()=>this.refs.samplingdeploy}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleDetailSubmit}
                    onCancel={()=>{
                        this.props.clearSamplingdeploy();
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
export default Dsamplingdeploy;