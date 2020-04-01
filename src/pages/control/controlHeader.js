import React,{Component} from 'react';
import Homepage from './img/homepage.png'
import picLogo from './img/u100.png'
import moment from 'moment';
import './style.less'
import LeftSplitLine from "../takeOut/img/leftSplitLine.png";
import RightSplitLine from "../takeOut/img/rightSplitLine.png";

class takeOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

    render() {
        var myDate = new Date();
        var h=myDate.getHours();
        var m=myDate.getMinutes();
        return (
            <div className='controlHeader'>
                <table>
                    <tr>
                        <td  style={{width:'31%'}}>
                            <div className='left'>
                                <div className='leftImg' style={{border:'1px solid #09488E',verticalAlign:'middle'}}><img src={Homepage} alt={''}/></div>
                                <div className='leftLabel'>{moment().format('YYYY-MM-DD hh:mm')}</div>
                                <div className='leftLabel'>{moment().format('dddd')}</div>
                                <div className='leftLabel'></div>
                            </div>
                        </td>
                        <td style={{width:'38%'}}>
                            <div className='center' style={{backgroundImage: "url(" + require("./img/titleCenter.png") + ")",width:490,marginLeft:'auto',marginRight:'auto',marginTop:10}}>
                            <img style={{float:'left',height:31,marginLeft:75}} src={picLogo}/>
                                <div style={{width:400,height:40,fontSize:23,color:'aliceblue',marginLeft:15}}>
                                历下区餐饮预警管控数据平台
                            </div>
                            </div>
                        </td>

                        <td>
                            <div className='right'>

                                <div className='rightLabel'>
                                    <div className="textButton2" style={{marginTop:'7px',border:'2px solid #27527F',verticalAlign:'middle'}}onClick={()=>{this.handlecontrolClick()}}>应急事件报送</div>
                                </div>
                                <div className='rightLabel'>
                                    <div className="textButton2" style={{marginTop:'7px',border:'2px solid #27527F',verticalAlign:'middle'}}onClick={()=>{this.handlequickClick()}}>快检大数据</div>
                                </div>
                                <div className='rightLabel'>
                                    <div className="textButton2" style={{marginTop:'7px',border:'2px solid #27527F',verticalAlign:'middle'}}onClick={()=>{this.handlespotClick()}}>抽检大数据</div>
                                </div>
                                  </div>
                        </td>
                    </tr>
                    <tr className='splitLine'>
                        <td><img src={LeftSplitLine} alt={''}/></td>
                        <td></td>
                        <td><img src={RightSplitLine} alt={''} style={{right:'0'}}/></td>
                    </tr>
                </table>
            </div>
        )
    }
}

export default takeOut