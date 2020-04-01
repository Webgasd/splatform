import React,{ Component } from 'react';
import {Select,Input} from "antd";
const Option = Select.Option;

export default class AddForm extends Component{
    state={}

    changeInput =(value,option)=>{
        let data = this.props.legalInfo;
        data[option] = value;
        this.props.dispatchLegalData(data);
    }
    render() {
        const legalInfo = this.props.legalInfo;
        const legalList = this.props.legalList;
        const checkStatus = this.props.type=='detail'?true:false;
        return (<div>
            <div className='commonEnterpriseBox'>
                <table>
                    <tbody>
                    <tr>
                        <th>违法类型</th>
                        <td colSpan={7} style={{textAlign:'left'}}><Select style={{width:200}} value={legalInfo.typeId} onChange={(value)=>this.changeInput(value,"typeId")} disabled={checkStatus} placeholder={'请选择违法类型'}>
                            <Option value={null}>请选择违法类型</Option>
                            {legalList.map((item)=><Option value={item.id}>{item.name}</Option>)}
                        </Select></td>
                    </tr>
                    <tr>
                        <th>违法行为</th>
                        <td colSpan={7}><Input.TextArea rows={3} value={legalInfo.activities} onChange={(e)=>this.changeInput(e.target.value,"activities")} disabled={checkStatus} placeholder={'请输入违法行为'}/></td>
                    </tr>
                    <tr>
                        <th>违反规定</th>
                        <td colSpan={7}><Input value={legalInfo.regulations} onChange={(e)=>this.changeInput(e.target.value,"regulations")} disabled={checkStatus} placeholder={'请输入违法规定'}/></td>
                    </tr>
                    <tr>
                        <th rowSpan={2}>处罚条款</th>
                        <td style={{width:0,border:0,padding:2}} rowSpan={2}/>
                        <th>法规</th>
                        <td colSpan={5}><Input value={legalInfo.accordingLaw} onChange={(e)=>this.changeInput(e.target.value,"accordingLaw")} disabled={checkStatus} placeholder={'请输入法规'}/></td>
                    </tr>
                    <tr>
                        <th>法规(条)</th>
                        <td><Input value={legalInfo.lawProvisions} onChange={(e)=>this.changeInput(e.target.value,"lawProvisions")} disabled={checkStatus} placeholder={'请输入法规(条)'}/></td>
                        <th>法规(款)</th>
                        <td><Input value={legalInfo.lawTerm} onChange={(e)=>this.changeInput(e.target.value,"lawTerm")} disabled={checkStatus} placeholder={'请输入法规(款)'}/></td>
                        <th>法规(项)</th>
                        <td><Input value={legalInfo.lawItem} onChange={(e)=>this.changeInput(e.target.value,"lawItem")} disabled={checkStatus} placeholder={'请输入法规(项)'}/></td>
                    </tr>
                    <tr>
                        <th>处罚标准</th>
                        <td colSpan={7}><Input.TextArea rows={3} value={legalInfo.outdataPunishment} onChange={(e)=>this.changeInput(e.target.value,"outdataPunishment")} disabled={checkStatus} placeholder={'请输入处罚标准'}/></td>
                    </tr>
                    <tr>
                        <th>改正内容</th>
                        <td colSpan={7}><Input.TextArea rows={3} value={legalInfo.content} onChange={(e)=>this.changeInput(e.target.value,"content")} disabled={checkStatus} placeholder={'请输入处罚标准'}/></td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td colSpan={7}><Input.TextArea rows={3} value={legalInfo.remark} onChange={(e)=>this.changeInput(e.target.value,"remark")} disabled={checkStatus} placeholder={'请输入备注'}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>);
    }
}