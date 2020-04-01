import React,{Component} from 'react';
import {Card, Button, Form, Select, Modal, Collapse, message, Row, Col, Icon} from 'antd';
import ETable from '../../../../components/ETable';
import  BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";

const formList = [
    {
        type: 'INPUT',
        label: '企业名称',
        field: 'enterprise',
    },
    {
        type: 'INPUT',
        label: '产品类型',
        field: 'type',
    },
    {
        type: 'INPUT',
        label: '产品名称',
        field: 'name',
    },   {
        type: 'INPUT',
        label: '供应商',
        field: 'supplier',
    }
   
]

export default class Material extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300'
    }
    params = {
        pageNo:1
    }



    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/formatgoods/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                //let list  = res.result.item_list.map((item,i)=>{
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



    start = () => {
        // ajax request after empty completing
        this.setState({
            selectedRowKeys: [],
        })
    }

   
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

  

    render() {
        const columns = [
          {
                title: '企业名称',
                dataIndex: 'enterpriseName',
            },{
                title: '地区',
                dataIndex: 'areaName',
            },
            {
                title: '产品类型',
                dataIndex: 'type'
            },
            {
                title: '产品名称',
                dataIndex: 'name'
            }, {
                title: '供应商',
                dataIndex: 'supplier'
            },
            {
                title: '当前库存',
                dataIndex: 'total',
            },
            {
                title: '单位',
                dataIndex: 'goodsType',
            },
            {
                title: '品牌',
                dataIndex: 'brand',
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
                
            </div>
        );
    }
}