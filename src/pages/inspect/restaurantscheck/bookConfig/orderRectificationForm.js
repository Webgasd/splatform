import React,{ Component } from 'react';
import {Icon, Input, DatePicker, Modal} from 'antd';
import moment from "moment";
import BookActionForm from "./bookActionForm";


export default class OrderRectification extends Component{
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
                <div className='commonInspectBoxHeadBottom'>责令改正通知书</div>
        <div className='commonInspectBox'>
            <table>
                <tbody>
                <tr>
                     <th style={{width:80,color:'#ffffff',background:'#0499CC'}}>责改文号</th>
                     <td colSpan={3}><Input disabled={checkStatus} value={bookData.fileNumber} onChange={(e)=>this.changeInput(e.target.value,"fileNumber")} placeholder={"请输入责改文号"}/></td>
                </tr>
                <tr><td style={{height:0,border:0}}/></tr>
                <tr>
                     <th rowSpan={2}>当事人信息</th>
                     <td style={{width:0,border:0,padding:1}} rowSpan={2}/>
                     <th style={{width:100}}>当事人<span style={{color:'#FF3300'}}>*</span></th>
                     <td><Input disabled={checkStatus} value={bookData.concernedPerson} onChange={(e)=>this.changeInput(e.target.value,"concernedPerson")} placeholder={"请输入当事人"}/></td>
                </tr>
                <tr>
                    <th>经营地址</th>
                    <td><Input disabled={checkStatus} value={bookData.businessAddress} onChange={(e)=>this.changeInput(e.target.value,"businessAddress")} placeholder={"请输入经营地址"}/></td>
                </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                <tr><td style={{height:0,border:0}}/></tr>
                <tr>
                    <th style={{width:80}}>行为<span style={{color:'#FF3300'}}>*</span></th>
                    <td colSpan={7}><Input disabled={checkStatus} value={bookData.behavior} onChange={(e)=>this.changeInput(e.target.value,"behavior")} placeholder={"请选择行为"} suffix={<Icon onClick={()=>this.setState({isVisible:true})} type="search" />}/></td>
                </tr>
                <tr>
                    <th>违反规定</th>
                    <td colSpan={7}><Input disabled={checkStatus} value={bookData.violationRegulations} onChange={(e)=>this.changeInput(e.target.value,"violationRegulations")} placeholder={"请输入违反规定"}/></td>
                </tr>
                <tr>
                    <th>依据法规<span style={{color:'#FF3300'}}>*</span></th>
                    <td><Input disabled={checkStatus} value={bookData.accordingLaw} onChange={(e)=>this.changeInput(e.target.value,"accordingLaw")} placeholder={"请输入法规"}/></td>
                    <th>条</th>
                    <td><Input disabled={checkStatus} value={bookData.lawProvisions} onChange={(e)=>this.changeInput(e.target.value,"lawProvisions")} placeholder={"请输入款内容"}/></td>
                    <th>款</th>
                    <td><Input disabled={checkStatus} value={bookData.lawTerm} onChange={(e)=>this.changeInput(e.target.value,"lawTerm")} placeholder={"请输入款内容"}/></td>
                    <th>项</th>
                    <td><Input disabled={checkStatus} value={bookData.lawItem} onChange={(e)=>this.changeInput(e.target.value,"lawItem")} placeholder={"请输入项内容"}/></td>
                </tr>
                <tr>
                    <th>逾期不改依据处罚</th>
                    <td colSpan={7}><Input.TextArea disabled={checkStatus} rows={3} value={bookData.outdataPunishment} onChange={(e)=>this.changeInput(e.target.value,"outdataPunishment")} placeholder={"请输入逾期不改依据处罚"}/></td>
                </tr>
                <tr>
                    <th>改正内容及要求</th>
                    <td colSpan={7}><Input.TextArea disabled={checkStatus} rows={5} value={bookData.correctContent} onChange={(e)=>this.changeInput(e.target.value,"correctContent")} placeholder={"请输入改正内容及要求"}/></td>
                </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                <tr><td style={{height:0,border:0}}/></tr>
                <tr>
                    <th style={{width:80}}>记录日期</th>
                    <td><DatePicker disabled={checkStatus}
                                    defaultValue={bookData.recorderDate==null?null:moment(bookData.recorderDate)}
                                    onChange={(date)=>this.changeInput(date,'recorderDate')}
                                    format="YYYY-MM-DD"
                                    placeholder='记录日期时间' style={{width:'100%'}}/></td>
                    <th style={{width:80}}>责改完成日期<span style={{color:'#FF3300'}}>*</span></th>
                    <td><DatePicker disabled={checkStatus}
                                    defaultValue={bookData.completionDate==null?null:moment(bookData.completionDate)}
                                    onChange={(date)=>this.changeInput(date,'completionDate')}
                                    format="YYYY-MM-DD"
                                    placeholder='责改完成日期' style={{width:'100%'}}/></td>
                </tr>
                <tr>
                    <th>局方联系人</th>
                    <td><Input disabled={checkStatus} value={bookData.contacts} onChange={(e)=>this.changeInput(e.target.value,"contacts")} placeholder={"请输入局方联系人"}/></td>
                    <th>联系电话</th>
                    <td><Input disabled={checkStatus} value={bookData.phoneNumber} onChange={(e)=>this.changeInput(e.target.value,"phoneNumber")} placeholder={"请输入联系电话"}/></td>
                </tr>
                </tbody>
            </table>
        </div>
            <Modal
                width='1000px'
                title="违法类型列表"
                visible={this.state.isVisible}
                footer={null}
                onCancel={()=>{
                    this.setState({
                        isVisible:false
                    })
                }}
            >
                <BookActionForm dispatchLegal={(item)=>{
                    this.setState({isVisible:false})
                    let bookData = this.props.bookData;
                    bookData.behavior=item.activities;
                    bookData.violationRegulations=item.regulations;
                    bookData.accordingLaw=item.accordingLaw;
                    bookData.lawProvisions=item.lawProvisions;
                    bookData.accordingLaw=item.accordingLaw;
                    bookData.lawTerm=item.lawTerm;
                    bookData.lawItem=item.lawItem;
                    bookData.outdataPunishment=item.outdataPunishment;
                    bookData.correctContent=item.content;
                    this.props.dispatchBookData(bookData)}} />
            </Modal>
        </div>);
    }
}