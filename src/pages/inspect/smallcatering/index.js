import React,{Component} from 'react';
import {Card, Button, Row, Col, Modal, Icon} from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import AddForm from './AddForm'
import DailyForm from './DailyForm'
import "./style.less"
import {changeSmallcatering, clearInput} from "../../../redux/action";
import {connect} from "react-redux";
import ViewForm from './ViewForm'



// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
    {
        type: 'SELECT',
        label: '年度',
        field: 'year',
        list: [{id: '0', name: '2019'}, {id: '1', name: '2018'}, {id: '2', name: '2017'}]
    },  {
        type: 'SELECT',
        label: '检查类型',
        field: 'kind',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '日常检查'}, {id: '1', name: '双随机'}, {id: '2', name: '专项检查'}]
    },
    {
        type: 'SELECT',
        label: '所在区域',
        field: 'area',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '黄岛区'}, {id: '1', name: '市南区'}, {id: '2', name: '市北区'}]
    },
    {
        type: 'INPUT',
        label: '被检单位(对象)',
        field: 'checkclass',
    },
    {
        type: 'INPUT',
        label: '检查人员',
        field: 'person',
    },
    {
        type: 'TIME',
        label: '检查日期',
        field: 'date',
    },
    {
        type: 'SELECT',
        label: '完成情况',
        field: 'achieve',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '正在检查'}, {id: '1', name: '已完成'}]
    },
    {
        label: '检查结果',
    },
    {
        type: 'CHECKBOX',
        label: '检查结果',
        field: 'result',
    },
    {
        type: 'CHECKBOX',
        label: '结果处理',
        field: 'resultdeal',
    },
    {
        type: 'SELECT',
        label: '巡查频次',
        field: 'rate',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '1次'}, {id: '1', name: '2次'}]
    },
    {
        type: 'INPUT',
        label: '本年度第_次检查',
        field: 'num',
    },
    {
        type: 'SELECT',
        label: '是否整改复查',
        field: 'rate',
        initialValue: '0',
        width: 150,
        list: [{id: '0', name: '是'}, {id: '1', name: '否'}]
    }
]


class smallcatering extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300'
    }
    params = {
        //page:1
        pageNo:1
    }

    clearInputData=()=>{
        this.props.dispatch(clearInput())
    }

    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }


    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/dailyFood/getPage',
            data:{
                params:{
                    industry:1
                }
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;})
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;
                        _this.requestList();
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

    handleAdd = ()=>{
        this.setState({
            isaddVisible:true
        })
    }

    handleSubmit = ()=>{
        let _this=this
        axios.PostAjax({
            url:'/post.json',
            data:{
                params:{
                    ..._this.props.smallcatering
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false
                })
                this.requestList();
            }
        })
    }


    start = () => {
        this.setState({
            selectedRowKeys: [],
        })
    }

    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleOperator = (type,item)=>{
        if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                isVisible:true,
                type
            })
            this.props.dispatch(changeSmallcatering(item))
        }
    }
    handleDaily = (item) =>{
        this.setState({
            title:'日志',
            isdaVisible:true,
            userInfo:item,
        })
    }


    render() {
        const columns = [
            {
                title: '年度',

                dataIndex: 'checkDate',

            },{
                title: '所属区域',
                dataIndex: 'region',
            },
            {
                title: '被检单位（对象）',
                dataIndex: 'checkObject',
            },
            {
                title: '检查日期',
                dataIndex: 'checkDate',
            },
            {
                title: '检查人员',
                dataIndex: 'supervisor',
            },
            {
                title: '检查结果',
                dataIndex: 'checkResult',
            },
            {
                title: '结果处理',
                dataIndex: 'resultProcess',
            },
            {
                title: '巡查频次',
                dataIndex: 'checkFrequence',
            },
            {
                title: '本年度第_次检查',
                dataIndex: 'checkCount',
            },
            {
                title: '是否整改复查',
                dataIndex: 'checkResult',
            },
            {
                title: '完成情况',
                dataIndex: 'checkResult',
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, item) => {
                    return <Row>
                        <Col span={12}><div className='textButton' onClick={() => { this.handleOperator('detail',item)}}>查看</div></Col>
                        <Col span={12}><div className='textButton' onClick={()=>{this.handleDaily(item.key)}}>日志</div></Col>
                    </Row>
                }
            }
            ];
        const SearchForm =<div style={{display:'table-cell',verticalAlign:'middle',paddingLeft:30}}><BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
        const Information = <Row style={{height:120}}>
            <Col span={3} style={{margin:5,marginRight:30,background:"#99CC66",height:"95px",marginLeft:" 70px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="profile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    企业基本档案
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.comAmount} 家</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#33CCCC",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="solution" style={{fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}}/>
                    人员基本档案
                </div>
                <div style={{margin:10,marginLeft:5}}>数量: {this.state.perAmount} 人</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#FF9900",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="schedule" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    省局许可系统
                </div>
                <div style={{margin:10,marginLeft:5}}>门户超链接</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#99CC00",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="file-search" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    信用体系系统
                </div>
                <div style={{margin:10,marginLeft:5}}>门户超链接</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#0066CC",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="smile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    企业基本档案
                </div>
                <div style={{margin:10,marginLeft:5}}>门户超链接</div>
            </Col>

            <Col span={3} style={{margin:5,marginRight:30,background:"#3399CC",height:"95px"}}>
                <div style={{fontSize:16,color:"white",fontWeight:1000}}>
                    <Icon type="smile" style={{ fontSize: '35px', color: '#FFFFFF' ,marginLeft:5,margin:10}} />
                    企业基本档案
                </div>
                <div style={{margin:10,marginLeft:5}}>门户超链接</div>
            </Col>
        </Row>
        return (
            <div>
                <div style={{height:120,display:'table',width:'100%'}}>
                    {this.state.headStatus?SearchForm:Information}
                </div>
                <Card>
                    <div className='button-box-left'>
                        <Button type="primary" onClick={()=>this.setState({headStatus:this.state.headStatus?false:true})}>查询</Button>
                    </div>
                </Card>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={this.handleAdd}>添加</Button>
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
                <Modal footer={null}
                       width='800px'
                       destroyOnClose={true}
                       title="添加小餐饮日常检查"
                       visible={this.state.isaddVisible}
                       onCancel={()=>{
                           this.clearInputData()
                           this.setState({
                               isaddVisible:false
                           })
                       }}
                >
                    <AddForm />
                </Modal>
                <Modal
                    width='800px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                        })
                        this.props.dispatch(changeSmallcatering({}))
                    }}
                >
                    <ViewForm type={this.state.type}/>
                </Modal>
                <Modal
                    width='800px'
                    title={this.state.title}
                    visible={this.state.isdaVisible}
                    onOk={this.handleDaily}
                    onCancel={()=>{
                        this.setState({
                            isdaVisible:false,
                        })
                    }}
                >
                    <DailyForm />
                </Modal>
            </div>
      )
    }
}

const mapStateToProps=(state)=>({
    smallcatering:state.smallcatering,

})

export default connect(mapStateToProps)(smallcatering);


