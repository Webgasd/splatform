import React,{Component} from 'react';
import {Modal, Card, Collapse, Button} from 'antd';
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
        if(type=='detail'){
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
                        title:'查看详情',
                        isVisible:true,
                        type
                    })
                    let data = res.data;
                    //console.log(data)
                    this.props.changeParty({...data,document:JSON.parse(data.document||JSON.stringify([]))});
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
                    return <div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>审核</div>
                }
            }
        ];

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
                    width='800px'
                    maskClosable={false}
                    getContainer={()=>this.refs.party}
                    title={this.state.title}
                    visible={this.state.isVisible}
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