import React,{Component} from 'react';
import { unitName } from "../../../axios/commonSrc";
import {Card, Button, Modal,Upload,message} from 'antd';
import AddForm from './AddForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";


export default class Legal extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
    }
    params = {
        pageNo:1,
    }
    componentDidMount(){
        this.requestList();
        this.requestLegalConf();
    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/legal/getPage',
            //url:'/government.json',
            data:{
                params:this.params
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
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }

    requestLegalConf=()=>{
        axios.noLoadingAjax({
            url:'/inspect/lllegality/getList',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    legalList: res.data
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
        let type =this.state.type;
        console.log(this.state.legalInfo)
        axios.ajax({
            url:type=='create'?'/inspect/legal/insert':'/inspect/legal/update',
            data:{
                params:{
                   ...this.state.legalInfo,
                    operateTime:null
                }
            }
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    isVisible:false,
                    legalInfo:{}
                })
                this.requestList();
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
                title:type=='edit'?'修改':'查看',
                isVisible:true,
                legalInfo:item,
                type
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/inspect/legal/delete',
                        data: {
                            params: {
                                id: item.id
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
        let _this = this;
        const columns = [
            {
                title: '违法类型',
                dataIndex: 'typeId',
                render(typeId){
                    let data=(_this.state.legalList||[]).find((item)=>item.id==typeId)||{};
                    return data.name;
                }
            },{
                title: '违法行为',
                dataIndex: 'activities'
            }, {
                title: '操作',
                dataIndex:'operation',
                render:(text, item)=>{
                    return <div className='textButtonBox'>
                        <div className='textButton' onClick={() => { this.handleOperator('detail',item)}}>查看</div>
                        <div className='textButton' onClick={()=> {this.handleOperator('edit',item)}}>修改</div>
                        <div className='textButton' onClick={()=> {this.handleOperator('delete',item)}}>删除</div>
                    </div>
                }}

        ];
        return (
            <div>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=>this.handleOperator('create',null)}>添加</Button>
                            <Upload action={commonUrl+"/inspect/legal/importExcel"}
                                    showUploadList={false}
                                    onChange={(info)=>{
                                        if (info.file.status === 'done') {
                                            if(info.file.response.status=='success'){
                                                message.success(`${info.file.name} file uploaded successfully`  );
                                            }else {
                                                message.error(`${info.file.name} file upload failed.`);
                                            }
                                            this.requestList();
                                        } else if (info.file.status === 'error') {
                                            message.error(`${info.file.name} file upload failed.`);
                                        }
                                    }}>
                                <Button type="primary" >导入</Button>
                            </Upload>
                        <Button type="primary" onClick={()=>window.open(commonUrl+'/upload/downloadFile?name=违法导入模板.xls')}>导入模板</Button>
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
                <Modal
                    width='800px'
                    title="违法类型"
                    onOk={this.handleSubmit}
                    destroyOnClose
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    footer={this.state.type=='detail'?null:React.ReactNode}
                    visible={this.state.isVisible}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            legalInfo:{}
                        })
                    }}
                >
                    <AddForm legalInfo={this.state.legalInfo||{}} dispatchLegalData={(data)=>this.setState({legalInfo:data})} legalList={this.state.legalList||[]} type={this.state.type}/>
                </Modal>
            </div>
        );
    }
}


