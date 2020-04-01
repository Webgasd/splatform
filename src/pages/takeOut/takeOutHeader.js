import React,{Component} from 'react';
import SelectImg from  './img/select.png'
import LeftSplitLine from './img/leftSplitLine.png'
import RightSplitLine from './img/rightSplitLine.png'

class takeOutHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className='takeOutHeader'>
                <table>
                    <tr>
                        <td>
                            <div className='headerLeft'>
                                <div className='headerLabel'><div className='labelContent'><div className='contentText'>店铺采集</div></div></div>
                                <div className='headerLabel'><div className='labelContent'><div className='contentText'>数据识别</div></div></div>
                                <div className='headerLabel'><div className='labelContent'><div className='contentText'>数据核验</div></div></div>
                                <div className='headerLabel'><div className='labelContent'><div className='contentText'>违规汇总</div></div></div>
                                <div className='headerLabel'><div className='labelContent'><div className='contentText'>一证多用</div></div></div>
                            </div>
                        </td>
                        <td>
                            <div className='headerCenter' style={{backgroundImage: "url(" + require("./img/titleCenter.png") + ")"}}>
                                <div className='headerCenterContent'>历下区食品药品监督管理局网络订餐监管数据中心</div>
                            </div>
                        </td>
                        <td>
                            <div className='headerRight'>
                                <div className='headerTime'>
                                    <div className='timeFirst'>2019-06-06</div>
                                    <div className='timeSecond'>14:00 星期六</div>
                                </div>
                                <div className='headerLabel'><div className='labelContent'><img src={SelectImg} alt={""}/>搜索</div></div>
                                <div className='headerLabel'><div className='labelContent'>
                                    <select>
                                        <option value="" disabled selected hidden>请选择违规类型</option>
                                        <option value ="volvo">Volvo</option>
                                        <option value ="saab">Saab</option>
                                        <option value="opel">Opel</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div></div>
                                <div className='headerLabel'><div className='labelContent'>
                                    <select>
                                        <option value="" disabled selected hidden>请选择平台类型</option>
                                        <option value ="volvo">Volvo</option>
                                        <option value ="saab">Saab</option>
                                        <option value="opel">Opel</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div></div>
                                <div className='headerLabel'><div className='labelContent'>
                                    <select>
                                        <option value="" disabled selected hidden>请选择区域</option>
                                        <option value ="volvo">Volvo</option>
                                        <option value ="saab">Saab</option>
                                        <option value="opel">Opel</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div></div>
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

export default takeOutHeader