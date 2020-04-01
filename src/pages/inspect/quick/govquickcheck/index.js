import React,{Component} from 'react';
import {Card, Button, Modal, Row, Col, Upload, message} from 'antd';
import ETable from '../../../../components/ETable';
import BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import {changeGovquick,clearGovquick} from "../../../../redux/action";
import {commonUrl} from "../../../../axios/commonSrc";

const formList = [
    {
        type: 'INPUT',
        label: '被检单位名称',
        field: 'company',
    },
    {
        type: 'INPUT',
        label: '快检机构名称',
        field: 'market',
    },
    {
        type: 'TIME',
        label: '检测时间',
        field: '1',
    },
  
]
@connect(
    state=>({
        input:state.govquick
    }),
    {
        changeGovquick,
        clearGovquick
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



    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;      
        axios.PostAjax({
            url:'/quickCheckBase/getPage',
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



    handleSubmit = ()=>{
        let type = this.state.type;
        axios.PostAjax({         
            url:type=='create'?'/quickCheckBase/insert':'/quickCheckBase/update',
            data:{              
                params:{
                    ...this.props.input
                }
               
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                })
                this.props.clearGovquick();
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
        if(type =='create'){
            this.setState({
                title:'创建',
                isVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){         
            this.setState({
                title:type=='edit'?'编辑':'查看',
                isVisible:true,
                type
            })
            this.props.changeGovquick({...item,document:JSON.parse(item.document||JSON.stringify([]))});
       }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/quickCheckBase/delete',
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
        }else if(type=="state"){
            Modal.confirm({
                content:'确定要上报吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/quickCheckBase/updateRecord',
                        data: {
                            params: {
                                id: item.id,
                                state: '已上报'
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
                title: '被检单位',
                dataIndex: 'checkCompany'
            },{
                title: '检测时间',
                dataIndex: 'date',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },{
                title: '样品名称',
                dataIndex: 'checkName'
            },
            {
                title: '检查项目',
                dataIndex: 'checkItems',
            }, {
                title: '检验结果',
                dataIndex: 'checkResult',
            }, {
                title: '所属所队',
                dataIndex: 'team',
            }, {
                title: '快检机构',
                dataIndex: 'market',
            }, {
                title: '检查人员',
                dataIndex: 'checkPerson',
            },{
                title: '负责人',
                dataIndex: 'charger',
            },{
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return(
                        <Row>
                        <Col span={6}><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>
                        <Col span={6}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>
                        <Col span={6}><div className='textButton' onClick={() =>{this.handleOperator('delete',record)}}>删除</div></Col>
                    </Row>)
                }}

        ];
        const SearchForm =<div style={{display:'table-cell',verticalAlign:'middle',paddingLeft:30}}><BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/></div>
        return (
            <div  ref="govquick">
                <div style={{height:120,display:'table',width:'100%'}}>
                    {SearchForm}
                </div>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
                        <Upload action={commonUrl+"/quickCheckBase/importExcel"}
                                showUploadList={false}
                                withCredentials={true}
                                onChange={(info)=>{
                                    if (info.file.status === 'done') {
                                        if(info.file.response.status=='success'){
                                            alert("导入成功");
                                        }else {
                                            Modal.error({
                                                title: '文件详细错误',
                                                content: info.file.response.data.errMsg,
                                            })
                                        }
                                        this.requestList();
                                    } else if (info.file.status === 'error') {
                                        if(info.file.response.status=='success'){
                                            alert("导入失败");
                                        }else {
                                            alert("导入失败");
                                        }
                                    }
                                }}>
                            <Button type="primary" >导入</Button>
                        </Upload>
                        <Button type="primary" onClick={()=>window.open(commonUrl+'/upload/downloadFile?name=quickCheckBase.xls')}>导入模板</Button>
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
                    width='800px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    maskClosable={false}
                    getContainer={()=>this.refs.govquick}
                    onCancel={()=>{
                        this.props.clearGovquick();
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