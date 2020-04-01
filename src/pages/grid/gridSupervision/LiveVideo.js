import React,{ Component } from 'react';
import { Row, Col ,Input, Button,Select,Radio,Modal, DatePicker} from 'antd';
import moment from 'moment';
import connect from "react-redux/es/connect/connect";
import axios from "../../../axios";
import Add from "../../supervision/enterprise/Add"
import videojs from 'video.js';
import './myVideo.less';
import {unitName} from "../../../axios/commonSrc"
import CheckData from '../../video/img/check_data.png';
import BasicFile from '../../video/img/basic_file.png';
import PeopleFile from '../../video/img/people_file.png';
import Patrol from '../../video/img/patrol.png';
import {changeEnterprise, clearEnterprise} from "../../../redux/action";
import 'videojs-flash';  //如果要播放RTMP要使用flash 需要先npm i videojs-flash
import 'video.js/dist/video-js.css';
import InstructList from "../../interaction/InstructList";
import EmployeeList from '../../video/enterpriseWorkerList'
import EnterpriseRecords from '../../video/enterpriseRecord'
import {commonUrl} from '../../../axios/commonSrc'

const Option=Select.Option;
const { TextArea } = Input;

@connect(
    state=>({
        industryList:state.industryList,
         recordPerson:state.userName
    }),{
        clearEnterprise,
        changeEnterprise,
    }
)
 class LiveVideo extends Component{
     state={
        enterpriseId:0,
         workerModalVisible:false,
         recordModalVisible:false,
        id:0,
        cutUrl: this.props.videoInfo&&this.props.videoInfo.type == '海康'?`rtmp://${this.props.videoInfo.rtmpIp}:${this.props.videoInfo.rtmpPort}/live/pag/${this.props.videoInfo.vagIp}/${this.props.videoInfo.vagPort}/${this.props.videoInfo.list[0].number}/0/MAIN/TCP`:
        `http://${this.props.videoInfo.httpIp}:${this.props.videoInfo.httpPort}/live/cameraid/${this.props.videoInfo.list[0].number}%24${this.props.videoInfo.list[0].channelNumber}/substream/${this.props.videoInfo.list[0].byteType}.m3u8`
     }
     componentDidMount() {
         if (unitName == "历下区" || unitName == "泰山区") {
             const {httpIp,httpPort,rtmpIp,rtmpPort,vagIp,vagPort,type} = this.props.videoInfo
             const list = this.props.videoInfo.list||[];
             let options ={
                 autoplay: true,  //自动播放
                 // language: 'zh-CN',
                 controls: true,  //控制条
                 preload: 'auto',  //自动加载
                 errorDisplay: true,  //错误展示
                 // fluid: true,  //跟随外层容器变化大小，跟随的是外层宽度
                 // controlBar: false,  // 设为false不渲染控制条DOM元素，只设置controls为false虽然不展示，但还是存在
                 // textTrackDisplay: false,  // 不渲染字幕相关DOM
                 userActions: {
                     hotkeys: true  //是否支持热键
                 },
                 sources: [
                     {
                         src: type == '海康'?`rtmp://${rtmpIp}:${rtmpPort}/live/pag/${vagIp}/${vagPort}/${list[0].number}/0/MAIN/TCP`:
                             `http://${httpIp}:${httpPort}/live/cameraid/${list[0].number}%24${list[0].channelNumber}/substream/${list[0].byteType}.m3u8`

                         // src: `rtmp://${rtmpIp}:${rtmpPort}/live/pag/${vagIp}/${vagPort}/${list[0].number}/0/MAIN/TCP`,
                         // src: `http://${httpIp}:${httpPort}/live/cameraid/${list[0].number}%24${list[0].channelNumber}/substream/${list[0].byteType}.m3u8`
                         // type: "rtmp/flv",  //类型可加可不加，目前未看到影响
                         // type: 'video/mp4',
                     }
                 ]
             }
             this.player = videojs('my-video', options, function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
                 videojs.log('Your player is ready!');
                 // In this context, `this` is the player that was created by Video.js.
                 this.play()
                 // How about an event listener?
                 this.on('ended', function() {
                     videojs.log('Awww...over so soon?!');
                 });
             });
         }else {
                 let options ={
                     //  autoplay: true,  //自动播放
                     // language: 'zh-CN',
                     controls: true,  //控制条
                     preload: 'auto',  //自动加载
                     errorDisplay: true,  //错误展示
                     fluid: true,  //跟随外层容器变化大小，跟随的是外层宽度
                     // controlBar: false,  // 设为false不渲染控制条DOM元素，只设置controls为false虽然不展示，但还是存在
                     // textTrackDisplay: false,  // 不渲染字幕相关DOM
                     userActions: {
                         hotkeys: true  //是否支持热键
                     },
                     // sources: [
                     //     // {
                     //     //     src: type == '海康'?`rtmp://${rtmpIp}:${rtmpPort}/live/pag/${vagIp}/${vagPort}/${list&&list[0].number}/0/MAIN/TCP`:
                     //     //     `http://${httpIp}:${httpPort}/live/cameraid/${list&&list[0].number}%24${list&&list[0].channelNumber}/substream/${list&&list[0].byteType}.m3u8`
                     //     // }
                     // ]

                 }
                 this.player = videojs('my-video', options, function onPlayerReady() { //(id或者refs获取节点，options，回调函数)
                     videojs.log('Your player is ready!');
                     // In this context, `this` is the player that was created by Video.js.
                     this.play()
                     // How about an event listener?
                     this.on('ended', function() {
                         videojs.log('Awww...over so soon?!');
                     });
                 });
         }
}

   componentWillUnmount() {
       if (this.player) {
           this.player.dispose();
       }
   }

    enterpriseFiles = (e)=>{
        let id=this.state.id;
        if (id !== 0) {
            axios.ajax({
                url:'/supervision/enterprise/getById',
                data:{
                    params:{
                        id:id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    this.setState({
                        modalVisible:true,
                    })
                    let data = res.data;
                    this.props.changeEnterprise({...data,propagandaEnclosure:JSON.parse(data.propagandaEnclosure||JSON.stringify([]))});
                }
            })
        }
     }
    enterpriseWorkers =(id)=>{
        this.setState({
            enterpriseId:id,
            workerModalVisible:true,
        })
            }
     enterpriseRecords =(id)=>{
        this.setState({
            enterpriseId:id,
            videoInfo:this.props.videoInfo || {},
            recordModalVisible:true,
        })
            }
    setUrl = (value1,value2,value3)=>{
        const {httpIp,httpPort,rtmpIp,rtmpPort,vagIp,vagPort,type} = this.props.videoInfo
        let url = type=='海康'?`rtmp://${rtmpIp}:${rtmpPort}/live/pag/${vagIp}/${vagPort}/${value1}/0/MAIN/TCP`:
        `http://${httpIp}:${httpPort}/live/cameraid/${value1}%24${value2}/substream/${value3}.m3u8`
console.log(url)
        
            this.player.pause();
            this.player.src(url);
            this.player.load()
            this.player.play()
            this.setState({
                cutUrl:url
            })
    }
    setIscUrl=(value)=>{
         let that =this
        axios.ajax({
            url:'/HIKResource/getPageCamerasByCamerasIndex',
            data:{
                params:{
                    cameraIndexCode:value.cameraIndexCode,
                    streamType:value.streamType,
                    protocol:value.protocol,
                    transmode:value.transmode
                }
            }
        }).then((res)=>{
            if (res.status == "success" && res.data.code == "0") {
                this.player.pause();
                this.player.src(res.data.data.url);
                this.player.load();
                this.player.play()
                this.setState({
                    cutUrl:res.data.data.url
                })
            }
            else if (res.status == "success" && res.data.code == "0x01b01301"){
                Modal.error({
                    title: 'URL',
                    content: "无此监控点位，请检查监控点索引是否正确！",
                })
            }
            else{
                Modal.error({
                    title: 'URL',
                    content: "请求错误，请检查视频配置项是否正确！",
                })
            }
        })
    }
    videoCut =(value)=>{
        // let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        let order = `ffmpeg -i ${value} -vframes 1 -y -f image2 /usr/local/src/upload/cut/`
        axios.ajax({
            url:'/video/cut',
            data:{
                params:{
                     cmd:order
                }
                   
            }
        }).then((res)=>{
            if(res.status =='success'){
                if(!this.props.videoInfo.recordPicture1&&!this.props.videoInfo.recordPicture2){
                    this.changeInput(res.data,'recordPicture1')
                   
                }else if(this.props.videoInfo.recordPicture1&&!this.props.videoInfo.recordPicture2){
                    this.changeInput(res.data,'recordPicture2')
                }else if(this.props.videoInfo.recordPicture1&&this.props.videoInfo.recordPicture2){
                    const data=this.props.videoInfo;
                    data.recordPicture1=data.recordPicture2;
                    data.recordPicture2=res.data;
                    this.props.dispatchVideoData(data);
                }
            }
        })
    }
    changeInput=(value,option)=>{
         const data=this.props.videoInfo;
         data[option]=value;
         this.props.dispatchVideoData(data);
    }
    handleFocus(which){
        this.setState({
            [which]:true
        })
    }
    handleCloseModal(which){
           this.setState({
               [which]:false
           })
       }
       handleChooseInstruct=(record)=>{
        let value = this.props.videoInfo;
        value.handlePersonId = record.id;
        value.handlePersonName=record.name
        this.props.dispatchVideoData(value);
        this.handleCloseModal('handlePersonName');
    }

    render() {
        const videoInfo = this.props.videoInfo || {};
        this.state.id=videoInfo&&videoInfo.enterpriseId
        const list = this.props.videoInfo.list||[];
        
        const modal=(<Modal
           title="企业信息"
           visible={this.state.modalVisible}
           destroyOnClose
           centered={true}
           mask={false}
           width={1000}
           onCancel={()=>{
               this.props.clearEnterprise();
               this.setState({
                modalVisible:false,
               })
           }}
           footer={false}
       >
             <Add type={"detail"}/>
       </Modal>)
        return ( 
            <div className= {'videoCSS'}>
                <Row>
                    <Col span={3}>
                        <div style={{fontSize:16,width:123,height:25,backgroundColor:"#3385AD",color:"#FFFFFF",border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>视频监控位置</div>
                        <div style={{width:123,height:368,border:'1px solid #ddd'}}>
                            <table>
                                <tbody>
                                    {list.map((item,index)=>(
                                        <tr>
                                            <td style={{width:119}}>
                                                <Button
                                                    style={{width:119,backgroundColor:"#F2F2F2"}}
                                                    onClick={()=>{
                                                        if (unitName=="历下区" || unitName=="泰山区") {
                                                            this.setUrl(item.number,item.channelNumber,item.byteType)
                                                        }else {
                                                            this.setIscUrl(item)
                                                        }

                                                    }}
                                                    icon="desktop">{item.position}</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    
                    </Col>
                    <Col span={13}>
                        <video style={{width:600,height:393}} id="my-video" className="video-js"></video>
                    </Col>
                    <Col span={7}>
                        <div className="commonEnterpriseBox">
                            <div  style={{fontSize:16,width:318,height:35,color:"#FFFFFF",backgroundColor:"#99B87D",border:'1px solid #ddd',lineHeight:'35px',textAlign:"center"}}>企业基本信息</div>
                            <table>
                            <tbody>
                            <tr>
                                    <td>企业名称</td>
                                    <td><Input value={videoInfo.enterpriseName} /></td>
                                </tr>
                                <tr>
                                    <td>社会信用代码</td>
                                    <td><Input value={videoInfo.permissionId} /></td>
                                </tr>
                                <tr>
                                    <td>负责人</td>
                                    <td><Input value={videoInfo.charger} /></td>
                                </tr>
                                <tr>
                                    <td>联系电话</td>
                                    <td><Input value={videoInfo.contact} /></td>
                                </tr>
                                <tr>
                                    <td>所在区域</td>
                                    <td><Input value={videoInfo.areaName} /></td>
                                </tr>
                                <tr>
                                    <td>地址</td>
                                    <td><Input value={videoInfo.address}/></td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                        <Row>
                            <Col span={6}>
                                <div style={{marginLeft:-5}}><img src={BasicFile} onClick={()=> {this.enterpriseFiles(videoInfo.enterpriseId)}}/></div>
                            </Col>
                            <Col span={6}>
                                <div><img src={PeopleFile} onClick={()=> {this.enterpriseWorkers(videoInfo.enterpriseId)}}/></div>
                            </Col>
                                    <Modal
                                    title="企业员工信息"
                                    visible={this.state.workerModalVisible}
                                    width={1200}
                                    destroyOnClose
                                    centered={true}
                                    mask={false}
                                    onCancel={()=>{
                                        this.setState({
                                            workerModalVisible:false,
                                        })
                                    }}
                                    footer={false}
                                    >  
                                    <EmployeeList workerListId={this.state.enterpriseId}/>
                                </Modal>
                            <Col span={6}>
                                <div style={{marginLeft:5}}><img src={Patrol} alt={''} onClick={()=> {this.enterpriseRecords(videoInfo.enterpriseId)}}/></div>
                            </Col>
                            <Modal
                                    title="企业巡查记录"
                                    visible={this.state.recordModalVisible}
                                    width={1000}
                                    destroyOnClose
                                    centered={true}
                                    mask={false}
                                    onCancel={()=>{
                                        this.setState({
                                            recordModalVisible:false,
                                        })
                                    }}
                                    footer={false}
                                    >  
                                    <EnterpriseRecords  videoInfo={this.state.videoInfo||{}} enterpriseId={this.state.enterpriseId}/>
                                </Modal>
                            <Col span={6}>
                                <div style={{marginLeft:14}}><img src={CheckData} alt={''}/></div>
                            </Col>
                        </Row>      
                   </Col>
                </Row>
                <div  style={{fontSize:16,marginTop:5,width:100,height:25,backgroundColor:"#3385AD",color:"#FFFFFF",border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>巡查记录</div>
                <div style={{width:1110,height:230,border:'1px solid #ddd',verticalAlign:'middle'}}>
                    <Row>
                        <Col span={5}>
                        <div style={{width:196,height:100,marginTop:10,marginLeft:10,border:'1px solid #ddd',verticalAlign:'middle'}}>
                            <img src={commonUrl+'/upload/cut/'+videoInfo.recordPicture1} alt='' height={100} width={196}/>
                        </div>
                            
                        <div style={{width:196,height:100,marginTop:10,marginLeft:10,border:'1px solid #ddd',verticalAlign:'middle'}}>
                            <img src={commonUrl+'/upload/cut/'+videoInfo.recordPicture2} alt='' height={100} width={196}/>
                        </div>
                        </Col>

                <Col span={16}>
                    <Row style={{marginTop:10}}>
                        <Col span={3} style={{lineHeight:'32px'}}>记录人</Col>
                        <Col span={4}><Input onChange={(e)=>this.changeInput(e.target.value,'recordPerson')}/></Col>
                        <Col span={3} style={{lineHeight:'32px',textAlign:"center"}}>巡查日期<span style={{color:'#FF3300'}}>*</span></Col>
                        <Col span={6}> <DatePicker showTime placeholder="选择时间" onChange={(value)=>this.changeInput(value,"recordTime")}  /></Col>
                        <Col span={3} style={{lineHeight:'32px',textAlign:"center"}}>巡查等级<span style={{color:'#FF3300'}}>*</span></Col>
                        <Col span={5}> <Select style={{width:121}}   onChange={(value)=>this.changeInput(value,'level')}>
                                            <Option value={'一级警告'}>一级警告</Option>
                                            <Option value={'二级警告'}>二级警告</Option>
                                            <Option value={'三级警告'}>三级警告</Option>
                                      </Select></Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3} style={{lineHeight:'41px'}}>巡查记录<span style={{color:'#FF3300'}}>*</span></Col>
                        <Col span={20}><Input style={{height:41}}  onChange={(e)=>this.changeInput(e.target.value,'recordContent')}/></Col>
                    </Row>
                    <Row style={{marginTop:10,height:32}}>
                        <Col span={3} style={{lineHeight:'32px'}}>处理方式<span style={{color:'#FF3300'}}>*</span></Col>
                        <Col span={10} style={{lineHeight:'32px'}}>
                            <Radio.Group onChange={(e)=>this.changeInput(e.target.value,'type')}>
                                <Radio value={1}>直接处理</Radio>
                                <Radio value={2}>任务派发处理</Radio>
                                </Radio.Group>
                        </Col >
                        <Col span={4} style={{display:videoInfo.type==2?"block":"none",lineHeight:'32px',textAlign:"center"}}>请选择派发人<span style={{color:'#FF3300'}}>*</span></Col>
                        <Col span={6} style={{display:videoInfo.type==2?"block":"none"}}>
                            <Input value={videoInfo.handlePersonName}  onClick={()=>this.handleFocus("handlePersonName")}  type="search"/>
                            </Col>
                        <Modal
                            title="审核人列表"
                            visible={this.state.handlePersonName}
                            width={1000}
                            footer={<Button onClick={()=>this.handleCloseModal("handlePersonName")}>关闭</Button>}
                            onCancel={()=>this.handleCloseModal("handlePersonName")}>
                            <InstructList handleChooseInstruct={this.handleChooseInstruct}/>
                        </Modal>
                    </Row>
                    <Row style={{marginTop:10,display:videoInfo.type==1?"block":"none"}}>
                        <Col span={3} style={{lineHeight:'73px'}}>处理意见<span style={{color:'#FF3300'}}>*</span></Col>
                        <Col span={20}><TextArea style={{height:73}}  onChange={(e)=>this.changeInput(e.target.value,'handleContent')}/></Col>
                    </Row>
                </Col>
                <Col span={3}>
                            <div>
                                <Button style={{height:45,marginTop:7,color:"white",marginLeft:25,backgroundColor:"#3385AD"}}
                                onClick={()=>this.videoCut(this.state.cutUrl)}>远程取证</Button>
                                <Button style={{height:45,marginTop:27,color:"white",marginLeft:25,backgroundColor:"#3385AD"}}>常见问题</Button>
                                <Button style={{height:72,width:104,marginTop:24,color:"white",marginLeft:25,backgroundColor:"#8578D0",display:videoInfo.type==1?"block":"none"}}
                                 onClick={()=>this.props.handleSubmit()}>
                                    结束检查
                                </Button>
                                <Button style={{height:72,width:104,marginTop:24,color:"white",marginLeft:25,backgroundColor:"#ADC12A",display:videoInfo.type==2?"block":"none"}}
                                 onClick={()=>this.props.handleSubmit()}>
                                    任务派发
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                {modal}
            </div>
        );
}
}
export default LiveVideo;