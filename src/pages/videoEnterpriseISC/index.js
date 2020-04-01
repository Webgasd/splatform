import React,{ Component } from 'react';
import { Row, Col,Button,Modal} from 'antd';
import connect from "react-redux/es/connect/connect";
import axios from "./../../axios";
import videojs from 'video.js';
import 'videojs-flash';  //如果要播放RTMP要使用flash 需要先npm i videojs-flash
import 'video.js/dist/video-js.css';
import {commonUrl, unitName} from '../../axios/commonSrc'

@connect(
    state=>({
         enterpriseId:state.userInfo.id
    })
)
 class HikIscForEnterprise extends Component{
    state={
       videoInfo:{},
       list:[]
     }
     
     componentDidMount() {
        this.requestList().then((res)=>{
           
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
        })
    }

   componentWillUnmount() {
       if (this.player) {
           this.player.dispose();
       }
   }
   requestList = ()=>{
    let _this = this;
    return new Promise(function(resolve, reject) { 
        axios.ajax({
            url:'/videoIsc/selectByEnterpriseId',
            data:{
                params: {
                    id:_this.props.enterpriseId
                    // id:93868
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                _this.setState({
                    list:res.data.list,
                })
                resolve(res.data)
            }
        })
    });
   
}

    
setUrl = (value)=>{
    value.region=unitName;
    axios.ajax({
        url:'/HIKResource/getPageCamerasByCamerasIndex',
        data:{
            params: value
        }
    }).then((res)=> {
        if (res.status == "success" && res.data.code == "0") {
            this.player.pause();
            this.player.src(res.data.data.url);
            this.player.load();
            this.player.play()
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
    
    render() {
         const list = this.state.list||[];
        
        return ( 
            <div >
                <Row>
                    <Col span={5}>
                        <div style={{float:'right'}}>
                            <div style={{fontSize:16,backgroundColor:"#3385AD",color:"#FFFFFF",width:177,height:38,border:'1px solid #ddd',paddingTop:7,textAlign:"center"}}>视频监控位置</div>
                            <div style={{width:177,height:668,border:'1px solid #ddd'}}>
                                <table>
                                    <tbody>
                                        {list.map((item,index)=>(
                                            <tr>
                                                <td style={{width:177}}>
                                                    <Button style={{width:173,backgroundColor:"#F2F2F2"}} onClick={()=>{this.setUrl(item)}} icon="desktop">{item.position}</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{position:"absolute",bottom:0}}>提示：点击监控位置按钮播放</div>
                            </div>
                            
                        </div>
                    </Col>
                    <Col span={19} style={{width:1253,height:705}}>
                        <video  id="my-video" className="video-js"></video>
                    </Col>
                </Row>
                </div>
        );
}
}
export default HikIscForEnterprise;