import React,{Component} from 'react';
import {Card,Table} from "antd";
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";

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
            url:'/exam/enquiry/getCaTopicResult',
            data:{
                params:{
                    examId:_this.props.caInfo.examId,
                    subjectId:_this.props.caInfo.subjectId,
                    caId:_this.props.caInfo.id
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                _this.setState({
                    topicList:res.data.list,
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
    render() {
        const columns = [
            {
                title: '题目名称',
                dataIndex: 'title',

            }, {
                title: '题型',
                type: 'type',
                render(type){
                    if (type == 1) {
                        return "判断题"
                    } else if (type == 2) {
                        return "单选题"
                    }else {
                        return "多选题"
                    }
                }
            },{
                title: '正确答案',
                dataIndex: 'answer',
                render(answer,data){
                    let answerList = answer.split(",");
                    answerList = answerList.map((item)=>{if(data.type==1) {return {1:'正确',2:'错误'}[item]}else {return {1:'A',2:'B',3:'C',4:'D'}[item]}})
                    return answerList.join(",");
                }
            }, {
                title: '选择答案',
                dataIndex: 'check',
                render(check,data){
                    let answerList = check.split(",");
                    answerList = answerList.map((item)=>{if(data.type==1) {return {1:'正确',2:'错误'}[item]}else {return {1:'A',2:'B',3:'C',4:'D'}[item]}})
                    return answerList.join(",");
                }
            }
        ];
        const caInfo = this.props.caInfo;
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
                                <td style={{background:'#F2F2F2'}}>课时分值：</td>
                                <td>{subjectInfo.totalScore||0}</td>
                                <td style={{background:'#F2F2F2'}}>考试合格线：</td>
                                <td>{subjectInfo.qualifiedScore||0}</td>
                                <td style={{background:'#F2F2F2'}}>考试情况：</td>
                                <td>{{1:'已完成',0:'未完成'}[caInfo.examResult]}</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>考试名称:</td>
                                <td colSpan={5}>{caInfo.examName}</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>企业名称：</td>
                                <td>{caInfo.companyName}</td>
                                <td style={{background:'#F2F2F2'}}>社会信用代码：</td>
                                <td>12asfsa</td>
                                <td style={{background:'#F2F2F2'}}>许可类型：</td>
                                <td>21</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>企业地址：</td>
                                <td colSpan={3}>asfsafsa</td>
                                <td style={{background:'#F2F2F2'}}>许可证号：</td>
                                <td>12asfsa</td>
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
            </div>


        );
    }

}