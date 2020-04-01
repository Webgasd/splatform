import React,{Component} from 'react';
import { Row, Col ,Input, Modal, Icon,Select,Button,DatePicker} from 'antd';
import EnterpriseForm from "../../components/CommonForm/EnterpriseForm";
import moment from 'moment';
import {commonUrl} from '../../axios/commonSrc'

const { TextArea } = Input;
const Option=Select.Option;

 class DealForm extends Component{
    state = {}
    changeInput=(value,option)=>{
        let data=this.props.videoInfo;
        data[option]=value;
        this.props.dispatchVideoData(data);
    }
    render(){
        
        const videoInfo = this.props.videoInfo || {};
       
        console.log(videoInfo)
        return (
            
            <div className='commonEnterpriseBox'>
                <Row>
                    <Col span={24}>
                    <table>
                        <tbody>
                        <tr>
                            <td style={{background:'#F2F2F2'}}>企业名称</td>
                            <td><Input value={videoInfo.enterpriseName} disabled/></td>
                            <td style={{background:'#F2F2F2'}}>社会信用代码</td>
                            <td><Input value={videoInfo.permissionId} disabled/></td>
                        </tr>
                        <tr>
                            <td style={{background:'#F2F2F2'}}>企业地址</td>
                            <td colspan={10}><Input value={videoInfo.address} disabled/></td>
                        </tr>
                        <tr>
                            <td style={{background:'#F2F2F2'}}>所在区域</td>
                            <td><Input value={videoInfo.areaName} disabled/></td>
                            <td style={{background:'#F2F2F2'}}>法人</td>
                            <td><Input value={videoInfo.charger} disabled/></td>
                            <td style={{background:'#F2F2F2'}}>负责人</td>
                            <td><Input value={videoInfo.charger} disabled/></td>
                            
                        </tr>
                        <tr>
                            <td style={{background:'#F2F2F2'}}>巡查违规等级</td>
                            <td><Input value={videoInfo.level} disabled/></td>
                            <td style={{background:'#F2F2F2'}}>巡查时间</td>
                            <td><DatePicker disabled style={{width:'100%'}}
                                        value={videoInfo.recordTime=moment(videoInfo.recordTime)}
                                        format="YYYY-MM-DD HH:mm:ss"/></td>
                            <td style={{background:'#F2F2F2'}}>本年度违规次数</td>
                            <td><Input value={videoInfo.recordCount} disabled/></td>
                        </tr>
                        </tbody>
                    </table>
                    </Col>
                    </Row>
                    <div  style={{fontSize:16,marginTop:5,width:100,height:25,border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>执法取证照片</div>
                    <div className='commonEnterpriseBox'>
                        <Row>
                        <Col span={12}>
                        <div style={{width:360,height:220}}>
                        <img src={commonUrl+'/upload/cut/'+videoInfo.recordPicture1} height={220} width={360}/>
                        </div>
                        </Col>
                        <Col span={12}>
                        <div style={{width:360,height:220}}>
                        <img src={commonUrl+'/upload/cut/'+videoInfo.recordPicture2} height={220} width={360}/>
                        </div></Col>
                        </Row>
                    </div>
                    <div style={{fontSize:16,marginTop:5,width:100,height:25,border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>巡查记录</div>
                    <Row>
                    <Col span={24}>
                    <table>
                        <tbody>
                            <tr>
                            <td colspan={1} style={{background:'#F2F2F2'}}>巡查记录</td>
                            <td colspan={10} ><Input value={videoInfo.recordContent} style={{height:100}} disabled/></td>
                            </tr>
                            <tr>
                            <td style={{background:'#F2F2F2'}}>记录人</td>
                            <td><Input value={videoInfo.recordPerson} disabled/></td>
                            <td style={{background:'#F2F2F2'}}>记录时间</td>
                            <td><DatePicker disabled style={{width:'100%'}}
                                        value={videoInfo.recordTime=moment(videoInfo.recordTime)}
                                        format="YYYY-MM-DD HH:mm:ss"/></td>
                            </tr>
                        </tbody>
                    </table></Col></Row>
                    <div style={{fontSize:16,marginTop:5,width:100,height:25,border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>处理意见</div>
                    <Row>
                    <Col span={24}>
                    <table>
                        <tbody>
                            <tr>
                            <td colspan={1} style={{background:'#F2F2F2'}}>处理意见<span style={{color:'#FF3300'}}>*</span></td>
                            <td colspan={10} ><TextArea style={{height:100}} onChange={(e)=>this.changeInput(e.target.value,'handleContent')}/></td>
                            </tr>
                            <tr>
                            <td style={{background:'#F2F2F2'}}>处理人</td>
                            <td><Input value={videoInfo.handlePersonName} disabled/></td>
                            <td style={{background:'#F2F2F2'}}>处理时间<span style={{color:'#FF3300'}}>*</span></td>
                            <td><DatePicker style={{width:'100%'}}  showTime placeholder="请选择时间" onChange={(value)=>this.changeInput(value,"handleTime")}/></td>
                            </tr>
                        </tbody>
                    </table></Col></Row>
                    </div>
        );
    }
}
export default DealForm