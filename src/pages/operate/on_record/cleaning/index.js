import React,{Component} from 'react';
import {Row, Col, Modal, Card, Button, Collapse,message,Upload} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import {connect} from "react-redux";
import {changeCleaning, clearCleaning} from "../../../../redux/action";
import moment from "moment";
import {commonUrl} from "../../../../axios/commonSrc";
const {Panel}=Collapse;
const formList = [
    {
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
        field: 'amount',
        width:'50px'
    }, {
        type: 'INPUT',
        label: '消毒人员',
        field: 'person'
    }
]
@connect(
    state=>({
        input:state.cleaning
    }),{
        clearCleaning,
        changeCleaning
    }
)
class Cleaning extends Component{
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
            //url:'/cleaning.json'                        ',
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
        //console.log(filterParams)
        this.requestList();
    }
    handleDetailSubmit = ()=>{
        let type = this.state.type;
        let data = this.detailForm.props.form.getFieldsValue();//获取表单的值
        data.date=Utils.formatDateNoTime(data.date);
        data.way=this.props.input.way;
        axios.ajax({
            url:type=='create'?'/formatdisinfection/insert':'/formatdisinfection/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.detailForm.props.form.resetFields();//表单重置
                this.setState({
                    isVisible:false ,
                    addInfo:{}
                })
                //this.detailForm.props.form.resetFields();//表单重置
                this.requestList();
            }
        })
    }
    handleRequest = () => {
        this.params = {pageNo:1}
        this.requestList();
    }
    handleDelete = ()=>{
        let item = this.state.selectedItem;
        let _this = this;
        if(!item){
            Modal.info({
                title: '信息',
                content: '请选择信息'
            })
            return;
        }
        Modal.confirm({
            content:'确定删除？',
            onOk:()=>{
                axios.ajax({
                    url:'/formatdisinfection/delete',
                    data:{
                        params:{
                            id:item.id
                        }
                    }
                }).then((res)=>{
                    if(res.status == 'success'){
                        _this.setState({
                            isVisible:false
                        })
                        _this.requestList();
                    }
                })
            }
        })
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
                title:type=='edit'?'编辑':'查看详情',
                isVisible:true,
                addInfo:item,
                type
            })
            this.props.changeCleaning(item);
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/formatdisinfection/delete',
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
    render(){
        const columns = [
            {
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
                    return <Row>
                        <Col span={7}><div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div></Col>
                        <Col span={7}><div className="textButton" onClick={()=>{this.handleOperator('edit',item)}}>修改</div></Col>
                        <Col span={7}><div className="textButton" onClick={()=>{this.handleOperator('delete',item)}}>删除</div></Col>
                    </Row>
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
            <div ref="cleaning">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
                        {/*<Button type="primary" onClick={()=>{this.handleDelete()}}>删除</Button>*/}
                        {/*<Button type="primary" >导出</Button>*/}
                        <Upload action={commonUrl+"/formatdisinfection/importExcelEx"}
                                showUploadList={false}
                                withCredentials={true}
                                onChange={(info)=>{
                                    console.log(info)
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
                            <Button type="primary" onClick={()=>window.open(commonUrl+'/upload/downloadFileEx?name=清洗消毒模板.xlsx')}>导入模板</Button>
                        </Upload>
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
                <Modal  {...footer}
                    //0destroyOnClose='true'
                    width='500px'
                    maskClosable={false}
                    getContainer={()=>this.refs.cleaning}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleDetailSubmit}
                        okText={"确定"}
                        cancelText={"取消"}
                    maskClosable={false}
                    getContainer={()=>this.refs.cleaning}

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
export default Cleaning;