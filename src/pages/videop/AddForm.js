import React,{Component} from 'react';
import { Input, Modal, Icon,Select,Button, Row,Col} from 'antd';
import EnterpriseForm from "../../components/CommonForm/EnterpriseForm";
import NumberInput from "../../components/NumericInput"

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
        console.log(videoInfo)
        const list = this.props.videoInfo.list||[];
        
        return (
            <div className='commonEnterpriseBox'>
                <Row style={{marginTop:10}}>
                    <Col span={2} style={{lineHeight:'32px'}}>企业名称<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={22}><Input value={videoInfo.enterpriseName} onClick={()=>this.setState({isVisible:true})} placeholder="请选择企业" suffix={<Icon type="search"/>}/></Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={2} style={{lineHeight:'32px'}}>设备类型<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={6}>
                        <Select placeholder='请选择设备类型' style={{width:'100%'}} value={videoInfo.type}  onChange={(value)=>this.changeInput(value,'type')}>
                                <Option value={'海康'}>海康</Option>
                                <Option value={'大华'}>大华</Option>
                                </Select>
                    </Col>
                    <Col span={3} style={{lineHeight:'32px',paddingLeft:'16px'}}>视频平台用户</Col>
                    <Col span={5}><Input value={videoInfo.userName}  onChange={(e)=>this.changeInput(e.target.value,'userName')}/></Col>
                    <Col span={3} style={{lineHeight:'32px',paddingLeft:'16px'}}>视频平台密码</Col>
                    <Col span={5}><Input value={videoInfo.userPassword}  onChange={(e)=>this.changeInput(e.target.value,'userPassword')}/></Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={2} style={{lineHeight:'32px',paddingLeft:'9px'}}>HttpIp<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={10}><Input value={videoInfo.httpIp}  onChange={(e)=>this.changeInput(e.target.value,'httpIp')}/></Col>
                    <Col span={2} style={{lineHeight:'32px',paddingLeft:'9px'}}>Http端口<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={10}><Input value={videoInfo.httpPort}  onChange={(e)=>this.changeInput(e.target.value,'httpPort')}/></Col>
                </Row>
                <Row style={{marginTop:10,display:videoInfo.type=='海康'?"block":"none"}}>
                    <Col span={2} style={{lineHeight:'32px',paddingLeft:'9px'}}>RtmpIp<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={10}><Input value={videoInfo.rtmpIp}  onChange={(e)=>this.changeInput(e.target.value,'rtmpIp')}/></Col>
                    <Col span={2} style={{lineHeight:'32px',paddingLeft:'9px'}}>Rtmp端口<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={10}><Input value={videoInfo.rtmpPort}  onChange={(e)=>this.changeInput(e.target.value,'rtmpPort')}/></Col>
                </Row>
                <Row style={{marginTop:10,display:videoInfo.type=='海康'?"block":"none"}}>
                    <Col span={2} style={{lineHeight:'32px',paddingLeft:'9px'}}>VagIp<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={10}><Input value={videoInfo.vagIp}  onChange={(e)=>this.changeInput(e.target.value,'vagIp')}/></Col>
                    <Col span={2} style={{lineHeight:'32px',paddingLeft:'9px'}}>Vag端口<span style={{color:'#FF3300'}}>*</span></Col>
                    <Col span={10}><Input value={videoInfo.vagPort}  onChange={(e)=>this.changeInput(e.target.value,'vagPort')}/></Col>
                </Row>
           
                    <div  style={{fontSize:16,marginTop:10,marginBottom:5,width:100,height:25,backgroundColor:'#EFEFEF',border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>设备信息</div>
    <div className='commonEnterpriseBox'>
            <table>
            <tbody>
            <tr>
                <th>序号<span style={{color:'#FF3300'}}>*</span></th>
                <th>视频监控点名称<span style={{color:'#FF3300'}}>*</span></th>
                <th>设备编号<span style={{color:'#FF3300'}}>*</span></th>
                <th>通道号<span style={{color:'#FF3300'}}>*</span></th>
                <th>码流类型<span style={{color:'#FF3300'}}>*</span></th>
            </tr>
                {list.map((item,index)=>(
                    <tr>
                        <td style={{width:100}}><NumberInput value={item.seq} onChange={(value)=>this.changeListValue(value,'seq',index)}/></td>
                        <td style={{width:300}}><Input value={item.position} onChange={(e)=>this.changeListValue(e.target.value,'position',index)}/></td>
                        <td style={{width:300}}><Input value={item.number} onChange={(e)=>this.changeListValue(e.target.value,'number',index)}/></td>
                        <td><Select style={{width:150}} value={item.channelNumber} onChange={(value)=>this.changeListValue(value,'channelNumber',index)}>
                            <Option value={'0'}>通道一</Option>
                            <Option value={'1'}>通道二</Option>
                            <Option value={'2'}>通道三</Option>
                            <Option value={'3'}>通道四</Option>
                            <Option value={'4'}>通道五</Option>
                            <Option value={'5'}>通道六</Option>
                            <Option value={'6'}>通道七</Option>
                            <Option value={'7'}>通道八</Option>
                            <Option value={'8'}>通道九</Option>
                            <Option value={'9'}>通道十</Option>
                            
                            </Select></td>
                        <td><Select style={{width:150}} value={item.byteType}  onChange={(value)=>this.changeListValue(value,'byteType',index)}>
                            <Option value={'1'}>主码流</Option>
                            <Option value={'2'}>辅码流</Option>
                            </Select></td>
                    
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