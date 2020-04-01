import React,{Component} from 'react';
import {Form, Input, Modal, Row, Col, DatePicker, Select, Icon} from 'antd';
import SubjectForm from "./SubjectForm";
import TrainForm from './TrainForm';
import moment from 'moment';
import axios from "../../../axios";
const Option = Select.Option;
const FormItem = Form.Item;

class AddForm extends Component{
    state={}
    componentDidMount(){
        this.requestInfo();
    }
    handleSubjectInfo=(data)=>{
        let value = this.props.examInfo;
        value.workTypeName = data.workTypeName;
        value.subjectId=data.id;
        this.props.dispatchSubjectInfo(value);
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
    render(){
        const { getFieldDecorator } = this.props.form;
        const examInfo = this.props.examInfo || {};
        const formItemLayout = {
            labelCol: {span: 12},
            wrapperCol: {span: 12}
        };
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <Form layout="horizontal">
                <FormItem label="考试名称" labelCol={{span:4}} wrapperCol={{span:18}}>
                {
                    getFieldDecorator('name',{
                        initialValue:examInfo.name
                    })(
                        <Input type="text" placeholder="请输入考试名称" disabled={checkStatus}/>
                    )
                }
            </FormItem>
                <Row>
                    <Col span={8}>
                        <FormItem label="行业类别" {...formItemLayout}>
                            {
                                getFieldDecorator('industry',{
                                    initialValue:examInfo.industry
                                })(
                                    <Select style={{ width: 200 }} disabled={checkStatus}>
                                        {(this.state.industryList||[]).map((item)=><Option value={item.id}>{item.name}</Option>)}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={13}>
                        <FormItem label="工作种类" {...formItemLayout}>
                            {
                                getFieldDecorator('workType',{
                                    initialValue:examInfo.workType
                                })(
                                    <Select style={{ width: 200 }} disabled={checkStatus?true:(this.props.form.getFieldValue("industry")?false:true)}>
                                        {(this.state.workTypeList||[]).filter((item)=>item.industryId==this.props.form.getFieldValue("industry")).map((item)=><Option value={item.id}>{item.name}</Option>)}
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label="考试类型" {...formItemLayout}>
                            {
                                getFieldDecorator('examType',{
                                    initialValue:examInfo.examType
                                })(
                                    <Select style={{ width: 200 }} disabled={checkStatus}>
                                        <Option value={1} key={1}>在线考试</Option>
                                        <Option value={2} key={2}>现场考试</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={13}>
                        <div style={{marginBottom:15}}>
                            <Row>
                                <Col span={12} style={{color:'#262626',textAlign:'right',paddingRight:10}}>选择考题:</Col>
                                <Col span={12}><Input style={{ width: 200 }} value={examInfo.workTypeName||''} onClick={()=>this.setState({isVisible:true})} placeholder="请选择考题" suffix={<Icon type="search" />} disabled={checkStatus}/></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <FormItem label="对应培训" labelCol={{span:4}} wrapperCol={{span:18}}>
                    {
                        getFieldDecorator('trainCourseName',{
                            initialValue:examInfo.trainCourseName
                        })(
                            <Input onClick={()=>this.setState({isTrainVisible:true})} placeholder="请选择对应培训" suffix={<Icon type="search"/>} disabled={checkStatus}/>
                        )
                    }
                </FormItem>
                <Row>
                    <Col span={8}>
                        <FormItem label="开始日期" {...formItemLayout}>
                            {
                                getFieldDecorator('startTime',{
                                    initialValue:examInfo.startTime===''?moment():moment(examInfo.startTime)
                                })(
                                    <DatePicker showTime={true} placeholder="请输入开始时间" format="YYYY-MM-DD HH:mm:ss" disabled={checkStatus}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={13}>
                        <FormItem label="结束日期" {...formItemLayout}>
                            {
                                getFieldDecorator('endTime',{
                                    initialValue:examInfo.endTime===''?moment():moment(examInfo.endTime)
                                })(
                                    <DatePicker showTime={true} placeholder="请输入结束时间" format="YYYY-MM-DD HH:mm:ss" disabled={checkStatus}/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="考前说明" labelCol={{span:4}} wrapperCol={{span:18}}>
                    {
                        getFieldDecorator('preExam',{
                            initialValue:examInfo.preExam
                        })(
                            <Input.TextArea type="text" autosize={ {minRows:4, maxRows: 6}} placeholder="请输入考前说明" disabled={checkStatus}/>
                        )
                    }
                </FormItem>
                <FormItem label="备注" labelCol={{span:4}} wrapperCol={{span:18}}>
                    {
                        getFieldDecorator('remark',{
                            initialValue:examInfo.remark
                        })(
                            <Input.TextArea type="text" autosize={ {minRows:4, maxRows: 6}} placeholder="请输入备注" disabled={checkStatus}/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('id',{
                            initialValue:examInfo.id
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('trainCourse',{
                            initialValue:examInfo.trainCourse
                        })(
                            <Input type="hidden"/>
                        )
                    }
                </FormItem>
                <Modal
                    width='1000px'
                    title="考试科目信息"
                    visible={this.state.isVisible}
                    footer={null}
                    onCancel={()=>{
                        //this.addForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <SubjectForm dispatchSubject={(item)=>{
                        this.setState({isVisible:false})
                        this.handleSubjectInfo(item)}} />
                </Modal>
                <Modal
                width='700px'
                title="培训课程信息"
                visible={this.state.isTrainVisible}
                footer={null}
                onCancel={()=>{
                    this.setState({
                        isTrainVisible:false
                    })
                }}
            >
                <TrainForm dispatchTrain={(item)=>{
                    this.setState({isTrainVisible:false})
                    this.props.form.setFieldsValue({
                        trainCourse:item.id,
                        trainCourseName:item.name
                    })}} />
            </Modal>
            </Form>
        );
    }
}
export default Form.create({})(AddForm);