import React,{ Component } from 'react';
import {Icon, Input, DatePicker, Modal} from 'antd';
import moment from "moment";
import BookActionForm from "./bookActionForm";
import BookCheckForm from "./bookCheckForm";


export default class compulsoryMeasureForm extends Component{
    state={}
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
            <div className='commonInspectBoxHeadBottom'>实施行政强制措施决策书</div>
            <div className='commonInspectBox'>
                <table>
                    <tbody>
                    <tr>
                        <th  style={{width:100,color:'#ffffff',background:'#0499CC'}}>强制措施号</th>
                        <td colSpan={5}><Input disabled={checkStatus} value={bookData.forceNumber} onChange={(e)=>this.changeInput(e.target.value,"forceNumber")} placeholder={'请输入强制措施号'}/></td>
                    </tr>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th rowSpan={4}>当事人信息</th>
                        <td style={{width:0,border:0,padding:2}} rowSpan={4}/>
                        <th style={{width:100}}>当事人<span style={{color:'#FF3300'}}>*</span></th>
                        <td><Input disabled={checkStatus} value={bookData.concernedPerson} onChange={(e)=>this.changeInput(e.target.value,"concernedPerson")} placeholder={'请输入当事人'}/></td>
                        <th style={{width:100}}>主体资格照名称</th>
                        <td><Input disabled={checkStatus} value={bookData.mainQualification} onChange={(e)=>this.changeInput(e.target.value,"mainQualification")} placeholder={'请输入主体资格照名称'}/></td>
                    </tr>
                    <tr>
                        <th>统一社会信用代码(注册号)</th>
                        <td><Input disabled={checkStatus} value={bookData.registrationNumber} onChange={(e)=>this.changeInput(e.target.value,"registrationNumber")} placeholder={'请输入统一社会信用代码(注册号)'}/></td>
                        <th>住所(住址)</th>
                        <td><Input disabled={checkStatus} value={bookData.address} onChange={(e)=>this.changeInput(e.target.value,"address")} placeholder={'请输入住所(住址)'}/></td>
                    </tr>
                    <tr>
                        <th>法定代表人/负责人</th>
                        <td><Input disabled={checkStatus} value={bookData.header} onChange={(e)=>this.changeInput(e.target.value,"header")} placeholder={'请输入法定代表人/负责人'}/></td>
                        <th>身份证号</th>
                        <td><Input disabled={checkStatus} value={bookData.idNumber} onChange={(e)=>this.changeInput(e.target.value,"idNumber")} placeholder={'请输入身份证号'}/></td>
                    </tr>
                    <tr>
                        <th>联系电话</th>
                        <td><Input disabled={checkStatus} value={bookData.phoneNumber} onChange={(e)=>this.changeInput(e.target.value,"phoneNumber")} placeholder={'请输入联系电话'}/></td>
                        <th>其他联系方式</th>
                        <td><Input disabled={checkStatus} value={bookData.ortherContact} onChange={(e)=>this.changeInput(e.target.value,"ortherContact")} placeholder={'请输入其他联系方式'}/></td>
                    </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th style={{width:100}}>行为<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={7}><Input disabled={checkStatus} value={bookData.behavior} onChange={(e)=>this.changeInput(e.target.value,"behavior")} placeholder={'请选择行为'} suffix={<Icon onClick={()=>this.setState({isVisible:true})} type="search" />}/></td>
                    </tr>
                    <tr>
                        <th>违反规定</th>
                        <td colSpan={7}><Input disabled={checkStatus} value={bookData.violationRegulations} onChange={(e)=>this.changeInput(e.target.value,"violationRegulations")} placeholder={'请输入违反规定'}/></td>
                    </tr>
                    <tr>
                        <th>依据法规</th>
                        <td><Input disabled={checkStatus} value={bookData.accordingLaw} onChange={(e)=>this.changeInput(e.target.value,"accordingLaw")} placeholder={'请输入法规'}/></td>
                        <th>条</th>
                        <td><Input disabled={checkStatus} value={bookData.lawProvisions} onChange={(e)=>this.changeInput(e.target.value,"lawProvisions")} placeholder={'请输入条内容'}/></td>
                        <th>款</th>
                        <td><Input disabled={checkStatus} value={bookData.lawTerm} onChange={(e)=>this.changeInput(e.target.value,"lawTerm")} placeholder={'请输入款内容'}/></td>
                        <th>项</th>
                        <td><Input disabled={checkStatus} value={bookData.lawItem} onChange={(e)=>this.changeInput(e.target.value,"lawItem")} placeholder={'请输入项内容'}/></td>
                    </tr>
                    <tr>
                        <th>《场所/设备/财务清单》文书编号<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={3}><Input disabled={checkStatus} value={bookData.fileNumber} onChange={(e)=>this.changeInput(e.target.value,"fileNumber")} placeholder={'请输入《场所/设备/财务清单》文书编号'} suffix={<Icon onClick={()=>this.setState({isCheckVisible:true})} type="search" />}/></td>
                        <th>实施行政强制措施</th>
                        <td colSpan={3}><Input disabled={checkStatus} value={bookData.forceMeasure} onChange={(e)=>this.changeInput(e.target.value,"forceMeasure")} placeholder={'请输入实施行政强制措施'}/></td>
                    </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th style={{width:100}}>实施行政强制措施的场所/设施/财务地点<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={4}><Input disabled={checkStatus} value={bookData.forceMeasureAddress} onChange={(e)=>this.changeInput(e.target.value,"forceMeasureAddress")} placeholder={'请输入实施行政强制措施的场所/设施/财务地点'}/></td>
                    </tr>
                    <tr>
                        <th>实施强制措施期限<span style={{color:'#FF3300'}}>*</span></th>
                        <td style={{borderRight:0}}><Input disabled={checkStatus} value={bookData.forceDate} onChange={(e)=>this.changeInput(e.target.value,"forceDate")} placeholder={'请输入天数'}/></td>
                        <td  style={{borderLeft:0}}>日</td>
                        <th style={{width:100}}>物品保存条件</th>
                        <td><Input disabled={checkStatus} value={bookData.saveCondition} onChange={(e)=>this.changeInput(e.target.value,"saveCondition")} placeholder={'请输入物品保存条件'}/></td>
                    </tr>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th>申请行政复议<span style={{color:'#FF3300'}}>*</span></th>
                        <td style={{borderRight:0}}><Input disabled={checkStatus} value={bookData.applyReconsideration} onChange={(e)=>this.changeInput(e.target.value,"applyReconsideration")} placeholder={'请输入天数'}/></td>
                        <td style={{borderLeft:0}}>日内</td>
                        <th>复议单位</th>
                        <td><Input disabled={checkStatus} value={bookData.reconsiderationDepartment} onChange={(e)=>this.changeInput(e.target.value,"reconsiderationDepartment")} placeholder={'请输入请输入复议单位'}/></td>
                    </tr>
                    <tr>
                        <th>提起行政诉讼<span style={{color:'#FF3300'}}>*</span></th>
                        <td style={{borderRight:0}}><DatePicker disabled={checkStatus}
                                                                defaultValue={bookData.applyLitigation==null?null:moment(bookData.applyLitigation)}
                                                                onChange={(date)=>this.changeInput(date,'applyLitigation')}
                                                                format="YYYY-MM-DD"
                                                                placeholder='提起行政诉讼时间' style={{width:'100%'}}/></td>
                        <td  style={{borderLeft:0}}>内</td>
                        <th>诉讼单位</th>
                        <td><Input disabled={checkStatus} value={bookData.litigationDepartment} onChange={(e)=>this.changeInput(e.target.value,"litigationDepartment")} placeholder={'请输入诉讼单位'}/></td>
                    </tr>
                    <tr>
                        <th>联系人</th>
                        <td colSpan={2}><Input disabled={checkStatus} value={bookData.contectPerson} onChange={(e)=>this.changeInput(e.target.value,"contectPerson")} placeholder={'请输入联系人'}/></td>
                        <th>联系电话</th>
                        <td><Input disabled={checkStatus} value={bookData.contectPhone} onChange={(e)=>this.changeInput(e.target.value,"contectPhone")} placeholder={'请输入联系电话'}/></td>
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
                        this.props.dispatchBookData(bookData)}} />
                </Modal>
                <Modal
                    width='600px'
                    title="文书列表"
                    visible={this.state.isCheckVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isCheckVisible:false
                        })
                    }}>
                    <BookCheckForm
                        dailyFoodId={(this.props.inspectData||{}).id}
                        typeUrl='/detailList'
                        dispatchCheck={(item)=>{
                            this.changeInput(item.name,"fileNumber")
                            this.setState({
                                isCheckVisible:false
                            })
                        }}/>
                </Modal>

            </div>
        );
    }
}