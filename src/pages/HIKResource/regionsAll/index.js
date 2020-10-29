import React,{Component} from 'react';
import {Card, Button, Form, Select, Modal, message, Row, Col, Icon, Collapse} from 'antd';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import {unitName} from '../../../axios/commonSrc'
import DetailForm from "./DetailForm";
import CamerasForm from "./CamerasForm";
import  BaseForm  from './../../../components/BaseForm';

const { Panel } = Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '名称',
        field: 'name'
    }
]
class EquipmentTypeOne extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300',
        initialValue:''
    }
    params = {
        pageNo:1,
        pageSize:10,
        region:unitName
    }



    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/HIKResource/getPage',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"&&res.data.code != "0x02401001"){
                // let list  = res.result.item_list.map((item,i)=>{
                let list1  = res.data.data.list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list1,
                })
            }
            if(res.data.code == "0x02401001"){
                alert("请验证host、appkey及appsecret！")
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

    handleOperator = (type,item)=>{
        if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'编辑':'查看',
                isVisible:true,
                userInfo:item,
                type
            })
        }
        else if (type=="check"){

            // axios.ajax({
            //     url:'/HIKResource/getPageCamerasByRegions',
            //     data:{
            //         params:{
            //             regionIndexCode:item.indexCode
            //         }
            //     }
            // }).then((res)=>{
            //     if(res.data.code=="0"){
            //         // let list  = res.result.item_list.map((item,i)=>{
            //         let list1  = res.data.data.list

                    this.setState({
                        title:"查看当前区域下的所有监控设备",
                        cameraFormVisible:true,
                        userInfo:item,
                        type
                       
                    })
         }
    }


    render() {
        const columns = [
            {
                title: '索引代码',
                dataIndex: 'indexCode',
                width:400,
            },
            {
                title: '名称',
                dataIndex: 'name',
                width:300,
            },
            {
                title: '上级索引代码',
                dataIndex: 'parentIndexCode',
                width:400,
            },
            {
                title: '树节点代码',
                dataIndex: 'treeCode',
                width:100,
            },
            {
                title: '操作',
                dataIndex:'operation',
                width:200,
                render:(text, record)=>{
                    return  <Row>
                        <Col span={7}><div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div></Col>
                        <Col span={30}><div className='textButton' onClick={() => { this.handleOperator('check',record)}}>查看所有设备</div></Col>
                    </Row>
                }}

        ];
        let footer = {};
        if(this.state.type == 'detail'||'check'){
            footer = {
                footer: null
            }
        }

        return (
            <div ref="camerasForm">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.requestList()}}>刷新</Button>

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
                <Modal {...footer}
                    width='600px'
                    maskClosable={false}
                    maskClosable={false}
                    getContainer={()=>this.refs.camerasForm}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    cancelText={"取消"}
                    onCancel={()=>{
                        this.detailForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            userInfo:{}
                        })
                    }}
                >
                    <DetailForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.detailForm = inst }/>
                </Modal>

                <Modal 
                       width='1000px'
                       destroyOnClose={true}
                       maskClosable={false}
                       getContainer={()=>this.refs.camerasForm}
                       footer={null}
                       title={this.state.title}
                       visible={this.state.cameraFormVisible}
                       onCancel={()=>{
                           this.setState({
                            cameraFormVisible:false,
                               userInfo:''
                           })
                       }}
                >
                    <CamerasForm userInfo={this.state.userInfo||{}}
                     />
                </Modal>

            </div>
        );
    }
}
export default EquipmentTypeOne;