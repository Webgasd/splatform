import React,{ Component } from 'react';
import {Icon, Input,Modal} from "antd";
import BookCheckForm from './bookCheckForm';


export default class AssistSeizureForm extends Component{
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
            <div className='commonInspectBoxHeadBottom'>协助扣押通知书</div>
            <div className='commonInspectBox'>
                <table>
                    <tbody>
                    <tr>
                        <th style={{width:80,color:'#ffffff',background:'#0499CC'}}>协助扣押号</th>
                        <td colSpan={4}><Input disabled={checkStatus} value={bookData.assistNumber} onChange={(e)=>this.changeInput(e.target.value,"assistNumber")} placeholder='请输入协助扣押号'/></td>
                    </tr>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th style={{width:100}} rowSpan={2}>当事人信息</th>
                        <td style={{width:0,border:0,padding:1}} rowSpan={2}/>
                        <th style={{width:100}}>当事人<span style={{color:'#FF3300'}}>*</span></th>
                        <td colSpan={2}><Input disabled={checkStatus} value={bookData.concernedPerson} onChange={(e)=>this.changeInput(e.target.value,"concernedPerson")} placeholder='请输入当事人'/></td>
                    </tr>
                    <tr>
                        <th>经营地址</th>
                        <td colSpan={2}><Input disabled={checkStatus} value={bookData.businessAddress} onChange={(e)=>this.changeInput(e.target.value,"businessAddress")} placeholder='请输入经营地址'/></td>
                    </tr>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th>案由</th>
                        <td colSpan={4}><Input disabled={checkStatus} value={bookData.actionCause} onChange={(e)=>this.changeInput(e.target.value,"actionCause")} placeholder='请输入案由'/></td>
                    </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th style={{width:100}} rowSpan={2}>附件</th>
                        <td style={{width:0,border:0,padding:1}} rowSpan={2}/>
                        <th style={{width:200}}>《实施行政强制措施决定书》文号</th>
                        <td colSpan={2}><Input disabled={checkStatus} value={bookData.desicionFileNumber} onChange={(e)=>this.changeInput(e.target.value,"desicionFileNumber")} placeholder='《实施行政强制措施决定书》文号' suffix={<Icon onClick={()=>this.setState({isVisible:true,typeUrl:'/compulsoryMeasure'})} type="search" />}/></td>
                    </tr>
                    <tr>
                        <th>《场所/设施/财务清单》文书编号</th>
                        <td colSpan={2}><Input disabled={checkStatus} value={bookData.listFileNumber} onChange={(e)=>this.changeInput(e.target.value,"listFileNumber")} placeholder='《场所/设施/财务清单》文书编号' suffix={<Icon onClick={()=>this.setState({isVisible:true,typeUrl:'/detailList'})} type="search" />}/></td>
                    </tr>
                    <tr><td style={{height:0,border:0}}/></tr>
                    <tr>
                        <th>联系人</th>
                        <td colSpan={2}><Input disabled={checkStatus} value={bookData.contactPerson} onChange={(e)=>this.changeInput(e.target.value,"contactPerson")} placeholder='联系人'/></td>
                        <th>联系电话</th>
                        <td><Input disabled={checkStatus} value={bookData.contactPhone} onChange={(e)=>this.changeInput(e.target.value,"contactPhone")} placeholder='联系电话'/></td>
                    </tr>
                    </tbody>
                </table>
                <Modal
                    width='600px'
                    title="文书列表"
                    visible={this.state.isVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}>
                    <BookCheckForm
                        dailyFoodId={(this.props.inspectData||{}).id}
                        typeUrl={this.state.typeUrl}
                        dispatchCheck={(item)=>{
                                 if(this.state.typeUrl=='/compulsoryMeasure') {
                                     this.changeInput(item.name,"desicionFileNumber")
                                 } else if(this.state.typeUrl=='/detailList') {
                                     this.changeInput(item.name,"listFileNumber")
                                 }
                            this.setState({
                                isVisible:false
                            })
                        }}/>
                </Modal>
            </div>
            </div>
        );
    }
}