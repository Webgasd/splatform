import React,{Component} from 'react';
import {Card, Button, Modal, Collapse, Row, Col, Icon} from 'antd';
import ETable from '../../../../components/ETable';
import  BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";

const {Panel}=Collapse;
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
    handleRequest = () => {
        this.params = {pageNo:1}
        this.requestList();
    }
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
            }, {
                title: '地区',
                dataIndex: 'areaName',
            },{
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

        return (
            <div>
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
                            row_selection = 'checkbox'
                        />
                    </div>
                </Card>
                
            </div>
        );
    }
}