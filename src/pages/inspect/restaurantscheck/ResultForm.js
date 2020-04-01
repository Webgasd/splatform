import React,{Component} from 'react';
import {Icon, Input, Modal} from 'antd';
import {commonUrl} from "../../../axios/commonSrc";
import SignConfForm from "./bookConfig/signConfForm";

class PointForm extends Component {
    state={}
    changeInput=(value,option)=>{
        let data = this.props.inspectData||{};
        data[option] = value
        this.props.dispatchInspectData(data);
    }
    render() {
        const formData=this.props.inspectData||{};
        const checkStatus = this.props.type=='detail'?true:false;
        return(
            <div className='commonEnterpriseBox' style={{marginTop:30}}>
                <div className='permission-title-text' style={{width:135}}>检查结果信息</div>
                    <div style={{margin:'20px 10px 0 10px'}}>
                        <table>
                            <tbody>
                            <tr>
                                <th>检查结果</th>
                                <td><Input value={formData.checkResult} disabled={true} placeholder='自动生成'/></td>
                                <th>结果处理</th>
                                <td><Input value={formData.resultProcess} disabled={true} placeholder='自动生成'/></td>
                            </tr>
                            <tr>
                                <th>发现问题</th>
                                <td colSpan={3}><Input.TextArea disabled={checkStatus} rows={5} value={formData.problem} onChange={(e)=>this.changeInput(e.target.value,"problem")}/></td>
                            </tr>
                            <tr>
                                <th>检查说明</th>
                                <td colSpan={3}><Input.TextArea disabled={checkStatus} rows={5} value={formData.disposalMeasures} onChange={(e)=>this.changeInput(e.target.value,"disposalMeasures")}/></td>
                            </tr>
                            <tr>
                                <th style={{width:80}}>记录人核验第一执法人</th>
                                <td ><div className='signBox' onClick={checkStatus?null:()=>this.setState({isSignVisible:true,signPerson:1})}>
                                    <div className='signBoxLeft'><Icon type='lock'/>签字调取</div>
                                    <div className='signBoxRight'><div className='signBoxRightContent'>
                                        {formData.firstEnforcer?<img src={commonUrl+"/upload/picture/" +formData.firstEnforcer} style={{height:50}} alt="avatar" />:null}
                                    </div></div>
                                </div></td>
                                <th style={{width:80}}>第二执法人</th>
                                <td ><div className='signBox'  onClick={checkStatus?null:()=>this.setState({isSignVisible:true,signPerson:2})}>
                                    <div className='signBoxLeft'><Icon type='lock'/>签字调取</div>
                                    <div className='signBoxRight'><div className='signBoxRightContent'>
                                        {formData.secondEnforcer?<img src={commonUrl+"/upload/picture/" +formData.secondEnforcer} style={{height:50}} alt="avatar" />:null}
                                    </div></div>
                                </div></td>
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
                                signGaId={formData.supervisorId||''}
                                dispatchSign={(item)=>{
                                this.setState({isSignVisible:false})
                                let bookData = this.props.inspectData;
                                let picture = JSON.parse(item.pic||JSON.stringify([]))
                                if(this.state.signPerson==1){
                                    bookData.firstEnforcer=((((picture||[])[0]||{}).response)||{}).data;
                                }else if(this.state.signPerson==2){
                                    bookData.secondEnforcer=((((picture||[])[0]||{}).response)||{}).data;
                                }
                                this.props.dispatchInspectData(bookData)}}/>
                        </Modal>
                    </div>
                </div>);
    }
}
export default PointForm;