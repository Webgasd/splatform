import React,{Component} from 'react';
import {Card, Button, Modal, Collapse,Upload, message, Row, Col} from 'antd';
import ETable from '../../../../components/ETable';
import BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import moment from 'moment';
import {changeMaterial,clearMaterial} from "../../../../redux/action";
import connect from "react-redux/es/connect/connect";
import {commonUrl} from "../../../../axios/commonSrc";


const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '原料类型',
        field: 'type',
    },
    {
        type: 'INPUT',
        label: '原料名称',
        field: 'name',
    },
    {
        type: 'TIME',
        label: '备案时间',
        field: '1',
    },
]
@connect(
    state=>({
        input:state.material
    }),
    {
        changeMaterial,
        clearMaterial
    }
)
 class Material extends Component{
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
            url:'/formatOriginRecordEx/getPage',
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
            url:type=='create'?'/formatOriginRecordEx/insert':'/formatOriginRecordEx/update',
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
                this.props.clearMaterial();
                this.requestList();
            }
        })
      //  console.log(this.props.input)
    }

    start = () => {
        // ajax request after empty completing
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
                content: '请选择一条'
            })
            return;
        }
        Modal.confirm({
            content:'确定要删除吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/formatOriginRecordEx/delete',
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
       
        this.setState({
            title:type=='edit'?'编辑':'查看',
            isVisible:true,
            type
        })
        this.props.changeMaterial({...item,document:JSON.parse(item.document||JSON.stringify([]))});
     
    }else if(type=="delete"){

        Modal.confirm({
            content:'确定要删除吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/formatOriginRecordEx/delete',
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
    }
}


    render() {
        const columns = [
           {
                title: '企业名称',
                dataIndex: 'enterpriseName',
            },
            {
                title: '原料类别',
                dataIndex: 'originType',
            },
            {
                title: '原料名称',
                dataIndex: 'originName',
            }, {
                title: '净含量/规格',
                dataIndex: 'netContent',
            },
            {
                title: '供应商',
                dataIndex: 'supplier',
            },
            {
                title: '生产日期',
                dataIndex: 'produceTime',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },
            {
                title: '有效期限',
                dataIndex: 'deadTime',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },
            {
                title: '进货日期',
                dataIndex: 'recordTime',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },
            {
                title: '进货数',
                dataIndex: 'goodsIn',
            },
            {
                title: '验收人',
                dataIndex: 'person',
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return  <Row>
                            <Col span={7}><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>
                            <Col span={7}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>
                            <Col span={7}><div className='textButton' onClick={() =>{this.handleOperator('delete',record)}}>删除</div></Col>
                        </Row>
                }}

        ];

        return (
            <div  ref="material">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
                        <Upload action={commonUrl+"/formatOriginRecordEx/importExcel"}
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
                        <Button type="primary" onClick={()=>window.open(commonUrl+'/upload/downloadFileEx?name=原料索证企业模版.xlsx')}>导入模板</Button>
                        {/* <Button type="primary" onClick={this.handleDelete}>删除</Button> */}
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
                    width='900px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    okText={"确定"}
                    cancelText={"取消"}
                    maskClosable={false}
                    getContainer={()=>this.refs.material}
                    onCancel={()=>{
                        this.props.clearMaterial();
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                   <DetailForm  type={this.state.type} />
                </Modal>
            </div>
        );
    }
}
export default Material;