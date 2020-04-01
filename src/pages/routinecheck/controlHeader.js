import React,{Component} from 'react';
import picLogo from './img/u100.png'
import './style.less'


class takeOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullScreen: false
        }
    }
    handlequickClick = ()=>{
        window.location.href = '#/quick';
    }
    handlespotClick = ()=>{
        window.location.href = '#/samplingstatistics';
    }
    handlecontrolClick = ()=>{
        window.location.href = '#/control';
    }
  
    componentDidMount = () => {
        this.watchFullScreen()
    }
        
    fullScreen = () => {
    console.log('fullscreen:',this.state.isFullScreen);
        if (!this.state.isFullScreen) {
          this.requestFullScreen();
        } else {
          this.exitFullscreen();
        }
    };
    
    //进入全屏
    requestFullScreen = () => {
     console.log('requestFullScreen')
          var de = document.documentElement;
          if (de.requestFullscreen) {
            de.requestFullscreen();
          } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
          } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
          }
    };
    
    //退出全屏
    exitFullscreen = () => {
    console.log('exitFullscreen')
        var de = document;
          if (de.exitFullscreen) {
            de.exitFullscreen();
          } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
          } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
          }
    };
    
    //监听fullscreenchange事件
    watchFullScreen = () => {
        const _self = this;
          document.addEventListener(
        "webkitfullscreenchange",
        function() {
          _self.setState({
            isFullScreen: document.webkitIsFullScreen
          });
        },
        false
        );
    };
    render() {
 

        return (
            <div className='controlHeader1'>
                <table>
                    <tr>
                        <td  style={{width:'30%'}}>
                            <div className='left' style={{border:'2px solid #A7B5C4',verticalAlign:'middle'}}>
                                <div className='text1' style={{backgroundColor: '#A4C93E',cursor:'pointer'}}>全部</div>
                                <div className='text1'style={{backgroundColor: '#479AD0',width:'23%',cursor:'pointer'}}>餐饮服务</div>
                                <div className='text1'style={{backgroundColor: '#479AD0',width:'23%',cursor:'pointer'}}>食品流通</div>
                                <div className='text1'style={{backgroundColor: '#479AD0',width:'23%',cursor:'pointer'}}>食品生产</div>
                            </div>
                        </td>
                        <td style={{width:'50%'}}>
                            <div className='center' style={{backgroundColor:'#263D5C' }}>
                            <img style={{float:'left',height:31,marginLeft:55,marginTop:10}} src={picLogo}/>
                                <div style={{height:60,fontSize:23,color:'aliceblue',marginLeft:100}}>
                                市场监督管理局日常检查数据分析平台
                            </div>
                            </div>
                        </td>

                        <td>
                            
                            <div className='left' style={{backgroundColor:'#1A3352',border:'0px solid #A7B5C4'}}>
                                <div className='text3'  >
                            <div className='text2' style={{backgroundColor:'#1A3352',height:40,border:'0px solid #A7B5C4',color:'#4685B6'}} >检查年度</div>
                                <div className='text2' style={{backgroundColor:'#65768A',border:'0px solid #A7B5C4',height:30,width:'40%'}}>2019年</div>
                                </div>
                                <div className='text1' onClick={this.fullScreen} style={{ marginTop:0, height: 54,lineHeight:3.5,width:'30%',color:'#4685B6'}} >全屏展示</div> 
                                </div>
                               
                            
                
                               
                         
                        </td>
                    </tr>
                   
                </table>
            </div>
        )
    }
}

export default takeOut