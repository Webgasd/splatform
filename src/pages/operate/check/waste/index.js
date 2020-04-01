import React,{Component} from 'react';
import {Card, Button, Modal, Collapse} from 'antd';
import ETable from '../../../../components/ETable';
import  BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import axios from "../../../../axios";
import DetailForm from "./DetailForm";
import connect from "react-redux/es/connect/connect";
import {changeWaste,clearWaste} from "../../../../redux/action";
import moment from 'moment';

const {Panel}=Collapse;
const formList = [
    {
        type: 'INPUT',
        label: '企业名称',
        field: 'enterprise',
    },
    {
        type: 'INPUT',
        label: '种类',
        field: 'kind',
    },
    {
        type: 'INPUT',
        label: '处置人',
        field: 'person',
    },
    {
        type: 'TIME',
        label: '处置日期',
        field: '1',
    },
    {
        type: 'TIME',
        label: '登记日期',
        field: '2',
    },
]
@connect(
    state=>({
        input:state.waste
    }),{
       
        changeWaste,
        clearWaste
    }
)
 class Waste extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300',
        initialValue:''
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
            url:'/formatwaste/getPage',
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
        let data = this.detailForm.props.form.getFieldsValue();
        data.disposalperson =  this.props.input.disposalperson;
        data.recyclingenterprises =  this.props.input.recyclingenterprises;
        data.disposaltime=moment(data.disposaltime).format("YYYY-MM-DD hh:mm:ss");
        data.registrationtime=moment(data.registrationtime).format("YYYY-MM-DD hh:mm:ss");
      // console.log(data)
        axios.ajax({
            url:type=='create'?'/formatwaste/insert':'/formatwaste/update',
            data:{
                params:{
                    ...data
                   
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isVisible:false, //关闭弹框
                    userInfo:{}
                })
                this.props.clearWaste();
                this.detailForm.props.form.resetFields();//表单重置
                this.requestList();
            }
        })
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
                content: '请选择'
            })
            return;
        }
        Modal.confirm({
            content:'确定要删除此用户吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/formatwaste/delete',
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
                userInfo:item,
                type
            })
          this.props.changeWaste({...item});

        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url:'/formatwaste/delete',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                            this.setState({
                                isVisible:false,
                              
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
                dataIndex: 'enterpriseName'
            },{
                title: '地区',
                dataIndex: 'areaName'
            },
            {
                title: '处置时间',
                dataIndex: 'disposaltime',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            }, {
                title: '种类',
                dataIndex: 'kind'
            },{
                title: '数量',
                dataIndex: 'number'
            },{
                title: '处置人',
                dataIndex: 'disposalperson'
            },
            {
                title: '登记时间',
                dataIndex: 'registrationtime',
                render:(record)=>{
                    return record===''?moment():moment(record).format("YYYY-MM-DD")
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看</div>

                }}

        ];

        return (
            <div ref="waste">
                <Collapse accordion>
                    <Panel header="查询" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Card style={{marginTop:10}}>
                    <div className='button-box'>
                        <Button type="primary" onClick={()=> {this.handleRequest()}}>刷新</Button>
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
                    width='500px'
                    maskClosable={false}
                    getContainer={()=>this.refs.waste}
                    title={this.state.title}
                    visible={this.state.isVisible}
                    footer={null}
                    onOk={this.handleSubmit}
                    okText={"确定"}
                    cancelText={"取消"}
                    onCancel={()=>{
                        this.props.clearWaste();
                        this.detailForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            userInfo:{}
                        })
                    }}
                >
                   <DetailForm type={this.state.type} userInfo={this.state.userInfo||{}} type={this.state.type} wrappedComponentRef={(inst) => this.detailForm = inst }/>
                </Modal>
            </div>
        );
    }
}
export default Waste;