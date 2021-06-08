import React,{Component} from 'react';
import {Card,Table,Button,Modal} from "antd";
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";
import Utils from "../../../utils";
import TopicReview from './TopicReview'

export default class MyExam extends Component {
    state = {
        topicList:[],
        subjectInfo:{}
    }
    componentDidMount() {
        this.requestList();
        this.requestInfo();
    }
    requestList=()=>{
        let _this = this;
        axios.ajax({
            url:'/exam/enquiry/getCaExamResult',
            data:{
                params:{
                    // examId:_this.props.caInfo.examId,
                    // subjectId:_this.props.caInfo.subjectId,
                    caId:_this.props.caInfo.id
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                _this.setState({
                    topicList:res.data,
                    subjectInfo:res.data.subject
                })
            }
        })
    }
    requestInfo=()=>{
        axios.noLoadingAjax({
            url:'/exam/subject/getIndustryAndWorkType'
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    industryList:res.data.allIndustry,
                    workTypeList:res.data.allWorkType
                })
            }
        })
    }
    handleOperator = (item)=>{
        this.setState({
            isVisible:true,
            examCaId:item.id
        })
    }
    render() {
        const caInfo = this.props.caInfo;
        const columns = [
            {
                title: '考试名称',
                dataIndex: 'examName',
                render(){
                    return caInfo.examName
                }
            },
            {
                title: '考试开始时间',
                dataIndex: 'examDate',
                render(){
                    return caInfo.examDate  
                }
            },
            {
                title: '是否通过',
                dataIndex: 'examResult',
                render(examResult){
                    return {0:'否',1:'是'}[examResult]
                }
            },
            {
                title: '总分数',
                render(){
                    return caInfo.totalScore
                }
            },
            {
                title: '考试得分',
                dataIndex: 'examScore',
            },
            {
                title: '详情',
                dataIndex: 'operation',
                render:(text, record)=>{
                    return <Button type='primary' onClick={() => { this.handleOperator(record)}}>查看</Button>
                    
                }
            },
        ];
        
        const photo = this.props.caInfo.photo||JSON.stringify([]);
        const subjectInfo = this.state.subjectInfo||{};
        const photoUrl = JSON.parse(photo)[0]||{response:{}};
        return (
            <div>
                <Card title='人员信息' style={{marginLeft:15,marginRight:15}}>
                    <div className='commonEnterpriseBox'>
                        <table>
                            <tbody>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'10%'}}>姓名：</td>
                                <td style={{width:'15%'}}>{caInfo.name}</td>
                                <td style={{background:'#F2F2F2',width:'10%'}}>身份证号：</td>
                                <td style={{width:'15%'}}>{caInfo.idNumber}</td>
                                <td style={{background:'#F2F2F2',width:'10%'}}>性别：</td>
                                <td style={{width:'15%'}}>{{1:'女',0:'男'}[caInfo.sexy]}</td>
                                <td rowSpan={6}>
                                    <img src={commonUrl+'/upload/picture/'+photoUrl.response.data} style={{height:'230px'}} alt="avatar" />
                                </td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>联系电话：</td>
                                <td>{caInfo.telephone}</td>
                                <td style={{background:'#F2F2F2'}}>行业类型：</td>
                                <td>{((this.state.industryList||[]).find((item)=>item.id==caInfo.industry)||{}).name}</td>
                                <td style={{background:'#F2F2F2'}}>工作种类：</td>
                                <td>{((this.state.workTypeList||[]).find((item)=>item.id==caInfo.workType)||{}).name}</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>考试总分：</td>
                                <td>{subjectInfo.totalScore||0}</td>
                                <td style={{background:'#F2F2F2'}}>考试合格线：</td>
                                <td>{subjectInfo.qualifiedScore||0}</td>
                                <td style={{background:'#F2F2F2'}}>考试情况：</td>
                                <td>{{1:'已完成',0:'未完成',null:'未考试'}[caInfo.examResult]}</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>考试名称:</td>
                                <td colSpan={5}>{caInfo.examName}</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>企业名称：</td>
                                <td>{caInfo.companyName}</td>
                                <td style={{background:'#F2F2F2'}}>社会信用代码：</td>
                                <td colSpan={3}>{caInfo.creditNumber}</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>企业地址：</td>
                                <td colSpan={5}>{caInfo.businessAddress}</td>
                                
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
                <Card title='考试回顾' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                    <Table
                        columns={columns}
                        dataSource={this.state.topicList}>
                    </Table>
                </Card>
                <Modal
                    width='1000px'
                    title="考题回顾"
                    destroyOnClose
                    maskClosable={false}
                    footer={null}
                    visible={this.state.isVisible}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                   <TopicReview subjectId={caInfo.subjectId||{}} caId={caInfo.id||{}} examCaId={this.state.examCaId||{}}/>
                </Modal>
            </div>


        );
    }

}