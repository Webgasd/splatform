import React,{ Component } from 'react';
import {Input,DatePicker,Select} from "antd";
import moment from "moment";
const Option = Select.Option;


export default class ReceivingServiceForm extends Component{
    changeInput =(value,option)=>{
        let data = this.props.bookData;
        data[option] = value;
        this.props.dispatchBookData(data);
    }
    render() {
        const bookData=this.props.bookData;
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div>
            <div className='commonInspectBoxHeadTop'><div className='commonInspectTopText'>行政处罚文书</div></div>
            <div className='commonInspectBoxHeadBottom'>送达回证</div>
            <div className='commonInspectBox'>
                <table>
                    <tbody>
                    <tr>
                        <th style={{width:80,color:'#ffffff',background:'#0499CC'}}>送达文书名称及文号</th>
                        <td colSpan={5}><Input disabled={checkStatus} value={bookData.arriveFile} onChange={(e)=>this.changeInput(e.target.value,"arriveFile")} placeholder='请输入送达文书名称及文号'/></td>
                    </tr>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th>受送达人<span style={{color:'#FF3300'}}>*</span></th>
                        <td><Input disabled={checkStatus} value={bookData.arrivePerson} onChange={(e)=>this.changeInput(e.target.value,"arrivePerson")} placeholder='请输入受送达人'/></td>
                        <th style={{width:80}}>送达时间</th>
                        <td><DatePicker disabled={checkStatus}
                                        defaultValue={bookData.arriveDate==null?null:moment(bookData.arriveDate)}
                                        onChange={(date)=>this.changeInput(date,'arriveDate')}
                                        format="YYYY-MM-DD"
                                        placeholder='请选择送达时间' style={{width:'100%'}}/></td>
                        <th style={{width:80}}>送达方式</th>
                        <td><Select disabled={checkStatus} value={bookData.arriveWay} onChange={(value)=>this.changeInput(value,"arriveWay")} placeholder='请选择送达方式' style={{width:150}}>
                            <Option value='直接送达'>直接送达</Option>
                            <Option value='公告送达'>公告送达</Option>
                            <Option value='留置送达'>留置送达</Option>
                            <Option value='委托送达'>委托送达</Option>
                            <Option value='邮寄送达'>邮寄送达</Option>
                        </Select></td>
                    </tr>
                    <tr>
                        <th>送达地点</th>
                        <td colSpan={5}><Input disabled={checkStatus} value={bookData.arriveAddress} onChange={(e)=>this.changeInput(e.target.value,"arriveAddress")} placeholder='请输入送达地点'/></td>
                    </tr>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th>备注</th>
                        <td colSpan={5}><Input.TextArea disabled={checkStatus} value={bookData.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")} rows={3} placeholder='请输入备注'/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            </div>
        );
    }
}