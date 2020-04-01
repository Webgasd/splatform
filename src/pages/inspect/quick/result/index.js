import React,{Component} from 'react';
import {Card, Button, Modal, Row, Col} from 'antd';
import ETable from '../../../../components/ETable';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";


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
       
        axios.ajax({
            url:'/quickSpotCheckResultType/getPage',
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


    handleSubmit = ()=>{
        let type = this.state.type;
        let data = this.detailForm.props.form.getFieldsValue();
        axios.ajax({      
            url:type=='create'?'/quickSpotCheckResultType/insert':'/quickSpotCheckResultType/update',
            data:{               
                params:{
                    ...data
                }          
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false,
                    userInfo:{}
                })
                this.detailForm.props.form.resetFields();
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
                userInfo:item,
                type
            })
           }
       else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/quickSpotCheckResultType/delete',
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
                title: '检查结果',
                dataIndex: 'type'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
    
                    return  <Row>
                        <Col span={12}><div className='textButton' onClick={()=> {this.handleOperator('edit',record)}}>修改</div></Col>
                        <Col span={12}><div className='textButton' onClick={() =>{this.handleOperator('delete',record)}}>删除</div></Col>
                    </Row>
                }}

        ];
   
        return (
            <div ref="result">                
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
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
                    width='400px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    maskClosable={false}
                    getContainer={()=>this.refs.result}
                    onCancel={()=>{
                        this.detailForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            userInfo:{}
                        })
                    }}
                >
                   <DetailForm userInfo={this.state.userInfo} type={this.state.type} wrappedComponentRef={(inst) => this.detailForm = inst } />
                </Modal>
            </div>
        );
    }
}
export default  Additive;