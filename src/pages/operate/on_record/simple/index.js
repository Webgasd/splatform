import React,{Component} from 'react';
import {Row, Col,Modal, Card, Button, Collapse,message,Upload} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import moment from "moment";
import connect from "react-redux/es/connect/connect";
import {changeSimple, clearSimple} from '../../../../redux/action';
import {commonUrl} from "../../../../axios/commonSrc";
const formList = [
    {
        type: 'SELECT',
        label: '餐次',
        field: 'meal',
        initialValue: '',
        width: 200,
        list: [{id: '早餐', name: '早餐'}, {id: '午餐', name: '午餐'}, {id: '晚餐', name: '晚餐'}]
    },{
        type: 'DATE',
        label: '起始日期',
        field: 'start'
    },
    {
        type: 'DATE',
        label: '结束日期',
        field: 'end'
    }
]
const {Panel}=Collapse;
@connect(
    state=>({
        input:state.simple
    }),{
        clearSimple,
        changeSimple
    }
)
class Simple extends Component{
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
            url:'/formatleave/getPage',
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
    handleDetailSubmit = ()=>{
        let type =this.state.type;
        axios.PostAjax({
            url:type=='create'?'/formatleave/miniInsert':'/formatleave/miniUpdate',
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
                this.props.clearSimple();
                this.requestList();
            }
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
            content:'确定要删除此条吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/formatleave/delete',
                    data:{
                        params:{
                            id: item.id
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
    handleOperator = (type,item)=>{
        if(type =='create'){
            this.setState({
                title:'添加',
                isVisible:true,
                type
            })
            let data = {
                id: 0,
                unit: "",
                area: "",
                type: "",
                date: {},
                meal: "",
                matter: "",
                number: "",
                document: "",
                operator: "",
                operatorIp: "",
                operatorTime: "",
                list:[]
            }
            this.props.changeSimple({...data,document:JSON.parse(data.document||JSON.stringify([]))});
        }else if(type=="edit" || type=='detail'){
            axios.ajax({
                url:'/formatleave/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    this.setState({
                        title:type=='edit'?'编辑':'查看详情',
                        isVisible:true,
                        type
                    })
                    let data = res.data;
                    this.props.changeSimple({...data,document:JSON.parse(data.document||JSON.stringify([]))});
                }
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/formatleave/delete',
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
                title:"就餐日期",
                dataIndex:"date",
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },{
                title:"就餐类型",
                dataIndex:"type"
            },{
                title:"餐次",
                dataIndex:"meal"
            },{
                title:"就餐人数",
                dataIndex:"number"
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
            <div ref="simple">
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
                        <Upload action={commonUrl+"/formatleave/importExcel"}
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
                            <Button type="primary" onClick={()=>window.open(commonUrl+'/upload/downloadFileEx?name=食品留样模板.xlsx')}>导入模板</Button>
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
                    width='800px'
                    maskClosable={false}
                    getContainer={()=>this.refs.simple}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleDetailSubmit}
                        okText={"确定"}
                        cancelText={"取消"}
                    onCancel={()=>{
                        this.props.clearSimple();
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
export default Simple;