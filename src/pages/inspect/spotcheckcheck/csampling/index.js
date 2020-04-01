import React,{Component} from 'react';
import {Row, Col, Icon, Modal, Card, Button, Collapse} from 'antd';
import  BaseForm  from './../../../../components/BaseForm';
import ETable from './../../../../components/ETable';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import {changeInput, clearInput} from '../../../../redux/action';

const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '被检单位',
        field: 'unit'
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
        field: 'start'
    },
    {
        type: 'DATE',
        label: '结束日期',
        field: 'end'
    },{
        type: 'INPUT',
        label: '检测机构',
        field: 'agency'
    },{
        type: 'INPUT',
        label: '所属所队',
        field: 'own'
    }
]
@connect(
    state=>({
        input:state.input
    }),{
        clearInput,
        changeInput
    }
)
class Csampling extends Component{
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
            //url:'/dishes.json'                        ',
            url:'/formatgoods/getPageIn',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    // let list  = res.result.item_list.map((item,i)=>{
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
            //url:type=='create'?'/formatgoods/insertIn':'/formatgoods/updateIn',
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
                this.props.clearInput();
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
                content: '请选择一个用户'
            })
            return;
        }
        Modal.confirm({
            content:'确定要删除此用户吗？',
            onOk:()=>{
                axios.ajax({
                    //url:'/formatgoods/deleteIn',
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
        }else if(type=="edit" || type=='detail'){
            this.setState({
                title:type=='edit'?'修改':'查看',
                userInfo:item,
                isVisible:true,
                type
            })
            this.props.changeInput({...item,document:JSON.parse(item.document||JSON.stringify([]))});
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除此用户吗？',
                onOk:()=>{
                    axios.ajax({
                        //url: '/formatgoods/deleteIn',
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
                title:"被检单位",
                dataIndex:"type"
            },{
                title:"地址",
                dataIndex:"name"
            },{
                title:"抽检环节",
                dataIndex:"supplier"
            },{
                title:"检验品种",
                dataIndex:"supplier"
            },{
                title:"检测结果",
                dataIndex:"supplier"
            },{
                title:"所属所队",
                dataIndex:"day"
            },{
                title:"执法人员",
                dataIndex:"num"
            },{
                title:"联系人",
                dataIndex:"goodsType"
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

        return(
            <div>
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
                        <Button type="primary" onClick={()=> {this.handleOperator('create',null)}}>添加</Button>
                        <Button type="primary" onClick={()=>{this.handleDelete()}}>删除</Button>
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
                    width='1100px'
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleDetailSubmit}
                    onCancel={()=>{
                        this.props.clearInput();
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
export default Csampling;