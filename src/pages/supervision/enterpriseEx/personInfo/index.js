import React,{Component} from 'react';
import {Select,Input,Table,Modal} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {changeEmployee, clearEmployee} from "../../../../redux/action";
import AddForm from './Add'

const Option = Select.Option;
const { TextArea } = Input;
@connect(
    state=>({
        input:state.enterprise,
        employee:state.employee,
    }),
    {
        changeEnterprise,
        clearEmployee,
        changeEmployee
    }
)
class PersonInfo extends Component{

    state={list:[],workTypeList:[],}

    params = {
        pageNo:1
    }

    componentDidMount(){
        this.requestList();
        this.requestWorkType()
    }
    requestList = ()=>{
       
        let _this = this;
        axios.ajax({
            url:'/supervision/ca/getCaPageByEnterprise',

            data:{
                params:{...this.params,id:this.props.searchEmployee}
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
                    total:res.data.total,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
              })
                })
            }
        })
    }
    requestWorkType = ()=>{
        axios.noLoadingAjax({
            url:'/sys/workType/getList',
            data:{
                params:{}
            }
        }).then((res)=>{

            if(res.status == "success"){
                this.setState({
                    workTypeList:res.data,
                })
            }
        })
    }
    handleOperator = (item)=>{      
        this.setState({
            title:'查看详情',
            isVisible:true,
        })
        this.props.changeEmployee({...item,photo:JSON.parse(item.photo||JSON.stringify([])),caPhoto:JSON.parse(item.caPhoto||JSON.stringify([]))});
  }
  
    render() {
        const columns1 = [
            {
                title: '姓名',
                dataIndex: 'name'
            }, {
                title: '性别',
                dataIndex: 'sexy',
                render(sexy){
                    if(sexy==0){
                        return "男"
                    }else {
                        return "女"
                    }
                }
            },{
                title: '职务',
                dataIndex: 'workType'
            },{
                title: '健康证号',
                dataIndex: 'healthNumber'
            }, 
            {
                title: '健康证有效期限',
                dataIndex: 'time',
                render(text, record,index){
                    let startTime = Utils.formatDateNoTime(record.startTime);
                    let endTime = Utils.formatDateNoTime(record.endTime);
                    return startTime+'-'+endTime;
                }  
            }, 
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <div className='textButton' onClick={() => { this.handleOperator(record)}}>查看详情</div>
                }
            }
        ]
        // const columns2 = [
        //     {
        //         title: '姓名',
        //         dataIndex: 'name'
        //     }, {
        //         title: '作业种类',
        //         dataIndex: 'workType'
        //     },{
        //         title: '证书编号',
        //         dataIndex: ''
        //     }, 
        //     {
        //         title: '有效期限',
        //         dataIndex: ''
        //     }, 
        //     {
        //         title: '操作',
        //         dataIndex:'operation',
        //         render:(text, record)=>{
        //             return <div className='textButton' onClick={() => { this.handleOperator('detail',record)}}>查看详情</div>
        //         }
        //     }
        // ]
        
    return (
        <div>
            <div className='commonEnterpriseBox' style={{marginTop:20}}>
                <div className='permission-title-text'>企业人员信息</div>
                <Table 
                    dataSource={this.state.list}
                    columns={columns1} 
                    pagination={this.state.pagination} 
                />
            </div>
            {/* <div className='commonEnterpriseBox' style={{marginTop:20}}>
                <div className='permission-title-text'>维保人员信息</div>
                <Table columns={columns2}  />
            </div> */}
            <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    footer={null}
                    destroyOnClose
                    width={1000}
                    onCancel={()=>{
                        this.props.clearEmployee();
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <AddForm workTypeList={this.state.workTypeList||[]}/>
                </Modal>
    </div>
        
    )
    }
}
export default PersonInfo;

