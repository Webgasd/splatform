import React,{Component} from 'react';
import Homepage from './img/homepage.png'
import picLogo from "../../components/Header/u100.png";
import LeftSplitLine from "../takeOut/img/leftSplitLine.png";
import RightSplitLine from "../takeOut/img/rightSplitLine.png";
import moment from 'moment';

class samplingHeader extends Component {
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
        return (
            <div className='samplingHeader'>
                <table>
                    <tr>
                        <td style={{width:'31%'}}>
                            <div className='left'>
                                <div className='leftImg' style={{border:'1px solid #2F4554',verticalAlign:'middle'}}><img src={Homepage} alt={''}/></div>
                                <div className='leftLabel'>{moment().format('YYYY-MM-DD')}</div>
                                <div className='leftLabel'>{moment().format('hh:mm')}</div>
                                <div className='leftLabel'>{moment().format('dddd')}</div>
                            </div>
                        </td>
                        <td style={{width:'38%'}}>
                            <div className='center' style={{backgroundImage: "url(" + require("./img/titleCenter.png") + ")",width:490,marginLeft:'auto',marginRight:'auto',marginTop:10}}>
                                <img style={{float:'left',height:31,marginLeft:85}} src={picLogo}/><div className='headerCenterContent' style={{width:400,height:40,fontSize:20,color:'aliceblue',marginLeft:125}}>历下区抽检检测数据统计分析图</div>
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

export default samplingHeader