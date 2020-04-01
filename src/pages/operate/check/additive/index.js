import React,{Component} from 'react';
import {Card, Button, Modal, Collapse,Row, Col,} from 'antd';
import ETable from '../../../../components/ETable';
import  BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import {changeAdditive,clearAdditive} from "../../../../redux/action";

const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '企业名称',
        field: 'enterprise',
    },
    {
        type: 'INPUT',
        label: '备案号',
        field: 'recordNo',
    },
    {
        type: 'DATE',
        label: '备案时间开始',
        field: 'start',
    },
    {
        type: 'DATE',
        label: '结束',
        field: 'end',
    },
    {
        type: 'SELECT',
        label: '公示状态',
        field: 'publicity',
        width: 150,
        list: [{id: '已公示', name: '已公示'}, {id: '未公示', name: '未公示'}]
    },
]
@connect(
    state=>({
        input:state.additive
    }),
    {
        changeAdditive,
        clearAdditive
    }
)
class Additive extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300'
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
            url:'/formatadditive/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
               // let list  = res.result.item_list.map((item,i)=>{
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

    handleSubmit = ()=>{
        let type = this.state.type;
        axios.PostAjax({       
            url:type=='create'?'/formatadditive/insert':'/formatadditive/update',
            data:{            
                params:{
                    ...this.props.input
                }             
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                   //关闭弹框
                })
                this.props.clearAdditive();
                this.requestList();
                
            }
        })
    }

    start = () => {
        this.setState({
            selectedRowKeys: [],
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
                    url:'/formatadditive/delete',
                    data:{
                        params:{
                            id:item.id
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
    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'创建',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            axios.ajax({
                url:'/formatadditive/getById',
                data:{
                    params:{
                       id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
            this.setState({
                title:type=='edit'?'编辑':'查看',
                isVisible:true,
                type
            })
            let data = res.data;
            this.props.changeAdditive({...data});
           }
        })}else if(type=="delete"){

            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/formatadditive/delete',
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
        }else if(type=="publicity"){

            Modal.confirm({
                content:'确定要公示吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/formatadditive//updateRecord',
                        data: {
                            params: {
                                id: item.id,
                                publicity: '已公示'
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                           
                            this.requestList();
                        }
                    })
                }
            })
        }
    }


    render() {
        const columns = [
            {
                title: '企业名称',
                dataIndex: 'enterpriseName'
            },  {
                title: '地区',
                dataIndex: 'areaName'
            }, {
                title: '备案号',
                dataIndex: 'recordNo'
            },{
                title: '备案时间',
                dataIndex: 'recordDate',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },
            {
                title: '公示状态',
                dataIndex: 'publicity',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return  record.publicity=='已公示'?<Row>
                            <Col ><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>

                        </Row>:
                        <Row>
                        <Col span={12}><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>
 
                        <Col span={12}><div className='textButton' onClick={() =>{this.handleOperator('publicity',record)}}>公示</div></Col>

                    </Row>
                }}

        ];

        return (
            <div  ref="additive">
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
                <Modal
                    width='1200px'
                    maskClosable={false}
                    getContainer={()=>this.refs.additive}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    footer={null}
                    onOk={this.handleSubmit}
                    okText={"确定"}
                    cancelText={"取消"}
                    onCancel={()=>{
                        this.props.clearAdditive();
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                   <DetailForm type={this.state.type} />
                </Modal>
            </div>
        );
    }
}
export default  Additive;