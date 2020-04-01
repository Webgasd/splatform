import React,{Component} from 'react';
import {Card, Row, Col, Button, Modal, Table} from 'antd';
import Utils from "../../../utils";
import axios from "../../../axios";
import AreaForm from "./AreaForm";
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

export default class AreaManager extends Component{
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
        this.requestData();
    }
    requestList = ()=>{
        axios.ajax({
            url:'/sys/area/tree',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let list  = res.data;
                this.setState({
                    list:list
                })
            }
        })
    }
    requestData = ()=>{
        axios.ajax({
            url:'/sys/area/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let areaList  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    areaList:areaList,
                    pagination:Utils.pagination(res,(current)=>{
                        this.params.pageNo = current;//	当前页数
                        this.requestData(); //刷新列表数据
                    })
                })
            }
        })
    }
    setRowClassName = (record) => {
        return record.id === this.state.rowId ? 'clickRowStyl' : '';
    }
    handleOperatorArea = (type,item)=>{
        if(type=='create'){
            this.setState({
                isAreaVisible:true,
                areaType:'add'
            })
        }else if(type=="edit"){
            this.setState({
                isAreaVisible:true,
                areaInfo:item,
                areaType:type
            })
            return;

        }else if(type=="delete"){
            confirm({
                title: '确定删除?',
                okText: '是',
                okType: 'danger',
                cancelText: '否',
                onOk:()=>{
                    axios.ajax({
                        url:'/sys/area/delete',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status =='success'){
                            this.requestList();
                        }
                    })
                }
            })
        }
    }
    handleAreaSubmit = ()=>{
        let data = this.areaForm.props.form.getFieldsValue();
        let type = this.state.areaType;
        axios.ajax({
            url:type=='add'?'/sys/area/insert':'/sys/area/update',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.areaForm.props.form.resetFields();
                this.setState({
                    isAreaVisible:false,
                    areaInfo:''
                })
                this.requestList();
                this.requestData();
            }
        })
    }

    render() {
        const DeptColumns = [
            {
                dataIndex: 'name',
                width:'60%',
                align:'left'
            },
            {
                dataIndex:'operation',
                width:'40%',
                render:(text, item)=>{
                    return <ButtonGroup>
                        <Button type="primary" ghost size="small"  icon="edit" onClick={() => { this.handleOperatorArea('edit',item)}}/>
                        <Button type="danger" size="small"  icon="delete" onClick={() => { this.handleOperatorArea('delete',item)}}/>
                    </ButtonGroup>
                }}

        ];
        const UserColumns = [
            {
                title: '上级地区',
                dataIndex: 'parentId'
            }, {
                title: '地区名称',
                dataIndex: 'name'
            },{
                title: '编号',
                dataIndex: 'regionNumber'
            }, {
                title: '行政编号',
                width:'10%',
                dataIndex: 'executiveNumber'
            }, {
                title: '状态',
                dataIndex: 'status',
                render(status){
                    if(status==0){
                        return '开启';
                    }else {
                        return '关闭';
                    }
                }
            }
        ];
        return(
            <Card>
                <Row>
                    <Col span={6}>
                        <Card title='地区列表' extra={<Button type="primary" icon={'plus'} onClick={() => { this.handleOperatorArea('create',null)}}>添加</Button>}>
                            <Table
                                style={{marginTop:'-20px'}}
                                columns={DeptColumns}
                                childrenColumnName='childrenList'
                                dataSource={Utils.getDataSource(this.state.list||[])}
                                pagination={false}
                                indentSize={30}
                                size="middle"
                                rowKey={'id'}
                                rowClassName={this.setRowClassName}
                                onRow={(record) => {
                                    return {
                                        onClick: () => {
                                            if(!record.hasOwnProperty('childrenList')){
                                                this.setState({
                                                    rowId: record.id
                                                })
                                            }
                                        }
                                    };
                                }}
                            />
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card title='地区列表' style={{marginLeft:'30px'}}>
                            <div style={{marginTop:25}}>
                                <Table
                                    columns={UserColumns}
                                    bordered
                                    rowKey={'id'}
                                    dataSource={this.state.areaList||[]}
                                    pagination={this.state.pagination}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="地区管理"
                    visible={this.state.isAreaVisible}
                    onOk={this.handleAreaSubmit}
                    onCancel={()=>{
                        this.areaForm.props.form.resetFields();
                        this.setState({
                            isAreaVisible:false,
                            areaInfo:''
                        })
                    }}
                >
                    <AreaForm areaInfo={this.state.areaInfo} areaList={Utils.getDataSource(this.state.list||[])} wrappedComponentRef={(inst) => this.areaForm = inst }/>
                </Modal>
            </Card>
        );
    }
}