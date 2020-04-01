import React,{Component} from 'react';
import {Row, Col, Modal, Card, Button, Collapse, Upload, message} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import {changeSampling, clearSampling} from '../../../../redux/action';
import {commonUrl} from "../../../../axios/commonSrc";

const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '被检单位',
        field: 'company'
    },{
        type: 'INPUT',
        label: '检验品种',
        field: 'name'
    },{
        type: 'SELECT',
        label: '检测结果',
        field: 'result',
        placeholder: '',
        width: 200,
        list: [{id: '合格', name: '合格'}, {id: '不合格', name: '不合格'}, {id: '其他', name: '其他'}]
    },{
        type: 'INPUT',
        label: '检查人员',
        field: 'person'
    },{
        type: 'DATE',
        label: '起始日期',
        field: 'start1'
    },
    {
        type: 'DATE',
        label: '结束日期',
        field: 'end1'
    },{
        type: 'INPUT',
        label: '所属所队',
        field: 'orginization'
    }
]
@connect(
    state=>({
        input:state.sampling
    }),{
        clearSampling,
        changeSampling
    }
)
class Sampling extends Component{
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
            url:'/spotCheckBase/getPage',
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
            url:type=='create'?'/spotCheckBase/insert':'/spotCheckBase/update',
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
                this.props.clearSampling();
                this.requestList();
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
            this.props.changeSampling({...item,document:JSON.parse(item.document||JSON.stringify([]))});
        }
    }
    render(){
        const columns = [
            {
                title:"被检单位",
                dataIndex:"checkCompany"
            },{
                title:"地址",
                dataIndex:"address"
            },{
                title:"抽检环节",
                dataIndex:"checkStep"
            },{
                title:"检验品种",
                dataIndex:"sampleName"
            },{
                title:"检测结果",
                dataIndex:"checkResult"
            },{
                title:"所属所队",
                dataIndex:"team"
            },{
                title:"执法人员",
                dataIndex:"supervisor"
            },{
                title:"联系人",
                dataIndex:"contact"
            },{
                title:"操作",
                dataIndex:"operation",
                render:(text,item)=>{
                    return <Row>
                        <Col span={12}><div className="textButton" onClick={()=>{this.handleOperator('detail',item)}}>查看</div></Col>
                        <Col span={12}><div className="textButton" onClick={()=>{this.handleOperator('delete',item)}}>删除</div></Col>
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
            <div ref="sampling">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
                        <Upload action={commonUrl+"/spotCheckBase/importExcel"}
                                showUploadList={false}
                                withCredentials={true}
                                onChange={(info)=>{
                                    if (info.file.status === 'done') {
                                        message.success(`${info.file.name} file uploaded successfully`);
                                        this.requestList();
                                    } else if (info.file.status === 'error') {
                                        message.error(`${info.file.name} file upload failed.`);
                                    }
                                }}>
                            <Button type="primary" >导入</Button>
                        </Upload>
                        <Button type="primary" onClick={()=>window.open(commonUrl+'/upload/downloadFile?name=spotCheckBase.xls')}>导入模板</Button>
                        {/*<Button type="primary" onClick={()=>{this.handleDelete()}}>删除</Button>*/}
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
                       width='1100px'
                       maskClosable={false}
                       getContainer={()=>this.refs.sampling}
                       title={this.state.title}
                       visible={this.state.isVisible}
                       onOk={this.handleDetailSubmit}
                       onCancel={()=>{
                           this.props.clearSampling();
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
export default Sampling;