import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table,Modal} from "antd";
import BaseForm from "../../../../components/BaseForm";
import {connect} from "react-redux";
import {changeEnterprise, clearEnterprise} from '../../../../redux/action';
import Add from '../Add';
import Abnormal from './Abnormal'
const Panel = Collapse.Panel;

const formList = [
    {
        type: 'INPUT',
        label: '企业名',
        field: 'enterpriseName',
    },
    {
        type: 'INPUT',
        label: '统一信用代码',
        field: 'idNumber',
    },
]
@connect(
    state=>({
        industryList:state.industryList,
        areaList:state.areaList,
    }),{
        clearEnterprise,
        changeEnterprise,
    }
)
 class SubjectForm extends Component{
    state={}
    params = {
        pageNo:1,
        industryList:'',
        areaList:''
    }
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/supervision/enterprise/getPage',
            data:{
                params:{...this.params,areaList:[this.params.areaList],industryList:[this.params.industryList]}
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



    handleAbnormal=(item)=>{
        axios.ajax({
            url:'/supervision/enterprise/getById',
            data:{
                params:{
                   id:item.id
                }
            }
        }).then((res)=>{
            if(res.status =='success'){
                this.setState({
                    isAbnormalVisible:true,
                    enterpriseData:res.data
                })
            }
        })
}
handleSubmitAbnormal=()=>{

    if(!this.state.abnormalData.abnormalType)
    {
      Modal.error({title:"异常情形为必选"})
        return
    }
    axios.ajax({
        url:'abnormal/insertContent',
        data:{
            params:{
               enterpriseId:this.state.enterpriseData.id,
               abnormal:this.state.abnormalData.abnormalType,
               abnormalContent:this.state.abnormalData.abnormalContent
            }
        }
    }).then((res)=>{
        if(res.status =='success'){
            this.setState({
                isAbnormalVisible:false,
                enterpriseData:'',
                abnormalData:''
            })
            this.requestList();
        }
    })
}
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.params.industryList='';
        this.params.areaList='';
        this.requestList();
    };
    baseInfo=(item)=>{
        axios.ajax({
            url:'/supervision/enterprise/getById',
            data:{
                params:{
                   id:item.id
                }
            }
        }).then((res)=>{
            if(res.status =='success'){
                this.setState({
                    baseInfoVisible:true,
                    searchEmployee:item.id
                })
                let data = res.data;
                this.props.changeEnterprise({...data,
                    propagandaEnclosure:JSON.parse(data.propagandaEnclosure||JSON.stringify([])),
                    businessLicensePhoto:JSON.parse(data.businessLicensePhoto||JSON.stringify([])),
                    foodBusinessPhotos:JSON.parse(data.foodBusinessPhotos||JSON.stringify([])),
                    smallCaterPhotos:JSON.parse(data.smallCaterPhotos||JSON.stringify([])),
                    smallWorkshopPhotos:JSON.parse(data.smallWorkshopPhotos||JSON.stringify([])),
                    foodProducePhotos:JSON.parse(data.foodProducePhotos||JSON.stringify([])),
                    drugsBusinessPhotos:JSON.parse(data.drugsBusinessPhotos||JSON.stringify([])),
                    drugsProducePhotos:JSON.parse(data.drugsProducePhotos||JSON.stringify([])),
                    cosmeticsUsePhotos:JSON.parse(data.cosmeticsUsePhotos||JSON.stringify([])),
                    medicalProducePhotos:JSON.parse(data.medicalProducePhotos||JSON.stringify([])),
                    medicalBusinessPhotos:JSON.parse(data.medicalBusinessPhotos||JSON.stringify([])),
                    industrialProductsPhotos:JSON.parse(data.industrialProductsPhotos||JSON.stringify([])),
                    publicityPhotos:JSON.parse(data.publicityPhotos||JSON.stringify([])),
                    certificatePhotos:JSON.parse(data.certificatePhotos||JSON.stringify([])),
                    otherPhotos:JSON.parse(data.otherPhotos||JSON.stringify([]))
                });
            }
        })
    }

    render(){
        let _this =this;
        const columns = [
            {
                title: '市场主体名称',
                dataIndex: 'enterpriseName',
                render(text,record){return <div style={{float:"left"}}>{"  ".replace(/ /g, "\u00a0")}{text}</div>}
            }, {
                title: '统一信用代码',
                dataIndex: 'idNumber',
                render(text,record){return <div style={{float:"left"}}>{"  ".replace(/ /g, "\u00a0")}{text}</div>}
            },{
                title: '法定代表人',
                dataIndex: 'legalPerson'
            },
            {
                title: '联系电话',
                dataIndex: 'cantactWay'
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <div className='textButtonBox'>
                                <div className='textButton' onClick={() => { this.handleAbnormal(record)}}>选择</div>
                                <div className='textButton'  onClick={() => { this.baseInfo(record) }}>企业详情</div>
                             </div>
                }
            }
        ];
        return (
            <div>

                <Card>
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>
                </Card>
                <Card style={{marginTop:10}}>
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={columns}
                    />
                </Card>
                <Modal
                    title="企业信息"
                    visible={this.state.baseInfoVisible}
                    destroyOnClose
                    centered={true}
                    width={1000}
                    onCancel={()=>{
                        this.props.clearEnterprise();
                        this.setState({baseInfoVisible:false,})
                    }}        
                     footer={false}
                >
                    <Add type={"detail"} searchEmployee={this.state.searchEmployee}/>
                </Modal>
                <Modal
                title={"企业异常报送"}
                visible={this.state.isAbnormalVisible}
                destroyOnClose
                onOk={this.handleSubmitAbnormal}
                okText="确定"
                cancelText="取消"
                maskClosable={false}
                width={500}
                onCancel={()=>{
                    this.setState({
                        isAbnormalVisible:false,
                        enterpriseData:'',
                        abnormalData:''
                    })
                }}
            >
                <Abnormal enterpriseData={this.state.enterpriseData||{}}
                         abnormalData = {this.state.abnormalData||{}}
                        dispatchAbnormalData={(data)=>{this.setState({abnormalData:data})}}
                />
            </Modal>
            </div>
        );
    }
}
export default SubjectForm