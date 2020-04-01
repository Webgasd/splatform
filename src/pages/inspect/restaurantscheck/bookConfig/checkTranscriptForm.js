import React,{ Component } from 'react';
import {Input, Icon, Radio, DatePicker,Modal} from 'antd';
import moment from "moment";
import {commonUrl} from "../../../../axios/commonSrc";
import SignConfForm from "./signConfForm";

export default class CheckTranscript extends Component{
    state={}
    changeInput =(value,option)=>{
        let data = this.props.bookData;
        data[option] = value;
        this.props.dispatchBookData(data);
    }
    render() {
        const bookData=this.props.bookData;
        const checkStatus = this.props.type=='detail'?true:false;
        return (<div>
            <div className='commonInspectBoxHeadTop'><div className='commonInspectTopText'>行政处罚文书</div></div>
            <div className='commonInspectBoxHeadBottom'>现场检查笔录</div>
            <div className='commonInspectBox'>
            <table>
                <tbody>
                <tr>
                    <th style={{width:80,color:'#ffffff',background:'#0499CC'}}>检查事由</th>
                    <td colSpan={7}><Input disabled={checkStatus} value={bookData.checkCause} onChange={(e)=>this.changeInput(e.target.value,"checkCause")} placeholder={"检查事由"} suffix={<Icon type="search" />}/></td>
                </tr>
                <tr><td style={{height:0,border:0}}/></tr>
                <tr>
                    <th rowSpan={5}>当事人信息</th>
                    <td style={{width:0,border:0,padding:3}} rowSpan={5}/>
                    <th style={{width:100}}>当事人<span style={{color:'#FF3300'}}>*</span></th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.party} onChange={(e)=>this.changeInput(e.target.value,"party")} placeholder={"当事人"}/></td>
                    <th style={{width:100}}>主体资格证照名称</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.mainQualification} onChange={(e)=>this.changeInput(e.target.value,"mainQualification")} placeholder={"主体资格证照名称"}/></td>
                </tr>
                <tr>
                    <th>统一社会信用代码(注册号)</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.registrationNumber} onChange={(e)=>this.changeInput(e.target.value,"registrationNumber")} placeholder={"统一社会信用代码(注册号)"}/></td>
                    <th>住所(住址)</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.address} onChange={(e)=>this.changeInput(e.target.value,"address")} placeholder={"住所(住址)"}/></td>
                </tr>
                <tr>
                    <th>法定代表人/负责人</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.header} onChange={(e)=>this.changeInput(e.target.value,"header")} placeholder={"法定代表人/负责人"}/></td>
                    <th>身份证号</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.idNumber} onChange={(e)=>this.changeInput(e.target.value,"idNumber")} placeholder={"身份证号"}/></td>
                </tr>
                <tr>
                    <th>联系电话</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.phoneNumber} onChange={(e)=>this.changeInput(e.target.value,"phoneNumber")} placeholder={"联系电话"}/></td>
                    <th>其他联系方式</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.ortherContact} onChange={(e)=>this.changeInput(e.target.value,"ortherContact")} placeholder={"其他联系方式"}/></td>
                </tr>
                <tr>
                    <th>联系地址</th>
                    <td colSpan={5}><Input disabled={checkStatus} value={bookData.contactAddress} onChange={(e)=>this.changeInput(e.target.value,"contactAddress")} placeholder={"联系地址"}/></td>
                </tr>
                <tr><td style={{height:0,border:0}}/></tr>
                <tr>
                    <th rowSpan={5}>检查告知</th>
                    <td style={{width:0,border:0,padding:3}} rowSpan={5}/>
                    <th>检查人<span style={{color:'#FF3300'}}>*</span></th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.examiner} onChange={(e)=>this.changeInput(e.target.value,"examiner")} placeholder={"检查人"}/></td>
                    <th>执法证号</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.enforcementNumber} onChange={(e)=>this.changeInput(e.target.value,"enforcementNumber")} placeholder={"执法证号"}/></td>
                </tr>
                <tr>
                    <th>执法部门</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.lawEnforcement} onChange={(e)=>this.changeInput(e.target.value,"lawEnforcement")} placeholder={"执法部门"}/></td>
                    <th>检查地点</th>
                    <td colSpan={2}><Input disabled={checkStatus} value={bookData.checkAddress} onChange={(e)=>this.changeInput(e.target.value,"checkAddress")} placeholder={"检查地点"}/></td>
                </tr>
                <tr>
                    <th>检查时间</th>
                    <td colSpan={2}><DatePicker disabled={checkStatus}
                                                defaultValue={bookData.checkTimeFrom==null?null:moment(bookData.checkTimeFrom)}
                                                onChange={(date)=>this.changeInput(date,'checkTimeFrom')}
                                                format="YYYY-MM-DD HH:mm"
                                                placeholder='请选择开始时间' style={{width:'100%'}}/></td>
                    <td colSpan={3} style={{textAlign:'left'}}>
                        <DatePicker disabled={checkStatus}
                                    defaultValue={bookData.checkTimeTo==null?null:moment(bookData.checkTimeTo)}
                                    onChange={(date)=>this.changeInput(date,'checkTimeTo')}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder='请选择结束时间' style={{width:187}}/>
                    </td>
                </tr>
                <tr>
                    <th>到场情况</th>
                    <td colSpan={5}><Input disabled={checkStatus} value={bookData.presentSituation} onChange={(e)=>this.changeInput(e.target.value,"presentSituation")} placeholder={"到场情况"}/></td>
                </tr>
                <tr>
                    <th>是否申请检察人员回避</th>
                    <td style={{width:130}}><Radio.Group disabled={checkStatus} value={bookData.applyAvoid} onChange={(e)=>this.changeInput(e.target.value,"applyAvoid")}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </Radio.Group></td>
                    <th style={{width:70}}>见证人姓名</th>
                    <td><Input disabled={checkStatus} value={bookData.witnessName} onChange={(e)=>this.changeInput(e.target.value,"witnessName")} placeholder={"姓名"}/></td>
                    <th>见证人身份证号</th>
                    <td><Input disabled={checkStatus} value={bookData.witnessId} onChange={(e)=>this.changeInput(e.target.value,"witnessId")} placeholder={"见证人身份证号"}/></td>
                </tr>
                <tr><td style={{height:0,border:0}}/></tr>
                <tr>
                    <th>如实施强制措施告知当事人</th>
                    <td style={{width:0,border:0,padding:3}}/>
                    <td colSpan={6}><Input.TextArea disabled={checkStatus} value={bookData.informParties} onChange={(e)=>this.changeInput(e.target.value,"informParties")} rows={4} placeholder={"如实施强制措施告知当事人"}/></td>
                </tr>
                <tr>
                    <th>当事人陈述/申辩</th>
                    <td style={{width:0,border:0,padding:3}}/>
                    <td colSpan={6}><Input.TextArea disabled={checkStatus} value={bookData.statement} onChange={(e)=>this.changeInput(e.target.value,"statement")} rows={4} placeholder={"当事人陈述/申辩"}/></td>
                </tr>
                <tr>
                    <th>现场情况</th>
                    <td style={{width:0,border:0,padding:3}}/>
                    <td colSpan={6}><Input.TextArea disabled={checkStatus} value={bookData.sceneCondition} onChange={(e)=>this.changeInput(e.target.value,"sceneCondition")} rows={6} placeholder={"现场情况"}/></td>
                </tr>
                <tr><td style={{height:0,border:0}}/></tr>
                </tbody>
            </table>
            <table>
                <tbody>
                <tr>
                    <th style={{width:80}}>记录人核验第一执法人</th>
                    <td ><div className='signBox' onClick={checkStatus?null:()=>this.setState({isSignVisible:true,signPerson:1})}>
                        <div className='signBoxLeft'><Icon type='lock'/>签字调取</div>
                        <div className='signBoxRight'><div className='signBoxRightContent'>
                            {bookData.firstEnforcer?<img src={commonUrl+"/upload/picture/" +bookData.firstEnforcer} style={{height:50}} alt="avatar"/>:null}
                        </div></div>
                    </div></td>
                    <th style={{width:80}}>第二执法人</th>
                    <td ><div className='signBox'  onClick={checkStatus?null:()=>this.setState({isSignVisible:true,signPerson:2})}>
                        <div className='signBoxLeft'><Icon type='lock'/>签字调取</div>
                        <div className='signBoxRight'><div className='signBoxRightContent'>
                            {bookData.secondEnforcer?<img src={commonUrl+"/upload/picture/" +bookData.secondEnforcer} style={{height:50}} alt="avatar"/>:null}
                        </div></div>
                    </div></td>
                </tr>
                <tr>
                    <th>记录时间</th>
                    <td colSpan={3}>{moment().format('YYYY-MM-DD')}</td>
                </tr>
                </tbody>
            </table>
                <Modal
                    width='1000px'
                    title="签字列表"
                    visible={this.state.isSignVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isSignVisible:false
                        })
                    }}
                >
                    <SignConfForm
                        signGaId={bookData.supervisorId||''}
                        dispatchSign={(item)=>{
                        this.setState({isSignVisible:false})
                        let bookData = this.props.bookData;
                        let picture = JSON.parse(item.pic||JSON.stringify([]))
                        if(this.state.signPerson==1){
                            bookData.firstEnforcer=((((picture||[])[0]||{}).response)||{}).data;
                        }else if(this.state.signPerson==2){
                            bookData.secondEnforcer=((((picture||[])[0]||{}).response)||{}).data;
                        }
                        this.props.dispatchBookData(bookData)}}/>
                </Modal>
        </div>
        </div>);
    }

}