import React,{Component} from 'react';
import { Input, Modal, Icon,Select,Button, Row,Col} from 'antd';
import EnterpriseForm from "../../../components/CommonForm/EnterpriseForm";
import NumberInput from "../../../components/NumericInput"

const Option=Select.Option;

 class AddForm extends Component{
    state = {}
    handlePlus=()=>{
        let data = this.props.videoInfo;
        let list=data.list||[];
        list.push({})
        data.list=list;
        this.props.dispatchVideoData(data);
    }
    handleMinus=()=>{
        let data = this.props.videoInfo;
        let list=data.list||[];
        list.pop();
        data.list=list;
        this.props.dispatchVideoData(data);
    }
    changeListValue=(value,option,index)=>{
        let data = this.props.videoInfo;
        let list=data.list||[];
        list[index][option]=value;
        data.list=list;
        this.props.dispatchVideoData(data);
    }
    changeInput=(value,option)=>{
        let data=this.props.videoInfo;
        data[option]=value;
        this.props.dispatchVideoData(data);
    }
    render(){

        const videoInfo = this.props.videoInfo || {};
        const list = this.props.videoInfo.list||[];
        
        return (
            <div className='commonEnterpriseBox'>
                <Row style={{marginTop:10}}>
                    <Col span={2} style={{lineHeight:'32px'}}>企业名称<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={22}><Input value={videoInfo.enterpriseName} onClick={()=>this.setState({isVisible:true})} placeholder="请选择企业" suffix={<Icon type="search"/>}/></Col>
                </Row>
                <div  style={{fontSize:16,marginTop:10,marginBottom:5,width:100,height:25,backgroundColor:'#EFEFEF',border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>设备信息</div>
                <div className='commonEnterpriseBox'>
                    <table>
                        <tbody>
                        <tr>
                            <th>序号<span style={{color:'#FF3300'}}>*</span></th>
                            <th>监控点名称<span style={{color:'#FF3300'}}>*</span></th>
                            <th>监控点索引<span style={{color:'#FF3300'}}>*</span></th>
                            <th>码流类型<span style={{color:'#FF3300'}}>*</span></th>
                            <th>取流协议<span style={{color:'#FF3300'}}>*</span></th>
                            <th>传输协议<span style={{color:'#FF3300'}}>*</span></th>
                        </tr>
                            {list.map((item,index)=>(
                                <tr>
                                    <td><NumberInput value={item.seq} onChange={(value)=>this.changeListValue(value,'seq',index)}/></td>
                                    <td><Input value={item.position} onChange={(e)=>this.changeListValue(e.target.value,'position',index)}/></td>
                                    <td><Input value={item.cameraIndexCode} onChange={(e)=>this.changeListValue(e.target.value,'cameraIndexCode',index)}/></td>
                                    <td><Select style={{width:150}} value={item.streamType} onChange={(value)=>this.changeListValue(value,'streamType',index)}>
                                            <Option value={0}>主码流</Option>
                                            <Option value={1}>子码流</Option>
                                            <Option value={2}>第三码流</Option>
                                            </Select>
                                    </td>
                                    <td><Select style={{width:150}} value={item.protocol} onChange={(value)=>this.changeListValue(value,'protocol',index)}>
                                            <Option value={'rtsp'}>RTSP</Option>
                                            <Option value={'rtmp'}>RTMP</Option>
                                            <Option value={'hls'}>HLS</Option>
                                            </Select>
                                    </td>
                                    <td><Select style={{width:150}} value={item.transmode} onChange={(value)=>this.changeListValue(value,'transmode',index)}>
                                            <Option value={0}>UDP</Option>
                                            <Option value={1}>TCP</Option>
                                            </Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                <div style={{marginTop:10}}>
                    <Button type="primary"  icon='plus' onClick={this.handlePlus.bind(this)}/>
                    <Button type="primary" style={{marginLeft:5}}  icon='minus' onClick={this.handleMinus.bind(this)}/>
                </div>
                </div>
                    <Modal
                            width='700px'
                            title="企业信息"
                            visible={this.state.isVisible}
                            footer={null}
                            onCancel={()=>{
                                this.setState({
                                    isVisible:false
                                })
                            }}
                        >
                            <EnterpriseForm
                                dispatchEnterprise={(item)=> {
                                    let data = this.props.videoInfo;
                                    data.enterpriseId=item.id;
                                    data.enterpriseName=item.enterpriseName;
                                    this.props.dispatchVideoData(data);
                                    this.setState({
                                        isVisible:false,
                                    })
                                }}/>
                        </Modal>
            </div>
        );
    }
}
export default AddForm