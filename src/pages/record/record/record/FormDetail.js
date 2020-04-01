import React from 'react'
import {Form,Select,Input,Row,Col,Radio,DatePicker,Icon,Modal,Button } from 'antd'
import { momentImmutableMethods } from 'moment-immutable-methods'
import './style.less'
import connect from "react-redux/es/connect/connect";
import {changeRadioMethod} from '../../../../redux/action'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import axios from '../../../../axios'
import 'moment/locale/zh-cn';
import EnterpriseList from './EnterpriseList'
import InstructList from './InstructList'
moment.locale('zh-cn');
momentImmutableMethods(moment)
const {Option} = Select
const {TextArea} = Input
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}
@connect(
    state=>({
        radioMethod:state.radioMethod,
        recordPerson:state.userName
    }),
    {
        changeRadioMethod
    }
)
class FormDetail extends React.Component{
    state={
        disabledFinishTime:true,
        incomingType:[],
        informationType:[],
        emergencyType:[],
        enterprise:[],
        problemOne:[],
        problemTwo:[],
        areaName:[],
        dept:[],
        finishTime:moment()
    }

    componentDidMount(){
        this.props.onRef(this)
        this.getFinishTime(1)
        const url=[
                {
                    type:"incomingType",
                    url:"/complaintIncomingCallType/getPageList"
                },
                {
                    type:"informationType",
                    url:"/complaintInformationComeType/getPageList"
                },
                {
                    type:"emergencyType",
                    url:"/complaintEmergencyType/getPageList"
                },
                {
                    type:"problemOne",
                    url:"/complaintProblemTypeOne/getPageList"
                },
                {
                    type:"areaName",
                    url:"/sys/area/getAll"
                },
                {
                    type:"dept",
                    url:"/sys/dept/getAll"
                },
            ]
        url.forEach((item,index)=>{
            axios.ajax({
                url:item.url
            }).then((res)=>{
               this.setState({
                    [item.type]:res.data.data||res.data
                })
            })
        })
    }
    getDealDeadTime(){
        let arr = []
        for(let i=1;i<=15;i++){
            arr.push(
               <Option value={i}>
                   {i}个工作日
               </Option>
            )
        }
        return arr
    }

    getFinishTime=(value)=>{
        const {getFieldValue} = this.props.form
        let i = 0
        if(typeof(value)==="number"){
            let incomingTime = getFieldValue("incomingTime")
            while(i<value){
                if(incomingTime.addImmu(1,'d').weekday()!==5&&incomingTime.addImmu(1,'d').weekday()!==6){
                    i++
                    incomingTime = incomingTime.addImmu(1,'d')
                }else{
                    incomingTime = incomingTime.addImmu(1,'d')
                }
            }
            this.setState({
                finishTime:value===16?moment():incomingTime,
                // disabledFinishTime:value===16?false:true
            })
        }else if(typeof(value)==="object"){
            let deadTime = getFieldValue("deadTime")
            while(i<deadTime){
                if(value.addImmu(1,'d').weekday()!==5&&value.addImmu(1,'d').weekday()!==6){
                    i++
                    value = value.addImmu(1,'d')
                }else{
                    value = value.addImmu(1,'d')
                }
            }
            this.setState({
                finishTime:deadTime===16?moment():value,
                // disabledFinishTime:deadTime===16?false:true
            })
        } 
    }


    handleFocus(which){
        this.setState({
            [which]:true
        })
    }
    handleCloseModal(which){
        this.setState({
            [which]:false
        })
    }

    handleChangeQuestionOne(value){
        axios.ajax({
            url:"/complaintProblemTypeTwo/getListByOne",
            data:{
                isShowLoading:false,
                params:{
                    oneType:value
                }
            }
        }).then((res)=>{
            this.setState({
                problemTwo:res.data
            })
            console.log(this.props.recordPerson);
        })
    }

