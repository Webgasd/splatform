import React,{Component} from 'react';
import {Card,Table,Button,Modal} from "antd";
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";
import MaterialProgress from './MaterialProgress.js'

export default class MyExam extends Component {
    state = {
        materialList:[],
    }
    componentDidMount() {
        this.requestList();
        this.requestInfo();
    }
    requestList=()=>{
        let _this = this;
        axios.ajax({
            url:'/exam/enquiry/getCaTrainCourseResult',
            data:{
                params:{
                    // courseId:_this.props.caInfo.trainId,
                    caId:_this.props.caInfo.id
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                _this.setState({
                    courseList:res.data.list
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
    handleOperator = (type,item)=>{
        this.setState({
            isVisible:true,
            courseId:item.id
        })
    }
    render() {
        const columns = [
            {
                title: '课程名称',
                dataIndex: 'name',

            }, 
            // {
            //     title: '教材种类',
            //     dataIndex: 'contentType',
            //     render(contentType){
            //         return {1:'视频类教材',2:'文本类教材'}[contentType]
            //     }
            // }, 
            {
                title: '总课时',
                dataIndex: 'courseScore',
        },{
                title: '已学课时',
                dataIndex: 'caScore',
            },
            {
                title:'详情',
                dataIndex: 'operation',
                render:(text, record)=>{
                    return <Button type='primary' onClick={() => { this.handleOperator('detail',record)}}>查看</Button>
                    
                }
            }
        ];
        const caInfo = this.props.caInfo;
        const photo = this.props.caInfo.photo||JSON.stringify([]);
        const photoUrl = JSON.parse(photo)[0]||{response:{}};
        return (
            <div>
                <Card title='培训信息' style={{marginLeft:15,marginRight:15}}>
                    <div className='commonEnterpriseBox'>
                        <table>
                            <tbody>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'10%'}}>姓名：</td>
                                <td style={{width:'15%'}}>{caInfo.name}</td>
                                <td style={{background:'#F2F2F2',width:'10%'}}>身份证号：</td>
                                <td style={{width:'15%'}}>{caInfo.idNumber}</td>
                                <td style={{background:'#F2F2F2',width:'10%'}}>性别：</td>
                                <td style={{width:'15%'}}>{caInfo.sexy===0?'男':'女'}</td>
                                <td rowSpan={6}>
                                    <img src={commonUrl+'/upload/picture/'+photoUrl.response.data} style={{height:'230px'}} style={{height:'230px'}} alt="avatar" />
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
                                <td>{caInfo.allScore}</td>
                                <td style={{background:'#F2F2F2'}}>考试合格线：</td>
                                <td></td>
                                <td style={{background:'#F2F2F2'}}>考试情况：</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>考试名称:</td>
                                <td colSpan={5}></td>
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
                <Card title='培训课程' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                    <Table
                        columns={columns}
                        dataSource={this.state.courseList}>
                    </Table>
                </Card>
                <Modal
                    width='1000px'
                    title="培训进度"
                    destroyOnClose
                    maskClosable={false}
                    // getContainer={()=>this.refs.trainPerson}
                    footer={null}
                    visible={this.state.isVisible}
                    onCancel={()=>{
                        //this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                   <MaterialProgress caId={caInfo.id||{}} courseId={this.state.courseId||{}}/>
                </Modal>
            </div>


        );
    }

}