    handleChoose=(record)=>{
        const {setFieldsValue} = this.props.form
        this.setState({
            modalEnterprise:false
        })
        setFieldsValue({enterprise:record.enterpriseName,area:record.areaName,address:record.businessAddress})
    }
    handleChooseInstruct=(record)=>{
        const {setFieldsValue} = this.props.form
        this.setState({
            modalInstruct:false,
            choosedInstructId:record.id
        })
        setFieldsValue({leader:record.name})
    }
    getMethodDisplay(){
        const {getFieldDecorator,getFieldValue} = this.props.form
        const {action,nowDealRecord} = this.props
        switch(getFieldValue("step")){
            case 1:
                return(
                    <React.Fragment>
                    <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label="办理部门">
                                 {getFieldDecorator('dept', {
                                     initialValue:nowDealRecord.dept,
                                    rules: [{ required:true,message:<div/> }],
                                })(
                                <Select
                                    disabled={action!=="add"}
                                    style={{width:400}}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    >
                                    {
                                        this.state.dept.map((item,index)=>{
                                            return (
                                                <Option value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })
                                    }
                                </Select>
                                )}
                        </Form.Item>
                </div>
                {
                    nowDealRecord.state===1|| nowDealRecord.state===2?
                    <div className="row-my deal-result" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label={<div style={{height:"100%"}}><p style={{display:"inline-block"}}>办理结果</p><span style={{verticalAlign:"middle",height:"100%",display:"inline-block"}}></span></div>}>
                             {getFieldDecorator('result', {
                                     initialValue:nowDealRecord.result,
                                })(
                             <TextArea disabled={action==="view"} autosize={{minRows:4,maxRows:10}} className="textarea-my-1"/>)}
                        </Form.Item>
                </div>:null
                }
                </React.Fragment>
                )
            case 2:
                return (
                    <div className="row-my deal-result" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label={<div style={{height:"100%"}}><p style={{display:"inline-block"}}>办理结果</p><span style={{verticalAlign:"middle",height:"100%",display:"inline-block"}}></span></div>}>
                             {getFieldDecorator('result', {
                                     initialValue:nowDealRecord.result,
                                })(
                                    <TextArea disabled={action!=="add"} autosize={{minRows:4,maxRows:10}} className="textarea-my-1"/>
                                )}
                        </Form.Item>
                </div>
                )
            case 3:
                return(
                    <React.Fragment>
                    <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"66%",margin:0}}
                            label="批示人">
                                 {getFieldDecorator('leader', {
                                     initialValue:nowDealRecord.leaderName,
                                })(
                                    <Input
                                    className="disabled-input-my"
                                    disabled={true}
                                    style={{width:420}}/>
                            )}
                            <Icon onClick={action!=="add"?null:()=>this.handleFocus("modalInstruct")} style={{marginLeft:5}} type="search"/>
                        </Form.Item>
                        <Modal
                            title="局领导列表"
                            visible={this.state.modalInstruct}
                            width={1000}
                            footer={<Button onClick={()=>this.handleCloseModal("modalInstruct")}>关闭</Button>}
                            onCancel={()=>this.handleCloseModal("modalInstruct")}
                        >
                            <InstructList handleChooseInstruct={this.handleChooseInstruct}/>
                        </Modal>
                        {action==="add"?
                            null:
                            <Form.Item
                                colon={false}
                                style={{width:"33%",margin:0}}
                                label="批示时间">
                                    {getFieldDecorator('instructTime', {
                                        initialValue:moment(nowDealRecord.instructTime),
                                    })(
                                        <DatePicker allowClear={false} disabled={action==="view"||nowDealRecord.state===4} locale={locale} className="input-my-1"/>
                                    )}
                            </Form.Item>
                        }

                </div>
                {
                    action==="add"?
                    null:
                    <React.Fragment>
                        <div className="row-my deal-result" style={{width:"100%"}}>
                                <Form.Item
                                    colon={false}
                                    style={{width:"99%",margin:0}}
                                    label={<div style={{height:"100%"}}><p style={{display:"inline-block"}}>领导批示</p><span style={{verticalAlign:"middle",height:"100%",display:"inline-block"}}></span></div>}>

                                    {getFieldDecorator('instruction', {
                                        initialValue:nowDealRecord.instruction,
                                    })(
                                        <TextArea disabled={action==="view"||nowDealRecord.state===4} autosize={{minRows:4,maxRows:10}} className="textarea-my-1"/>
                                    )}
                                </Form.Item>
                        </div>
                        <div className="row-my" style={{width:"100%"}}>
                                <Form.Item
                                    colon={false}
                                    style={{width:"99%",margin:0}}
                                    label="办理部门">
                                        {getFieldDecorator('dept', {
                                            initialValue:nowDealRecord.dept===0?null:nowDealRecord.dept,
                                            rules: [{ required:true,message:<div/> }],
                                        })(
                                        <Select
                                            disabled={nowDealRecord.state===4||action==="view"}
                                            placeholder={"请选择办理部门"}
                                            style={{width:400}}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            >
                                            {
                                                this.state.dept.map((item,index)=>{
                                                    return (
                                                        <Option value={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        )}
                                </Form.Item>
                        </div>
                        </React.Fragment>
                }
                {
                    nowDealRecord.state===4||(action==="view"&&nowDealRecord.state===2)?
                    <div className="row-my deal-result" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label={<div style={{height:"100%"}}><p style={{display:"inline-block"}}>办理结果</p><span style={{verticalAlign:"middle",height:"100%",display:"inline-block"}}></span></div>}>
                             {getFieldDecorator('result', {
                                     initialValue:nowDealRecord.result,
                                })(
                             <TextArea disabled={action==="view"} autosize={{minRows:4,maxRows:10}} className="textarea-my-1"/>)}
                        </Form.Item>
                </div>:null
                }
                </React.Fragment>
                )
            default:
                return null
        }
    }
    render(){
        const {action,nowDealRecord} = this.props;
        const { getFieldDecorator } = this.props.form;
        return(
        <div className="form-detail-wrap">
            <Form layout="inline" labelAlign="left">
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                        colon={false}
                            style={{width:"33%",margin:0}}
                            label="受理员">
                                {getFieldDecorator('recordPerson', {
                                    initialValue: nowDealRecord.recordPerson,
                                })(<Input placeholder={this.props.recordPerson} defaultValue={this.props.recordPerson} disabled className="input-my-1"/>)}
                        </Form.Item>
                        <Form.Item
                            style={{width:"33%",margin:0}}
                            colon={false}
                            label="受理员编号">
                                {getFieldDecorator('recordNumber', {
                                    initialValue: nowDealRecord.recordNumber,
                                })(<Input disabled={action!=="add"} className="input-my-1" placeholder="请输入受理员编号"/>)}
                        </Form.Item>
                    
                        <Form.Item 
                            style={{width:"33%",margin:0}}
                            colon={false}
                            label="工单编号">
                                {getFieldDecorator('record', {
                                    initialValue: nowDealRecord.record,
                                })(<Input disabled={action!=="add"} className="input-my-1" placeholder="请输入工单编号"/>)}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                        colon={false}
                            style={{width:"33%",margin:0}}
                            label="来电时间">
                                {getFieldDecorator('incomingTime', {
                                    initialValue:moment(nowDealRecord.incomingTime)||moment(),
                                    rules: [{ required:true,message:<div/> }],
                                })(<DatePicker allowClear={false} disabled={action!=="add"} onChange={this.getFinishTime} locale={locale} className="input-my-1"/>)}
                        </Form.Item>
                        <Form.Item
                            style={{width:"33%",margin:0}}
                            colon={false}
                            label="办理期限">
                                {getFieldDecorator('deadTime', {
                                    initialValue:nowDealRecord.deadTime,
                                    rules: [{ required:true,message:<div/> }],
                                })(<Select disabled={action!=="add"} onChange={this.getFinishTime} className="input-my-1" placeholder="请选择办理期限">
                                {
                                    action!=="add"?<Option value={nowDealRecord.deadTime}>{nowDealRecord.deadTime}个工作日</Option>:this.getDealDeadTime()
                                }
                                <Option value={16}>延期（手动选择办结日期）</Option>
                            </Select>)}
                        </Form.Item>
                    
                        <Form.Item 
                            style={{width:"33%",margin:0}}
                            colon={false}
                            label="办结日期">
                                {getFieldDecorator('finishTime', {
                                    initialValue:(nowDealRecord.finishTime&&moment(nowDealRecord.finishTime))||this.state.finishTime,
                                    rules: [{ required:true,message:<div/> }],
                                })(<DatePicker allowClear={false} disabled={action!=="add"} locale={locale} className="input-my-1"/>)}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                        colon={false}
                            style={{width:"33%",margin:0}}
                            label="来电类别">
                                {getFieldDecorator('incomingType', {
                                    initialValue:nowDealRecord.incomingType,
                                    rules: [{ required:true,message:<div/> }],
                                })(
                                    <Select
                                    disabled={action!=="add"}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }
                                        placeholder="请选择来电类别" 
                                        className="input-my-1">
                                        {
                                            this.state.incomingType.map((item,index)=>{
                                                return(<Option value={item.type}>{item.type}</Option>)
                                            })
                                        }

                                    </Select>
                                )}
                        </Form.Item>
                        <Form.Item
                            style={{width:"33%",margin:0}}
                            colon={false}
                            label="信息来源">
                                {getFieldDecorator('informationType', {
                                    initialValue:nowDealRecord.informationType,
                                    rules: [{ required:true,message:<div/> }],
                                })(
                                    <Select
                                    disabled={action!=="add"}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }
                                        placeholder="请选择信息来源" 
                                        className="input-my-1">
                                        {
                                            this.state.informationType.map((item,index)=>{
                                                return(<Option value={item.type}>{item.type}</Option>)
                                            })
                                        }
                                    </Select>
                                )}
                        </Form.Item>
                        <Form.Item 
                            style={{width:"33%",margin:0}}
                            colon={false}
                            label="紧急程度">
                                {getFieldDecorator('emergencyType', {
                                   initialValue:nowDealRecord.emergencyType
                                   
                                })(
                                    <Select 
                                    disabled={action!=="add"}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }
                                        placeholder="请选择紧急程度"
                                        className="input-my-1">
                                        {
                                            this.state.emergencyType.map((item,index)=>{
                                                return(<Option value={item.type}>{item.type}</Option>)
                                            })
                                        }
                                    </Select>
                                )}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                        colon={false}
                            style={{width:"33%",margin:0}}
                            label="投诉人姓名">
                                {getFieldDecorator('complaintPerson', {
                                 initialValue:nowDealRecord.complaintPerson,
                                    rules: [{ required:true,message:<div/> }],
                                })(
                                    <Input disabled={action!=="add"} className="input-my-1"/>
                                )}
                        </Form.Item>
                        <Form.Item
                            style={{width:"66%",margin:0}}
                            colon={false}
                            label="联系方式">
                                {getFieldDecorator('contact', {
                                  initialValue:nowDealRecord.contact
                                    
                                })(
                                    <Input disabled={action!=="add"} className="input-my-2"/>
                                )}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                        colon={false}
                            style={{width:"33%",margin:0}}
                            label="是否保密">
                                {getFieldDecorator('secrecy', {
                                  initialValue:nowDealRecord.secrecy
                                    
                                })(
                                    <Radio.Group disabled={action!=="add"}>
                                    <Radio value={"是"}>是</Radio>
                                    <Radio value={"否"}>否</Radio>
                                    </Radio.Group>
                                )}
                            
                        </Form.Item>
                        <Form.Item
                            style={{width:"66%",margin:0}}
                            colon={false}
                            label="是否回复">
                                {getFieldDecorator('reply', {
                                   initialValue:nowDealRecord.reply
                                    
                                })(
                                    <Radio.Group disabled={action!=="add"}>
                                        <Radio value={"是"}>是</Radio>
                                        <Radio value={"否"}>否</Radio>
                                    </Radio.Group>
                                )}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"66%",margin:0}}
                            className="long-text"
                            label="被投诉单位/当事人">
                                {getFieldDecorator('enterprise', {
                                   initialValue:nowDealRecord.enterprise
                                })(
                                    <Input
                                        disabled={action!=="add"}
                                        style={{width:420}}/>
                                )}
                                <Icon onClick={action!=="add"?null:()=>this.handleFocus("modalEnterprise")} style={{marginLeft:5}} type="search"/>
                        </Form.Item>
                        <Modal
                            title="企业列表"
                            visible={this.state.modalEnterprise}
                            width={1000}
                            footer={<Button onClick={()=>this.handleCloseModal("modalEnterprise")}>关闭</Button>}
                            onCancel={()=>this.handleCloseModal("modalEnterprise")}
                        >
                            <EnterpriseList handleChoose={this.handleChoose}/>
                        </Modal>
                        <Form.Item
                            style={{width:"33%",margin:0}}
                            colon={false}
                            label="所在区域">
                                {getFieldDecorator('area', {
                                    initialValue:nowDealRecord.area
                                })(
                                    <Select
                                    disabled={action!=="add"}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      } 
                                        className="input-my-1">
                                        {this.state.areaName.map((item,index)=>{
                                            return (
                                                <Option value={item.name}>{item.name}</Option>
                                            )
                                        })}
                                    </Select>
                                )}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label="事件地址">
                                {getFieldDecorator('address', {
                                    initialValue:nowDealRecord.address
                                   
                                })(
                                    <Input disabled={action!=="add"} className="input-my-3"/>
                                )}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label="问题分类">
                                <Row type="flex" style={{width:"600px"}}>
                                    <Col span={2}>
                                       一类
                                    </Col>
                                    <Col span={9}>
                                    {getFieldDecorator('problemOne', {
                                          initialValue:nowDealRecord.problemOne
                                        })(
                                            <Select
                                            disabled={action!=="add"}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                              } 
                                                onChange={(value)=>this.handleChangeQuestionOne(value)} placeholder="请选择一类">
                                                {
                                                    this.state.problemOne.map((item,index)=>{
                                                        return (
                                                            <Option value={item.type}>{item.type}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={2}>
                                        二类
                                    </Col>
                                    <Col span={9}>
                                    {getFieldDecorator('problemTwo', {
                                        initialValue:(nowDealRecord.problemTwo)||(this.state.problemTwo[0]&&this.state.problemTwo[0].type)
                                        })(
                                            <Select
                                            disabled={action!=="add"}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                              } 
                                                placeholder={this.props.form.getFieldValue("problemOne")===undefined?"请先选择一类":"空"}>
                                                {
                                                    this.state.problemTwo.map((item,index)=>{
                                                        return(
                                                            <Option value={item.type}>{item.type}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </Col>
                                </Row>
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label={<div style={{height:"100%"}}><p style={{display:"inline-block"}}>来电内容</p><span style={{verticalAlign:"middle",height:"100%",display:"inline-block"}}></span></div>}>
                            {getFieldDecorator('incomingContent', {
                                        initialValue:nowDealRecord.incomingContent
                                           
                                        })(
                                            <TextArea disabled={action!=="add"} autosize={{minRows:4,maxRows:10}} className="textarea-my-1"/>
                                        )}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label={<div style={{height:"100%"}}><p style={{display:"inline-block"}}>转办意见</p><span style={{verticalAlign:"middle",height:"100%",display:"inline-block"}}></span></div>}>
                            {getFieldDecorator('suggestion', {
                                           initialValue:nowDealRecord.suggestion|| `默认转办意见如下（可根据情况修改）：\n请在接到转办单后第一个工作日内联系来话人核实有关情况，并将具体办理结果于办理日期之前回复来话人(保密无需回复)，同时系统反馈我中心。如不属贵单位管辖，请务必于收到当日回复，避免延误办理时限。\n注：1.严禁将举报者的个人信息透漏给被举报单位及个人或者将工单交由被投诉单位或个人处置。\n2.务必注明具体负责承办此事的分管领导、联系人和联系电话。\n3.如因调查处置不力或瞒报谎报处置结果的，我中心将会把回复办理情况作为事后追责重要依据，请务必高度重视。`
                                            
                                        })(
                                            <TextArea disabled={action!=="add"} autosize={{minRows:4,maxRows:10}} className="textarea-my-1"/>
                                        )}
                        </Form.Item>
                </div>
                <div className="row-my" style={{width:"100%"}}>
                        <Form.Item
                            colon={false}
                            style={{width:"99%",margin:0}}
                            label="流程选择">
                         {getFieldDecorator('step', { 
                             initialValue:nowDealRecord.step||1
                         })(
                                            <Radio.Group onChange={(e)=>this.props.handleChangeRatio(e.target.value)} disabled={action!=="add"}>
                                                <Radio value={1}>内部转办</Radio>
                                                <Radio value={2}>直接答复</Radio>
                                                <Radio value={3}>领导批示</Radio>
                                            </Radio.Group>
                                            )}
                        </Form.Item>
                </div>
                {this.getMethodDisplay()}
            </Form>
        </div>
        )
    }
}

export default Form.create({})(FormDetail)